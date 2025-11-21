#!/usr/bin/env node

/**
 * Script para geração automática de tipos TypeScript do Supabase
 * Projeto: Campanha Thiago Moura 2026
 * 
 * Este script gera TODOS os tipos TypeScript do Supabase diretamente
 * usando o token de acesso do Supabase e o ID do projeto
 * 
 * Uso: npm run generate-types
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Carregar variáveis de ambiente do arquivo .env
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

// Cores para output no terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logError(message) {
  log(`❌ ERRO: ${message}`, 'red');
}

function logSuccess(message) {
  log(`✅ SUCESSO: ${message}`, 'green');
}

function logInfo(message) {
  log(`ℹ️  INFO: ${message}`, 'blue');
}

function getSupabaseConfig() {
  // Obter variáveis do ambiente carregadas pelo dotenv
  const projectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID;
  const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
  
  if (!accessToken) {
    logError('SUPABASE_ACCESS_TOKEN não encontrado no arquivo .env');
    logInfo('Certifique-se de que o arquivo .env contém SUPABASE_ACCESS_TOKEN=seu_token');
    return null;
  }
  
  return {
    projectId,
    accessToken
  };
}

function generateTypes() {
  logInfo('Gerando tipos TypeScript do Supabase para Campanha Thiago Moura...');
  
  try {
    // Obter configurações do Supabase
    const config = getSupabaseConfig();
    if (!config) {
      throw new Error('Configurações do Supabase não encontradas no arquivo .env');
    }
    
    const { projectId, accessToken } = config;
    
    logInfo(`🔍 Conectando ao projeto Supabase: ${projectId}`);
    
    // Definir variável de ambiente para o CLI
    process.env.SUPABASE_ACCESS_TOKEN = accessToken;
    
    // Tentar usar o comando oficial do Supabase CLI
    const outputPath = path.join(__dirname, 'database.types.ts');
    
    try {
      logInfo('🚀 Gerando tipos com Supabase CLI...');
      const genCommand = `npx supabase gen types typescript --project-id ${projectId}`;
      const result = execSync(genCommand, { 
        encoding: 'utf8', 
        stdio: 'pipe',
        env: { ...process.env, SUPABASE_ACCESS_TOKEN: accessToken }
      });
      
      if (result && result.includes('export type Database')) {
        // Salvar resultado do CLI
        const header = `/**
 * Tipos TypeScript gerados automaticamente do Supabase
 * Projeto: Campanha Thiago Moura 2026
 * 
 * ⚠️  ATENÇÃO: Este arquivo é gerado automaticamente!
 * Não edite manualmente. Execute 'npm run generate-types' para atualizar.
 * 
 * Última atualização: ${new Date().toISOString()}
 * Projeto ID: ${projectId}
 */

`;
        
        // Criar diretório se não existir
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }
        
        fs.writeFileSync(outputPath, header + result, 'utf8');
        
        // Extrair e listar tabelas encontradas
        const tableMatches = result.match(/(\w+):\s*{[\s\S]*?Row:/g);
        if (tableMatches) {
          const tables = tableMatches.map(match => match.split(':')[0].trim());
          logSuccess(`${tables.length} tabelas encontradas e tipos gerados:`);
          tables.forEach(table => log(`   📋 ${table}`, 'cyan'));
        }
        
        logSuccess('Tipos gerados com sucesso via Supabase CLI!');
        return result;
      } else {
        throw new Error('CLI retornou resposta inválida ou vazia');
      }
    } catch (cliError) {
      logError(`Erro do CLI: ${cliError.message}`);
      throw new Error(`Falha ao gerar tipos via Supabase CLI: ${cliError.message}`);
    }
    
  } catch (error) {
    logError(`Erro fatal: ${error.message}`);
    logError('🔧 SOLUÇÕES POSSÍVEIS:');
    logError('   1. Verifique se NEXT_PUBLIC_SUPABASE_PROJECT_ID está correto no .env');
    logError('   2. Verifique se SUPABASE_ACCESS_TOKEN está correto no .env');
    logError('   3. Verifique se o projeto Supabase existe e tem tabelas');
    logError('   4. Verifique sua conexão com a internet');
    logError('   5. Execute "npx supabase login" se necessário');
    logError('   6. Instale o Supabase CLI: npm install -g supabase');
    logError('');
    logError('❌ NENHUM ARQUIVO FOI ALTERADO devido aos erros acima.');
    process.exit(1);
  }
}

function validateTypes() {
  logInfo('Validando tipos gerados...');
  
  const typesPath = path.join(__dirname, 'database.types.ts');
  
  if (!fs.existsSync(typesPath)) {
    logError('Arquivo de tipos não foi criado');
    return false;
  }
  
  const content = fs.readFileSync(typesPath, 'utf8');
  
  if (content.length < 500) {
    logError('Arquivo de tipos parece estar vazio ou incompleto');
    return false;
  }
  
  if (!content.includes('export type Database')) {
    logError('Arquivo de tipos não contém a estrutura esperada');
    return false;
  }
  
  // Verificar se contém estruturas específicas do Supabase
  const requiredStructures = ['Tables', 'Views', 'Functions', 'Enums'];
  const missingStructures = requiredStructures.filter(structure => !content.includes(structure));
  
  if (missingStructures.length > 0) {
    logError(`Estruturas ausentes no arquivo de tipos: ${missingStructures.join(', ')}`);
    return false;
  }
  
  logSuccess('Tipos validados com sucesso');
  return true;
}

function generateHelperTypes() {
  logInfo('Gerando tipos auxiliares...');
  
  const helperTypesPath = path.join(__dirname, 'index.ts');
  
  const helperContent = `/**
 * Tipos auxiliares para o projeto Campanha Thiago Moura 2026
 * 
 * Este arquivo contém tipos auxiliares e re-exports dos tipos do Supabase
 * para facilitar o uso em toda a aplicação.
 * 
 * Última atualização: ${new Date().toISOString()}
 */

// Re-export dos tipos principais do Supabase
export type { Database, Json } from './database.types';

// Tipos auxiliares para tabelas específicas
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Tipos para Views
export type Views<T extends keyof Database['public']['Views']> = Database['public']['Views'][T]['Row'];

// Tipos para Enums
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

// Tipos específicos do projeto (adicione conforme necessário)
export interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tipos para autenticação
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  role?: string;
}

// Tipos para formulários
export interface FormState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

// Tipos para filtros e ordenação
export interface FilterOptions {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Tipos para status de operações
export type OperationStatus = 'idle' | 'loading' | 'success' | 'error';

// Tipos para componentes comuns
export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

// Tipos para notificações
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}
`;

  try {
    fs.writeFileSync(helperTypesPath, helperContent, 'utf8');
    logSuccess('Tipos auxiliares gerados com sucesso');
    return true;
  } catch (error) {
    logError(`Falha ao gerar tipos auxiliares: ${error.message}`);
    return false;
  }
}

function main() {
  log('\n🚀 Iniciando geração de tipos TypeScript do Supabase', 'bright');
  log('📋 Projeto: Campanha Thiago Moura 2026\n', 'cyan');
  
  try {
    // Verificar se arquivo de tipos existe (backup de segurança)
    const typesPath = path.join(__dirname, 'database.types.ts');
    let backupContent = null;
    
    if (fs.existsSync(typesPath)) {
      backupContent = fs.readFileSync(typesPath, 'utf8');
      logInfo('📋 Backup do arquivo atual criado em memória');
    }
    
    // 1. Gerar tipos principais (já salva automaticamente)
    const typesContent = generateTypes();
    
    // 2. Validar resultado
    const isValid = validateTypes();
    
    if (!isValid) {
      logError('Falha na validação dos tipos gerados');
      process.exit(1);
    }
    
    // 3. Gerar tipos auxiliares
    const helpersGenerated = generateHelperTypes();
    
    if (!helpersGenerated) {
      logError('Falha ao gerar tipos auxiliares');
      process.exit(1);
    }
    
    log('\n🎉 TODOS os tipos TypeScript foram gerados com sucesso!', 'green');
    logInfo('📁 Arquivos gerados:');
    logInfo('   📄 src/types/database.types.ts - Tipos do Supabase');
    logInfo('   📄 src/types/index.ts - Tipos auxiliares e re-exports');
    logInfo('');
    logInfo('💡 Como usar:');
    logInfo('   import { Database, Tables, ApiResponse } from "@/types"');
    logInfo('   import type { Tables } from "@/types"');
    logInfo('');
    logInfo('🔄 Para atualizar os tipos novamente: npm run generate-types');
    
  } catch (error) {
    logError(`Erro inesperado: ${error.message}`);
    process.exit(1);
  }
}

// Executar script
if (require.main === module) {
  main();
}

module.exports = {
  generateTypes,
  validateTypes,
  generateHelperTypes,
  main
};
