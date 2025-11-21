# Sistema de Tipos - Campanha Thiago Moura 2026

Este diretório contém o sistema de tipos TypeScript para o projeto, garantindo type safety e sincronização automática com o banco de dados Supabase.

## 📁 Estrutura

```
src/types/
├── README.md              # Este arquivo
├── database.types.ts      # Tipos gerados automaticamente do Supabase
└── index.ts              # Tipos auxiliares e re-exports
```

## 🚀 Como usar

### Importar tipos básicos
```typescript
import { Database, Json, ApiResponse } from '@/types';
```

### Importar tipos específicos do projeto
```typescript
import { Eleitor, Lideranca, Area, AuthUser } from '@/types';
```

### Usar tipos de tabelas (quando disponíveis)
```typescript
// Após gerar os tipos do Supabase, descomente no index.ts:
// import { Tables, TablesInsert, TablesUpdate } from '@/types';

// type User = Tables<'users'>;
// type UserInsert = TablesInsert<'users'>;
// type UserUpdate = TablesUpdate<'users'>;
```

## 🔄 Geração Automática de Tipos

### Configuração inicial

1. **Configure as variáveis de ambiente** no arquivo `.env`:
```env
NEXT_PUBLIC_SUPABASE_PROJECT_ID=seu_project_id
SUPABASE_ACCESS_TOKEN=seu_access_token
```

2. **Obtenha o Access Token**:
   - Acesse: https://supabase.com/dashboard/account/tokens
   - Crie um novo token com permissões de leitura
   - Adicione no arquivo `.env`

### Executar geração de tipos

```bash
# Gerar tipos automaticamente
npm run generate-types

# Ou executar diretamente
node scripts/generate-types.js
```

### O que acontece durante a geração:

1. ✅ Conecta ao projeto Supabase usando as credenciais
2. ✅ Gera tipos TypeScript de todas as tabelas, views, functions e enums
3. ✅ Salva em `src/types/database.types.ts` com header informativo
4. ✅ Atualiza tipos auxiliares em `src/types/index.ts`
5. ✅ Valida a integridade dos tipos gerados

## 📋 Tipos Disponíveis

### Tipos do Supabase
- `Database` - Estrutura completa do banco
- `Json` - Tipo para campos JSON
- `Tables<T>` - Tipo de linha de uma tabela
- `TablesInsert<T>` - Tipo para inserção em uma tabela
- `TablesUpdate<T>` - Tipo para atualização de uma tabela

### Tipos do Projeto
- `ApiResponse<T>` - Resposta padrão da API
- `PaginatedResponse<T>` - Resposta paginada
- `AuthUser` - Usuário autenticado
- `FormState` - Estado de formulários
- `FilterOptions` - Opções de filtro
- `OperationStatus` - Status de operações

### Tipos Específicos da Campanha
- `Eleitor` - Dados de eleitores
- `Lideranca` - Dados de lideranças
- `Area` - Dados de áreas geográficas
- `Evento` - Dados de eventos
- `EstatisticasGerais` - Estatísticas do sistema

## 🛠️ Manutenção

### Quando executar a geração de tipos:

- ✅ Após criar/modificar tabelas no Supabase
- ✅ Após adicionar/remover colunas
- ✅ Após criar views ou functions
- ✅ Antes de fazer deploy em produção
- ✅ Quando hooks/endpoints apresentam erros de tipo

### Boas práticas:

1. **Nunca edite manualmente** `database.types.ts`
2. **Execute a geração** sempre que modificar o schema
3. **Commit os tipos** junto com as mudanças de código
4. **Valide os tipos** antes de fazer push
5. **Use os tipos auxiliares** em `index.ts` para facilitar o uso

### Troubleshooting:

**Erro: "SUPABASE_ACCESS_TOKEN não encontrado"**
- Verifique se o token está no arquivo `.env`
- Certifique-se de que o token não expirou

**Erro: "Projeto não encontrado"**
- Verifique o `NEXT_PUBLIC_SUPABASE_PROJECT_ID`
- Confirme se o projeto existe no Supabase

**Erro: "Tipos vazios ou incompletos"**
- Verifique se o projeto tem tabelas criadas
- Confirme se o token tem permissões adequadas

## 🔗 Integração com Hooks e Endpoints

### Exemplo de uso em hooks:
```typescript
import { Tables, ApiResponse } from '@/types';

// Hook tipado
function useEleitores() {
  const [eleitores, setEleitores] = useState<Eleitor[]>([]);
  
  const fetchEleitores = async (): Promise<ApiResponse<Eleitor[]>> => {
    // Implementação tipada
  };
}
```

### Exemplo de uso em endpoints:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, Eleitor } from '@/types';

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<Eleitor[]>>> {
  // Implementação tipada
}
```

## 📈 Benefícios

- ✅ **Type Safety**: Prevenção de erros em tempo de compilação
- ✅ **IntelliSense**: Autocompletar e documentação automática
- ✅ **Refactoring**: Mudanças seguras em toda a aplicação
- ✅ **Sincronização**: Tipos sempre atualizados com o banco
- ✅ **Produtividade**: Desenvolvimento mais rápido e confiável

---

**Última atualização**: 2025-11-12  
**Versão do sistema**: 1.0.0
