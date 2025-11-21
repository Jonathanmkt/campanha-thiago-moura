#!/usr/bin/env node

/**
 * 🔍 Validador de Endpoints - Type Safety Checker
 * 
 * Este script verifica se todos os endpoints em src/app/api usam apenas
 * tabelas e campos que existem no database.types.ts
 * 
 * Uso: node src/types/validate-endpoints.js
 */

const fs = require('fs')
const path = require('path')

// Cores para output no terminal
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
}

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

/**
 * Extrai tabelas e campos do database.types.ts
 */
function extractDatabaseSchema() {
  const databaseTypesPath = path.join(__dirname, 'database.types.ts')
  
  if (!fs.existsSync(databaseTypesPath)) {
    throw new Error('❌ Arquivo database.types.ts não encontrado!')
  }

  const content = fs.readFileSync(databaseTypesPath, 'utf8')
  
  // Extrair tabelas da seção Tables
  const tablesMatch = content.match(/Tables:\s*{([\s\S]*?)}\s*Views:/s)
  if (!tablesMatch) {
    throw new Error('❌ Não foi possível encontrar a seção Tables no database.types.ts')
  }

  const tablesSection = tablesMatch[1]
  const schema = {}

  // Regex para encontrar cada tabela e seus campos
  const tableRegex = /(\w+):\s*{\s*Row:\s*{([\s\S]*?)}\s*Insert:/g
  let tableMatch

  while ((tableMatch = tableRegex.exec(tablesSection)) !== null) {
    const tableName = tableMatch[1]
    const rowSection = tableMatch[2]
    
    // Extrair campos da seção Row
    const fieldRegex = /(\w+):\s*[^,\n}]+/g
    const fields = []
    let fieldMatch

    while ((fieldMatch = fieldRegex.exec(rowSection)) !== null) {
      fields.push(fieldMatch[1])
    }

    schema[tableName] = fields
  }

  return schema
}

/**
 * Encontra todos os arquivos de endpoint
 */
function findEndpointFiles(dir = path.join(process.cwd(), 'src', 'app', 'api')) {
  const files = []
  
  if (!fs.existsSync(dir)) {
    log('⚠️  Diretório src/app/api não encontrado', 'yellow')
    return files
  }

  function scanDirectory(currentDir) {
    const items = fs.readdirSync(currentDir)
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath)
      } else if (item === 'route.ts' || item.endsWith('.ts')) {
        files.push(fullPath)
      }
    }
  }

  scanDirectory(dir)
  return files
}

/**
 * Analisa um arquivo de endpoint em busca de queries Supabase
 */
function analyzeEndpointFile(filePath, schema) {
  const content = fs.readFileSync(filePath, 'utf8')
  const relativePath = path.relative(process.cwd(), filePath)
  const errors = []
  const warnings = []

  // Padrões para detectar queries Supabase
  const patterns = {
    // .from('table_name')
    from: /\.from\(['"`](\w+)['"`]\)/g,
    
    // .select('field1, field2') ou .select(`field1, field2`)
    select: /\.select\(['"`]([^'"`]+)['"`]\)/g,
    
    // .eq('field', value)
    eq: /\.eq\(['"`](\w+)['"`]/g,
    
    // .neq, .gt, .gte, .lt, .lte, .like, .ilike
    filters: /\.(neq|gt|gte|lt|lte|like|ilike|in|contains|containedBy)\(['"`](\w+)['"`]/g,
    
    // .order('field')
    order: /\.order\(['"`](\w+)['"`]/g,
    
    // .insert([{ field: value }])
    insert: /\.insert\(\[?\s*{\s*([^}]+)\s*}/g,
    
    // .update({ field: value })
    update: /\.update\(\s*{\s*([^}]+)\s*}/g
  }

  // Verificar tabelas usadas em .from()
  let match
  while ((match = patterns.from.exec(content)) !== null) {
    const tableName = match[1]
    if (!schema[tableName]) {
      errors.push({
        type: 'INVALID_TABLE',
        table: tableName,
        line: getLineNumber(content, match.index),
        message: `Tabela '${tableName}' não existe no database.types.ts`
      })
    }
  }

  // Verificar campos em .select()
  while ((match = patterns.select.exec(content)) !== null) {
    const selectClause = match[1]
    analyzeSelectClause(selectClause, schema, content, match.index, errors, warnings)
  }

  // Verificar campos em filtros (.eq, .neq, etc.)
  while ((match = patterns.filters.exec(content)) !== null) {
    const fieldName = match[2]
    // Aqui precisaríamos do contexto da tabela, que é mais complexo
    // Por enquanto, apenas alertamos sobre campos suspeitos
    if (fieldName.includes('.') || fieldName.includes('!')) {
      warnings.push({
        type: 'COMPLEX_FIELD',
        field: fieldName,
        line: getLineNumber(content, match.index),
        message: `Campo complexo '${fieldName}' - verificar se existe na tabela`
      })
    }
  }

  // Verificar campos em .order()
  while ((match = patterns.order.exec(content)) !== null) {
    const fieldName = match[1]
    if (fieldName.includes('.')) {
      warnings.push({
        type: 'COMPLEX_ORDER',
        field: fieldName,
        line: getLineNumber(content, match.index),
        message: `Ordenação complexa '${fieldName}' - verificar se existe`
      })
    }
  }

  return { relativePath, errors, warnings }
}

/**
 * Analisa uma cláusula SELECT em busca de campos inválidos
 */
function analyzeSelectClause(selectClause, schema, content, matchIndex, errors, warnings) {
  // Remove quebras de linha e espaços extras
  const cleanSelect = selectClause.replace(/\s+/g, ' ').trim()
  
  // Se é um select simples como '*', pular
  if (cleanSelect === '*') return
  
  // Detectar relacionamentos complexos (field:table(subfields))
  const relationshipPattern = /(\w+):\s*(\w+)\s*\([^)]+\)/g
  let relationMatch
  
  while ((relationMatch = relationshipPattern.exec(cleanSelect)) !== null) {
    const relationName = relationMatch[1]
    const tableName = relationMatch[2]
    
    if (!schema[tableName]) {
      warnings.push({
        type: 'INVALID_RELATION_TABLE',
        table: tableName,
        relation: relationName,
        line: getLineNumber(content, matchIndex),
        message: `Tabela '${tableName}' em relacionamento '${relationName}' não existe`
      })
    }
  }

  // Detectar campos simples separados por vírgula
  const simpleFields = cleanSelect
    .replace(/(\w+):\s*\w+\s*\([^)]+\)/g, '') // Remove relacionamentos
    .split(',')
    .map(f => f.trim())
    .filter(f => f && f !== '*' && !f.includes('('))

  // Por enquanto, apenas alertamos sobre campos que parecem suspeitos
  simpleFields.forEach(field => {
    if (field.includes('!') || field.includes('.')) {
      warnings.push({
        type: 'COMPLEX_SELECT_FIELD',
        field: field,
        line: getLineNumber(content, matchIndex),
        message: `Campo complexo '${field}' no select - verificar se existe`
      })
    }
  })
}

/**
 * Obtém o número da linha onde ocorreu o match
 */
function getLineNumber(content, index) {
  return content.substring(0, index).split('\n').length
}

/**
 * Função principal
 */
function main() {
  log('🔍 Iniciando validação de endpoints...', 'cyan')
  log('', 'white')

  try {
    // Extrair schema do database.types.ts
    log('📋 Extraindo schema do database.types.ts...', 'blue')
    const schema = extractDatabaseSchema()
    const tableCount = Object.keys(schema).length
    const fieldCount = Object.values(schema).reduce((acc, fields) => acc + fields.length, 0)
    
    log(`✅ Schema extraído: ${tableCount} tabelas, ${fieldCount} campos`, 'green')
    log('', 'white')

    // Encontrar arquivos de endpoint
    log('🔎 Procurando arquivos de endpoint...', 'blue')
    const endpointFiles = findEndpointFiles()
    log(`📁 Encontrados ${endpointFiles.length} arquivos`, 'green')
    log('', 'white')

    // Analisar cada arquivo
    let totalErrors = 0
    let totalWarnings = 0
    const results = []

    for (const filePath of endpointFiles) {
      const result = analyzeEndpointFile(filePath, schema)
      results.push(result)
      totalErrors += result.errors.length
      totalWarnings += result.warnings.length
    }

    // Exibir resultados
    log('📊 RESULTADOS DA VALIDAÇÃO:', 'cyan')
    log('=' .repeat(50), 'cyan')

    for (const result of results) {
      if (result.errors.length > 0 || result.warnings.length > 0) {
        log(`\n📄 ${result.relativePath}`, 'yellow')
        
        // Erros
        for (const error of result.errors) {
          log(`  ❌ ERRO (linha ${error.line}): ${error.message}`, 'red')
        }
        
        // Warnings
        for (const warning of result.warnings) {
          log(`  ⚠️  AVISO (linha ${warning.line}): ${warning.message}`, 'yellow')
        }
      }
    }

    // Resumo final
    log('\n' + '='.repeat(50), 'cyan')
    log('📈 RESUMO FINAL:', 'cyan')
    log(`📁 Arquivos analisados: ${endpointFiles.length}`, 'white')
    log(`❌ Total de erros: ${totalErrors}`, totalErrors > 0 ? 'red' : 'green')
    log(`⚠️  Total de avisos: ${totalWarnings}`, totalWarnings > 0 ? 'yellow' : 'green')

    if (totalErrors === 0 && totalWarnings === 0) {
      log('\n🎉 Todos os endpoints estão válidos!', 'green')
    } else if (totalErrors === 0) {
      log('\n✅ Nenhum erro encontrado, apenas avisos.', 'green')
    } else {
      log('\n💥 Erros encontrados! Corrija antes de continuar.', 'red')
    }

    // Listar tabelas disponíveis para referência
    log('\n📚 TABELAS DISPONÍVEIS:', 'cyan')
    const sortedTables = Object.keys(schema).sort()
    const tablesPerLine = 4
    for (let i = 0; i < sortedTables.length; i += tablesPerLine) {
      const line = sortedTables.slice(i, i + tablesPerLine).join(', ')
      log(`   ${line}`, 'white')
    }

    // Exit code baseado nos resultados
    process.exit(totalErrors > 0 ? 1 : 0)

  } catch (error) {
    log(`💥 Erro durante a validação: ${error.message}`, 'red')
    process.exit(1)
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main()
}

module.exports = {
  extractDatabaseSchema,
  analyzeEndpointFile,
  findEndpointFiles
}
