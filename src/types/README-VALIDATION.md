# 🔍 Validador de Endpoints - Type Safety Checker

## 📋 Visão Geral

Este script é nossa **ferramenta obrigatória** para garantir que todos os endpoints em `src/app/api` usem apenas tabelas e campos que existem no `database.types.ts`.

## 🚀 Como Usar

### Comando Rápido
```bash
npm run validate-endpoints
# ou
npm run check-api
```

### Comando Direto
```bash
node src/types/validate-endpoints.js
```

## 📊 O que o Script Verifica

### ✅ **Validações Realizadas:**

1. **Tabelas Existentes:**
   - Verifica se todas as tabelas usadas em `.from('tabela')` existem no schema
   - ❌ **ERRO**: Tabela não existe no `database.types.ts`

2. **Campos em Queries:**
   - Analisa campos em `.select()`, `.eq()`, `.order()`, etc.
   - ⚠️ **AVISO**: Campo complexo ou relacionamento suspeito

3. **Relacionamentos:**
   - Verifica relacionamentos em queries complexas
   - ⚠️ **AVISO**: Tabela em relacionamento não existe

### 📈 **Tipos de Resultado:**

- **❌ ERRO**: Problema crítico que deve ser corrigido
- **⚠️ AVISO**: Possível problema que deve ser verificado
- **✅ SUCESSO**: Todos os endpoints estão válidos

## 🛠️ **Workflow Obrigatório**

### 1. **Antes de Criar Endpoints:**
```bash
npm run validate-endpoints
```

### 2. **Após Modificar database.types.ts:**
```bash
npm run generate-types
npm run validate-endpoints
```

### 3. **Antes de Commit:**
```bash
npm run validate-endpoints
npm run type-check
npm run lint
```

## 📚 **Tabelas Disponíveis**

O script sempre mostra as tabelas disponíveis no final:

```
📚 TABELAS DISPONÍVEIS:
   area, colaborador, colaborador_departamento, colaborador_equipe
   departamento, eleitor, equipamento, equipe
   evento, labels, lideranca, lideranca_area
   lideranca_eleitor, material, municipio, pesquisa_quantitativa
   profiles, projects, projeto_equipe, spatial_ref_sys
   sprints, task_assignees, task_attachments, task_comments
   task_dependencies, task_labels, task_statuses, task_watchers
   tasks, time_entries, workflows
```

## 🔧 **Padrões Detectados**

### ✅ **Queries Válidas:**
```typescript
// Tabela existe
supabase.from('colaborador').select('*')

// Campos simples
supabase.from('projects').select('id, name, status')

// Relacionamentos simples
supabase.from('colaborador').select('*, profiles(name, email)')
```

### ❌ **Queries Inválidas:**
```typescript
// Tabela não existe
supabase.from('project_members').select('*') // ❌ ERRO

// Tabela inexistente em relacionamento
supabase.from('tasks').select('*, invalid_table(*)') // ⚠️ AVISO
```

## 🎯 **Benefícios**

1. **🛡️ Type Safety**: Garante que apenas tabelas/campos válidos sejam usados
2. **🚀 Menos Erros**: Detecta problemas antes do runtime
3. **📋 Documentação**: Lista todas as tabelas disponíveis
4. **⚡ Automação**: Integra com CI/CD e git hooks
5. **🔍 Auditoria**: Analisa todo o projeto automaticamente

## 🚨 **Regras Obrigatórias**

### ❗ **NUNCA commite código com erros de validação**
```bash
# Se houver erros:
❌ Total de erros: 3
💥 Erros encontrados! Corrija antes de continuar.
# Exit code: 1
```

### ✅ **Apenas commits com validação limpa**
```bash
# Quando estiver limpo:
✅ Nenhum erro encontrado, apenas avisos.
🎉 Todos os endpoints estão válidos!
# Exit code: 0
```

## 🔄 **Integração com Git Hooks**

Adicione ao `.husky/pre-commit`:
```bash
#!/usr/bin/env sh
npm run validate-endpoints
npm run type-check
npm run lint
```

## 📝 **Exemplo de Uso Completo**

```bash
# 1. Gerar tipos atualizados
npm run generate-types

# 2. Validar endpoints
npm run validate-endpoints

# 3. Se houver erros, corrigir e validar novamente
# ... corrigir código ...
npm run validate-endpoints

# 4. Verificar tipos TypeScript
npm run type-check

# 5. Lint do código
npm run lint

# 6. Commit apenas se tudo estiver limpo
git add .
git commit -m "feat: novos endpoints validados"
```

## 🎉 **Resultado Final**

Com esta ferramenta, garantimos:
- ✅ **Zero erros de tabela/campo inexistente**
- ✅ **Endpoints sempre sincronizados com o schema**
- ✅ **Código mais confiável e maintível**
- ✅ **Desenvolvimento mais rápido e seguro**

---

**💡 Lembre-se: Esta ferramenta é OBRIGATÓRIA antes de qualquer commit!**
