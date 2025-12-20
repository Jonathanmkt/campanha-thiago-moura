/**
 * Tipos TypeScript gerados automaticamente do Supabase
 * Projeto: Campanha Thiago Moura 2026
 * 
 * ⚠️  ATENÇÃO: Este arquivo é gerado automaticamente!
 * Não edite manualmente. Execute 'npm run generate-types' para atualizar.
 * 
 * Última atualização: 2025-12-17T15:41:27.163Z
 * Projeto ID: xkqtrwbnionpbjziilgy
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      area: {
        Row: {
          ativo: boolean | null
          bairro: string | null
          cep: string | null
          cidade: string | null
          codigo: string | null
          complemento: string | null
          coordenadas_completas: unknown
          data_atualizacao: string
          data_criacao: string
          descricao: string | null
          eleitores_estimados: number | null
          endereco: string | null
          endereco_formatado: string | null
          estado: string | null
          id: string
          latitude: number | null
          logradouro: string | null
          longitude: number | null
          municipio_id: string
          nome: string
          numero: string | null
          populacao_estimada: number | null
          prioridade: number | null
          secao_eleitoral: string | null
          tipo: string
          zona_eleitoral: string | null
        }
        Insert: {
          ativo?: boolean | null
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          codigo?: string | null
          complemento?: string | null
          coordenadas_completas?: unknown
          data_atualizacao?: string
          data_criacao?: string
          descricao?: string | null
          eleitores_estimados?: number | null
          endereco?: string | null
          endereco_formatado?: string | null
          estado?: string | null
          id?: string
          latitude?: number | null
          logradouro?: string | null
          longitude?: number | null
          municipio_id: string
          nome: string
          numero?: string | null
          populacao_estimada?: number | null
          prioridade?: number | null
          secao_eleitoral?: string | null
          tipo: string
          zona_eleitoral?: string | null
        }
        Update: {
          ativo?: boolean | null
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          codigo?: string | null
          complemento?: string | null
          coordenadas_completas?: unknown
          data_atualizacao?: string
          data_criacao?: string
          descricao?: string | null
          eleitores_estimados?: number | null
          endereco?: string | null
          endereco_formatado?: string | null
          estado?: string | null
          id?: string
          latitude?: number | null
          logradouro?: string | null
          longitude?: number | null
          municipio_id?: string
          nome?: string
          numero?: string | null
          populacao_estimada?: number | null
          prioridade?: number | null
          secao_eleitoral?: string | null
          tipo?: string
          zona_eleitoral?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "area_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "municipio"
            referencedColumns: ["id"]
          },
        ]
      }
      categoria_projeto: {
        Row: {
          cor: string | null
          created_at: string
          descricao: string | null
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          cor?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          cor?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      colaborador: {
        Row: {
          area_responsavel_id: string | null
          ativo: boolean | null
          comissao: number | null
          data_atualizacao: string
          data_criacao: string
          data_fim_atividade: string | null
          data_inicio_atividade: string | null
          disponibilidade: string[] | null
          eleitores_cadastrados: number | null
          especializacao: string | null
          experiencia_politica: string | null
          funcao: string
          habilidades: string[] | null
          horario_disponivel: string | null
          id: string
          meta_mensal_eleitores: number | null
          nivel_acesso_projetos: string | null
          notificacoes_projetos: boolean | null
          observacoes: string | null
          pode_criar_projetos: boolean | null
          pode_gerenciar_tarefas: boolean | null
          possui_cnh: string | null
          possui_veiculo: boolean | null
          profile_id: string | null
          salario: number | null
          status_colaborador: string | null
          supervisor_id: string | null
        }
        Insert: {
          area_responsavel_id?: string | null
          ativo?: boolean | null
          comissao?: number | null
          data_atualizacao?: string
          data_criacao?: string
          data_fim_atividade?: string | null
          data_inicio_atividade?: string | null
          disponibilidade?: string[] | null
          eleitores_cadastrados?: number | null
          especializacao?: string | null
          experiencia_politica?: string | null
          funcao: string
          habilidades?: string[] | null
          horario_disponivel?: string | null
          id?: string
          meta_mensal_eleitores?: number | null
          nivel_acesso_projetos?: string | null
          notificacoes_projetos?: boolean | null
          observacoes?: string | null
          pode_criar_projetos?: boolean | null
          pode_gerenciar_tarefas?: boolean | null
          possui_cnh?: string | null
          possui_veiculo?: boolean | null
          profile_id?: string | null
          salario?: number | null
          status_colaborador?: string | null
          supervisor_id?: string | null
        }
        Update: {
          area_responsavel_id?: string | null
          ativo?: boolean | null
          comissao?: number | null
          data_atualizacao?: string
          data_criacao?: string
          data_fim_atividade?: string | null
          data_inicio_atividade?: string | null
          disponibilidade?: string[] | null
          eleitores_cadastrados?: number | null
          especializacao?: string | null
          experiencia_politica?: string | null
          funcao?: string
          habilidades?: string[] | null
          horario_disponivel?: string | null
          id?: string
          meta_mensal_eleitores?: number | null
          nivel_acesso_projetos?: string | null
          notificacoes_projetos?: boolean | null
          observacoes?: string | null
          pode_criar_projetos?: boolean | null
          pode_gerenciar_tarefas?: boolean | null
          possui_cnh?: string | null
          possui_veiculo?: boolean | null
          profile_id?: string | null
          salario?: number | null
          status_colaborador?: string | null
          supervisor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "colaborador_area_responsavel_id_fkey"
            columns: ["area_responsavel_id"]
            isOneToOne: false
            referencedRelation: "area"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "colaborador_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "colaborador_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "colaborador"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "colaborador_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "vw_colaboradores_multiplas_equipes"
            referencedColumns: ["colaborador_id"]
          },
          {
            foreignKeyName: "colaborador_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "vw_equipe_membros"
            referencedColumns: ["colaborador_id"]
          },
        ]
      }
      colaborador_departamento: {
        Row: {
          ativo: boolean | null
          colaborador_id: string
          data_atualizacao: string
          data_criacao: string
          data_fim: string | null
          data_inicio: string
          departamento_id: string
          funcao: string | null
          id: string
          papel: string
          permissoes: string[] | null
          responsabilidades: string[] | null
          status: string | null
        }
        Insert: {
          ativo?: boolean | null
          colaborador_id: string
          data_atualizacao?: string
          data_criacao?: string
          data_fim?: string | null
          data_inicio?: string
          departamento_id: string
          funcao?: string | null
          id?: string
          papel: string
          permissoes?: string[] | null
          responsabilidades?: string[] | null
          status?: string | null
        }
        Update: {
          ativo?: boolean | null
          colaborador_id?: string
          data_atualizacao?: string
          data_criacao?: string
          data_fim?: string | null
          data_inicio?: string
          departamento_id?: string
          funcao?: string | null
          id?: string
          papel?: string
          permissoes?: string[] | null
          responsabilidades?: string[] | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "colaborador_departamento_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaborador"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "colaborador_departamento_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "vw_colaboradores_multiplas_equipes"
            referencedColumns: ["colaborador_id"]
          },
          {
            foreignKeyName: "colaborador_departamento_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "vw_equipe_membros"
            referencedColumns: ["colaborador_id"]
          },
          {
            foreignKeyName: "colaborador_departamento_departamento_id_fkey"
            columns: ["departamento_id"]
            isOneToOne: false
            referencedRelation: "departamento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "colaborador_departamento_departamento_id_fkey"
            columns: ["departamento_id"]
            isOneToOne: false
            referencedRelation: "vw_estrutura_campanha"
            referencedColumns: ["departamento_id"]
          },
        ]
      }
      colaborador_equipe: {
        Row: {
          ativo: boolean | null
          carga_horaria_semanal: number | null
          colaborador_id: string
          data_atualizacao: string
          data_criacao: string
          data_fim: string | null
          data_inicio: string
          dedicacao: string | null
          disponibilidade_dias: Json | null
          equipe_id: string
          funcao_especifica: string | null
          id: string
          meta_individual: number | null
          papel: string
          permissoes_especiais: string[] | null
          responsabilidades: string[] | null
          resultado_alcancado: number | null
          status: string | null
        }
        Insert: {
          ativo?: boolean | null
          carga_horaria_semanal?: number | null
          colaborador_id: string
          data_atualizacao?: string
          data_criacao?: string
          data_fim?: string | null
          data_inicio?: string
          dedicacao?: string | null
          disponibilidade_dias?: Json | null
          equipe_id: string
          funcao_especifica?: string | null
          id?: string
          meta_individual?: number | null
          papel: string
          permissoes_especiais?: string[] | null
          responsabilidades?: string[] | null
          resultado_alcancado?: number | null
          status?: string | null
        }
        Update: {
          ativo?: boolean | null
          carga_horaria_semanal?: number | null
          colaborador_id?: string
          data_atualizacao?: string
          data_criacao?: string
          data_fim?: string | null
          data_inicio?: string
          dedicacao?: string | null
          disponibilidade_dias?: Json | null
          equipe_id?: string
          funcao_especifica?: string | null
          id?: string
          meta_individual?: number | null
          papel?: string
          permissoes_especiais?: string[] | null
          responsabilidades?: string[] | null
          resultado_alcancado?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "colaborador_equipe_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaborador"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "colaborador_equipe_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "vw_colaboradores_multiplas_equipes"
            referencedColumns: ["colaborador_id"]
          },
          {
            foreignKeyName: "colaborador_equipe_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "vw_equipe_membros"
            referencedColumns: ["colaborador_id"]
          },
          {
            foreignKeyName: "colaborador_equipe_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "colaborador_equipe_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "vw_equipe_membros"
            referencedColumns: ["equipe_id"]
          },
        ]
      }
      coordenador_regional: {
        Row: {
          data_atualizacao: string
          data_criacao: string
          id: string
          profile_id: string
        }
        Insert: {
          data_atualizacao?: string
          data_criacao?: string
          id?: string
          profile_id: string
        }
        Update: {
          data_atualizacao?: string
          data_criacao?: string
          id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coordenador_regional_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coordenador_regional_municipio: {
        Row: {
          coordenador_regional_id: string
          data_criacao: string
          id: string
          municipio_id: string
        }
        Insert: {
          coordenador_regional_id: string
          data_criacao?: string
          id?: string
          municipio_id: string
        }
        Update: {
          coordenador_regional_id?: string
          data_criacao?: string
          id?: string
          municipio_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coordenador_regional_municipio_coordenador_regional_id_fkey"
            columns: ["coordenador_regional_id"]
            isOneToOne: false
            referencedRelation: "coordenador_regional"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coordenador_regional_municipio_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "municipio"
            referencedColumns: ["id"]
          },
        ]
      }
      departamento: {
        Row: {
          area_id: string | null
          ativo: boolean | null
          codigo: string | null
          coordenador_id: string | null
          data_atualizacao: string
          data_criacao: string
          departamento_pai_id: string | null
          descricao: string | null
          id: string
          meta_eleitores: number | null
          nivel_hierarquico: number | null
          nome: string
          orcamento_mensal: number | null
          prioridade: number | null
          status: string | null
          tipo_departamento: string
        }
        Insert: {
          area_id?: string | null
          ativo?: boolean | null
          codigo?: string | null
          coordenador_id?: string | null
          data_atualizacao?: string
          data_criacao?: string
          departamento_pai_id?: string | null
          descricao?: string | null
          id?: string
          meta_eleitores?: number | null
          nivel_hierarquico?: number | null
          nome: string
          orcamento_mensal?: number | null
          prioridade?: number | null
          status?: string | null
          tipo_departamento: string
        }
        Update: {
          area_id?: string | null
          ativo?: boolean | null
          codigo?: string | null
          coordenador_id?: string | null
          data_atualizacao?: string
          data_criacao?: string
          departamento_pai_id?: string | null
          descricao?: string | null
          id?: string
          meta_eleitores?: number | null
          nivel_hierarquico?: number | null
          nome?: string
          orcamento_mensal?: number | null
          prioridade?: number | null
          status?: string | null
          tipo_departamento?: string
        }
        Relationships: [
          {
            foreignKeyName: "departamento_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "area"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "departamento_coordenador_id_fkey"
            columns: ["coordenador_id"]
            isOneToOne: false
            referencedRelation: "colaborador"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "departamento_coordenador_id_fkey"
            columns: ["coordenador_id"]
            isOneToOne: false
            referencedRelation: "vw_colaboradores_multiplas_equipes"
            referencedColumns: ["colaborador_id"]
          },
          {
            foreignKeyName: "departamento_coordenador_id_fkey"
            columns: ["coordenador_id"]
            isOneToOne: false
            referencedRelation: "vw_equipe_membros"
            referencedColumns: ["colaborador_id"]
          },
          {
            foreignKeyName: "departamento_departamento_pai_id_fkey"
            columns: ["departamento_pai_id"]
            isOneToOne: false
            referencedRelation: "departamento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "departamento_departamento_pai_id_fkey"
            columns: ["departamento_pai_id"]
            isOneToOne: false
            referencedRelation: "vw_estrutura_campanha"
            referencedColumns: ["departamento_id"]
          },
        ]
      }
      eleitor: {
        Row: {
          area_id: string
          ativo: boolean | null
          bairro: string | null
          cep: string | null
          complemento: string | null
          cpf: string | null
          data_atualizacao: string
          data_criacao: string
          data_nascimento: string | null
          data_ultimo_contato: string | null
          email: string | null
          endereco: string | null
          escolaridade: string | null
          estado_civil: string | null
          foto_url: string | null
          id: string
          intencao_voto: string | null
          local_votacao: string | null
          nivel_apoio: number | null
          nome_completo: string
          nome_popular: string | null
          numero_endereco: string | null
          observacoes: string | null
          pode_ser_cabo_eleitoral: boolean | null
          profissao: string | null
          responsavel_cadastro: string | null
          secao_eleitoral: string | null
          sexo: string | null
          status: string | null
          telefone: string | null
          titulo_eleitor: string | null
          zona_eleitoral: string | null
        }
        Insert: {
          area_id: string
          ativo?: boolean | null
          bairro?: string | null
          cep?: string | null
          complemento?: string | null
          cpf?: string | null
          data_atualizacao?: string
          data_criacao?: string
          data_nascimento?: string | null
          data_ultimo_contato?: string | null
          email?: string | null
          endereco?: string | null
          escolaridade?: string | null
          estado_civil?: string | null
          foto_url?: string | null
          id?: string
          intencao_voto?: string | null
          local_votacao?: string | null
          nivel_apoio?: number | null
          nome_completo: string
          nome_popular?: string | null
          numero_endereco?: string | null
          observacoes?: string | null
          pode_ser_cabo_eleitoral?: boolean | null
          profissao?: string | null
          responsavel_cadastro?: string | null
          secao_eleitoral?: string | null
          sexo?: string | null
          status?: string | null
          telefone?: string | null
          titulo_eleitor?: string | null
          zona_eleitoral?: string | null
        }
        Update: {
          area_id?: string
          ativo?: boolean | null
          bairro?: string | null
          cep?: string | null
          complemento?: string | null
          cpf?: string | null
          data_atualizacao?: string
          data_criacao?: string
          data_nascimento?: string | null
          data_ultimo_contato?: string | null
          email?: string | null
          endereco?: string | null
          escolaridade?: string | null
          estado_civil?: string | null
          foto_url?: string | null
          id?: string
          intencao_voto?: string | null
          local_votacao?: string | null
          nivel_apoio?: number | null
          nome_completo?: string
          nome_popular?: string | null
          numero_endereco?: string | null
          observacoes?: string | null
          pode_ser_cabo_eleitoral?: boolean | null
          profissao?: string | null
          responsavel_cadastro?: string | null
          secao_eleitoral?: string | null
          sexo?: string | null
          status?: string | null
          telefone?: string | null
          titulo_eleitor?: string | null
          zona_eleitoral?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "eleitor_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "area"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eleitor_responsavel_cadastro_fkey"
            columns: ["responsavel_cadastro"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      equipamento: {
        Row: {
          ativo: boolean | null
          data_aquisicao: string | null
          data_atualizacao: string
          data_criacao: string
          data_ultima_manutencao: string | null
          descricao: string | null
          disponivel: boolean | null
          estado_conservacao: string | null
          foto_url: string | null
          id: string
          localizacao_atual: string | null
          marca: string | null
          modelo: string | null
          nome: string
          numero_serie: string | null
          observacoes: string | null
          proxima_manutencao: string | null
          requer_manutencao: boolean | null
          responsavel_atual: string | null
          status: string | null
          tipo_equipamento: string
          valor_aquisicao: number | null
        }
        Insert: {
          ativo?: boolean | null
          data_aquisicao?: string | null
          data_atualizacao?: string
          data_criacao?: string
          data_ultima_manutencao?: string | null
          descricao?: string | null
          disponivel?: boolean | null
          estado_conservacao?: string | null
          foto_url?: string | null
          id?: string
          localizacao_atual?: string | null
          marca?: string | null
          modelo?: string | null
          nome: string
          numero_serie?: string | null
          observacoes?: string | null
          proxima_manutencao?: string | null
          requer_manutencao?: boolean | null
          responsavel_atual?: string | null
          status?: string | null
          tipo_equipamento: string
          valor_aquisicao?: number | null
        }
        Update: {
          ativo?: boolean | null
          data_aquisicao?: string | null
          data_atualizacao?: string
          data_criacao?: string
          data_ultima_manutencao?: string | null
          descricao?: string | null
          disponivel?: boolean | null
          estado_conservacao?: string | null
          foto_url?: string | null
          id?: string
          localizacao_atual?: string | null
          marca?: string | null
          modelo?: string | null
          nome?: string
          numero_serie?: string | null
          observacoes?: string | null
          proxima_manutencao?: string | null
          requer_manutencao?: boolean | null
          responsavel_atual?: string | null
          status?: string | null
          tipo_equipamento?: string
          valor_aquisicao?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "equipamento_responsavel_atual_fkey"
            columns: ["responsavel_atual"]
            isOneToOne: false
            referencedRelation: "colaborador"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipamento_responsavel_atual_fkey"
            columns: ["responsavel_atual"]
            isOneToOne: false
            referencedRelation: "vw_colaboradores_multiplas_equipes"
            referencedColumns: ["colaborador_id"]
          },
          {
            foreignKeyName: "equipamento_responsavel_atual_fkey"
            columns: ["responsavel_atual"]
            isOneToOne: false
            referencedRelation: "vw_equipe_membros"
            referencedColumns: ["colaborador_id"]
          },
        ]
      }
      equipe: {
        Row: {
          area_id: string | null
          ativo: boolean | null
          capacidade_maxima: number | null
          codigo: string | null
          data_atualizacao: string
          data_criacao: string
          data_fim: string | null
          data_inicio: string | null
          departamento_id: string
          descricao: string | null
          equipe_pai_id: string | null
          especialidade: string | null
          id: string
          lider_id: string | null
          meta_eleitores: number | null
          nome: string
          status: string | null
          tipo_equipe: string
        }
        Insert: {
          area_id?: string | null
          ativo?: boolean | null
          capacidade_maxima?: number | null
          codigo?: string | null
          data_atualizacao?: string
          data_criacao?: string
          data_fim?: string | null
          data_inicio?: string | null
          departamento_id: string
          descricao?: string | null
          equipe_pai_id?: string | null
          especialidade?: string | null
          id?: string
          lider_id?: string | null
          meta_eleitores?: number | null
          nome: string
          status?: string | null
          tipo_equipe: string
        }
        Update: {
          area_id?: string | null
          ativo?: boolean | null
          capacidade_maxima?: number | null
          codigo?: string | null
          data_atualizacao?: string
          data_criacao?: string
          data_fim?: string | null
          data_inicio?: string | null
          departamento_id?: string
          descricao?: string | null
          equipe_pai_id?: string | null
          especialidade?: string | null
          id?: string
          lider_id?: string | null
          meta_eleitores?: number | null
          nome?: string
          status?: string | null
          tipo_equipe?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipe_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "area"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipe_departamento_id_fkey"
            columns: ["departamento_id"]
            isOneToOne: false
            referencedRelation: "departamento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipe_departamento_id_fkey"
            columns: ["departamento_id"]
            isOneToOne: false
            referencedRelation: "vw_estrutura_campanha"
            referencedColumns: ["departamento_id"]
          },
          {
            foreignKeyName: "equipe_equipe_pai_id_fkey"
            columns: ["equipe_pai_id"]
            isOneToOne: false
            referencedRelation: "equipe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipe_equipe_pai_id_fkey"
            columns: ["equipe_pai_id"]
            isOneToOne: false
            referencedRelation: "vw_equipe_membros"
            referencedColumns: ["equipe_id"]
          },
          {
            foreignKeyName: "equipe_lider_id_fkey"
            columns: ["lider_id"]
            isOneToOne: false
            referencedRelation: "colaborador"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipe_lider_id_fkey"
            columns: ["lider_id"]
            isOneToOne: false
            referencedRelation: "vw_colaboradores_multiplas_equipes"
            referencedColumns: ["colaborador_id"]
          },
          {
            foreignKeyName: "equipe_lider_id_fkey"
            columns: ["lider_id"]
            isOneToOne: false
            referencedRelation: "vw_equipe_membros"
            referencedColumns: ["colaborador_id"]
          },
        ]
      }
      evento: {
        Row: {
          area_id: string | null
          ativo: boolean | null
          cep: string | null
          criado_por: string | null
          data_atualizacao: string
          data_criacao: string
          data_fim: string | null
          data_inicio: string
          descricao: string | null
          endereco_completo: string | null
          id: string
          latitude: number | null
          local_nome: string | null
          longitude: number | null
          observacoes: string | null
          orcamento_previsto: number | null
          orcamento_realizado: number | null
          prioridade: number | null
          publico_estimado: number | null
          publico_presente: number | null
          responsavel_organizacao: string | null
          status: string | null
          tipo_evento: string
          titulo: string
        }
        Insert: {
          area_id?: string | null
          ativo?: boolean | null
          cep?: string | null
          criado_por?: string | null
          data_atualizacao?: string
          data_criacao?: string
          data_fim?: string | null
          data_inicio: string
          descricao?: string | null
          endereco_completo?: string | null
          id?: string
          latitude?: number | null
          local_nome?: string | null
          longitude?: number | null
          observacoes?: string | null
          orcamento_previsto?: number | null
          orcamento_realizado?: number | null
          prioridade?: number | null
          publico_estimado?: number | null
          publico_presente?: number | null
          responsavel_organizacao?: string | null
          status?: string | null
          tipo_evento: string
          titulo: string
        }
        Update: {
          area_id?: string | null
          ativo?: boolean | null
          cep?: string | null
          criado_por?: string | null
          data_atualizacao?: string
          data_criacao?: string
          data_fim?: string | null
          data_inicio?: string
          descricao?: string | null
          endereco_completo?: string | null
          id?: string
          latitude?: number | null
          local_nome?: string | null
          longitude?: number | null
          observacoes?: string | null
          orcamento_previsto?: number | null
          orcamento_realizado?: number | null
          prioridade?: number | null
          publico_estimado?: number | null
          publico_presente?: number | null
          responsavel_organizacao?: string | null
          status?: string | null
          tipo_evento?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "evento_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "area"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evento_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evento_responsavel_organizacao_fkey"
            columns: ["responsavel_organizacao"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      labels: {
        Row: {
          color: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          project_id: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          color: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          project_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          color?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          project_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "labels_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      lideranca: {
        Row: {
          alcance_estimado: number | null
          ativo: boolean | null
          bairro: string | null
          cep: string | null
          cidade: string | null
          complemento: string | null
          coordenadas_completas: unknown
          coordenador_regional_id: string | null
          cpf: string | null
          data_atualizacao: string
          data_criacao: string
          data_nascimento: string | null
          data_primeiro_contato: string | null
          data_ultimo_contato: string | null
          email: string | null
          endereco: string | null
          endereco_formatado: string | null
          estado: string | null
          foto_url: string | null
          id: string
          latitude: number | null
          logradouro: string | null
          longitude: number | null
          nivel_influencia: number | null
          nome_completo: string
          nome_popular: string | null
          numero: string | null
          observacoes: string | null
          profile_id: string | null
          profissao: string | null
          responsavel_cadastro: string | null
          rg: string | null
          status: string | null
          telefone: string | null
          tipo_lideranca: string
        }
        Insert: {
          alcance_estimado?: number | null
          ativo?: boolean | null
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          coordenadas_completas?: unknown
          coordenador_regional_id?: string | null
          cpf?: string | null
          data_atualizacao?: string
          data_criacao?: string
          data_nascimento?: string | null
          data_primeiro_contato?: string | null
          data_ultimo_contato?: string | null
          email?: string | null
          endereco?: string | null
          endereco_formatado?: string | null
          estado?: string | null
          foto_url?: string | null
          id?: string
          latitude?: number | null
          logradouro?: string | null
          longitude?: number | null
          nivel_influencia?: number | null
          nome_completo: string
          nome_popular?: string | null
          numero?: string | null
          observacoes?: string | null
          profile_id?: string | null
          profissao?: string | null
          responsavel_cadastro?: string | null
          rg?: string | null
          status?: string | null
          telefone?: string | null
          tipo_lideranca: string
        }
        Update: {
          alcance_estimado?: number | null
          ativo?: boolean | null
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          coordenadas_completas?: unknown
          coordenador_regional_id?: string | null
          cpf?: string | null
          data_atualizacao?: string
          data_criacao?: string
          data_nascimento?: string | null
          data_primeiro_contato?: string | null
          data_ultimo_contato?: string | null
          email?: string | null
          endereco?: string | null
          endereco_formatado?: string | null
          estado?: string | null
          foto_url?: string | null
          id?: string
          latitude?: number | null
          logradouro?: string | null
          longitude?: number | null
          nivel_influencia?: number | null
          nome_completo?: string
          nome_popular?: string | null
          numero?: string | null
          observacoes?: string | null
          profile_id?: string | null
          profissao?: string | null
          responsavel_cadastro?: string | null
          rg?: string | null
          status?: string | null
          telefone?: string | null
          tipo_lideranca?: string
        }
        Relationships: [
          {
            foreignKeyName: "lideranca_coordenador_regional_id_fkey"
            columns: ["coordenador_regional_id"]
            isOneToOne: false
            referencedRelation: "coordenador_regional"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lideranca_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lideranca_responsavel_cadastro_fkey"
            columns: ["responsavel_cadastro"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lideranca_area: {
        Row: {
          area_id: string
          ativo: boolean | null
          data_atualizacao: string
          data_criacao: string
          data_inicio_atuacao: string | null
          id: string
          lideranca_id: string
          nivel_influencia: number | null
          observacoes: string | null
          tipo_atuacao: string
        }
        Insert: {
          area_id: string
          ativo?: boolean | null
          data_atualizacao?: string
          data_criacao?: string
          data_inicio_atuacao?: string | null
          id?: string
          lideranca_id: string
          nivel_influencia?: number | null
          observacoes?: string | null
          tipo_atuacao: string
        }
        Update: {
          area_id?: string
          ativo?: boolean | null
          data_atualizacao?: string
          data_criacao?: string
          data_inicio_atuacao?: string | null
          id?: string
          lideranca_id?: string
          nivel_influencia?: number | null
          observacoes?: string | null
          tipo_atuacao?: string
        }
        Relationships: [
          {
            foreignKeyName: "lideranca_area_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "area"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lideranca_area_lideranca_id_fkey"
            columns: ["lideranca_id"]
            isOneToOne: false
            referencedRelation: "lideranca"
            referencedColumns: ["id"]
          },
        ]
      }
      lideranca_eleitor: {
        Row: {
          ativo: boolean | null
          data_atualizacao: string
          data_criacao: string
          data_inicio_relacao: string | null
          eleitor_id: string
          id: string
          lideranca_id: string
          nivel_proximidade: number | null
          observacoes: string | null
          tipo_relacao: string
        }
        Insert: {
          ativo?: boolean | null
          data_atualizacao?: string
          data_criacao?: string
          data_inicio_relacao?: string | null
          eleitor_id: string
          id?: string
          lideranca_id: string
          nivel_proximidade?: number | null
          observacoes?: string | null
          tipo_relacao: string
        }
        Update: {
          ativo?: boolean | null
          data_atualizacao?: string
          data_criacao?: string
          data_inicio_relacao?: string | null
          eleitor_id?: string
          id?: string
          lideranca_id?: string
          nivel_proximidade?: number | null
          observacoes?: string | null
          tipo_relacao?: string
        }
        Relationships: [
          {
            foreignKeyName: "lideranca_eleitor_eleitor_id_fkey"
            columns: ["eleitor_id"]
            isOneToOne: false
            referencedRelation: "eleitor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lideranca_eleitor_lideranca_id_fkey"
            columns: ["lideranca_id"]
            isOneToOne: false
            referencedRelation: "lideranca"
            referencedColumns: ["id"]
          },
        ]
      }
      material: {
        Row: {
          ativo: boolean | null
          categoria: string | null
          codigo_produto: string | null
          data_atualizacao: string
          data_criacao: string
          data_validade: string | null
          descricao: string | null
          fornecedor: string | null
          foto_url: string | null
          id: string
          localizacao_estoque: string | null
          lote: string | null
          nome: string
          observacoes: string | null
          quantidade_estoque: number | null
          quantidade_minima: number | null
          responsavel_estoque: string | null
          status: string | null
          tipo_material: string
          unidade_medida: string
          valor_unitario: number | null
        }
        Insert: {
          ativo?: boolean | null
          categoria?: string | null
          codigo_produto?: string | null
          data_atualizacao?: string
          data_criacao?: string
          data_validade?: string | null
          descricao?: string | null
          fornecedor?: string | null
          foto_url?: string | null
          id?: string
          localizacao_estoque?: string | null
          lote?: string | null
          nome: string
          observacoes?: string | null
          quantidade_estoque?: number | null
          quantidade_minima?: number | null
          responsavel_estoque?: string | null
          status?: string | null
          tipo_material: string
          unidade_medida: string
          valor_unitario?: number | null
        }
        Update: {
          ativo?: boolean | null
          categoria?: string | null
          codigo_produto?: string | null
          data_atualizacao?: string
          data_criacao?: string
          data_validade?: string | null
          descricao?: string | null
          fornecedor?: string | null
          foto_url?: string | null
          id?: string
          localizacao_estoque?: string | null
          lote?: string | null
          nome?: string
          observacoes?: string | null
          quantidade_estoque?: number | null
          quantidade_minima?: number | null
          responsavel_estoque?: string | null
          status?: string | null
          tipo_material?: string
          unidade_medida?: string
          valor_unitario?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "material_responsavel_estoque_fkey"
            columns: ["responsavel_estoque"]
            isOneToOne: false
            referencedRelation: "colaborador"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_responsavel_estoque_fkey"
            columns: ["responsavel_estoque"]
            isOneToOne: false
            referencedRelation: "vw_colaboradores_multiplas_equipes"
            referencedColumns: ["colaborador_id"]
          },
          {
            foreignKeyName: "material_responsavel_estoque_fkey"
            columns: ["responsavel_estoque"]
            isOneToOne: false
            referencedRelation: "vw_equipe_membros"
            referencedColumns: ["colaborador_id"]
          },
        ]
      }
      milestones: {
        Row: {
          color: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          icon: string | null
          id: string
          milestone_date: string
          name: string
          project_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          milestone_date: string
          name: string
          project_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          milestone_date?: string
          name?: string
          project_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "milestones_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "colaborador"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "milestones_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "vw_colaboradores_multiplas_equipes"
            referencedColumns: ["colaborador_id"]
          },
          {
            foreignKeyName: "milestones_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "vw_equipe_membros"
            referencedColumns: ["colaborador_id"]
          },
          {
            foreignKeyName: "milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      municipio: {
        Row: {
          area_km2: number | null
          ativo: boolean | null
          codigo_ibge: string | null
          data_atualizacao: string
          data_criacao: string
          has_areas: boolean | null
          id: string
          nome: string
          populacao: number | null
          regiao: string | null
          uf: string
        }
        Insert: {
          area_km2?: number | null
          ativo?: boolean | null
          codigo_ibge?: string | null
          data_atualizacao?: string
          data_criacao?: string
          has_areas?: boolean | null
          id?: string
          nome: string
          populacao?: number | null
          regiao?: string | null
          uf: string
        }
        Update: {
          area_km2?: number | null
          ativo?: boolean | null
          codigo_ibge?: string | null
          data_atualizacao?: string
          data_criacao?: string
          has_areas?: boolean | null
          id?: string
          nome?: string
          populacao?: number | null
          regiao?: string | null
          uf?: string
        }
        Relationships: []
      }
      pesquisa_quantitativa: {
        Row: {
          area_id: string
          atualizado_em: string
          criado_em: string
          data_pesquisa: string
          fonte: string | null
          id: string
          metodo_coleta: string | null
          observacoes: string | null
          percentual: number
        }
        Insert: {
          area_id: string
          atualizado_em?: string
          criado_em?: string
          data_pesquisa: string
          fonte?: string | null
          id?: string
          metodo_coleta?: string | null
          observacoes?: string | null
          percentual: number
        }
        Update: {
          area_id?: string
          atualizado_em?: string
          criado_em?: string
          data_pesquisa?: string
          fonte?: string | null
          id?: string
          metodo_coleta?: string | null
          observacoes?: string | null
          percentual?: number
        }
        Relationships: [
          {
            foreignKeyName: "pesquisa_quantitativa_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "area"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          access_level: number | null
          cpf: string | null
          data_atualizacao: string
          data_criacao: string
          data_nascimento: string | null
          foto_url: string | null
          id: string
          nome_completo: string
          permissions: string[] | null
          provider_id: string | null
          roles: string[]
          status: string | null
          telefone: string | null
          ultimo_acesso: string | null
          updated_at: string
        }
        Insert: {
          access_level?: number | null
          cpf?: string | null
          data_atualizacao?: string
          data_criacao?: string
          data_nascimento?: string | null
          foto_url?: string | null
          id: string
          nome_completo: string
          permissions?: string[] | null
          provider_id?: string | null
          roles?: string[]
          status?: string | null
          telefone?: string | null
          ultimo_acesso?: string | null
          updated_at?: string
        }
        Update: {
          access_level?: number | null
          cpf?: string | null
          data_atualizacao?: string
          data_criacao?: string
          data_nascimento?: string | null
          foto_url?: string | null
          id?: string
          nome_completo?: string
          permissions?: string[] | null
          provider_id?: string | null
          roles?: string[]
          status?: string | null
          telefone?: string | null
          ultimo_acesso?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      project_baselines: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          project_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          project_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_baselines_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "colaborador"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_baselines_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "vw_colaboradores_multiplas_equipes"
            referencedColumns: ["colaborador_id"]
          },
          {
            foreignKeyName: "project_baselines_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "vw_equipe_membros"
            referencedColumns: ["colaborador_id"]
          },
          {
            foreignKeyName: "project_baselines_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          archived: boolean | null
          categoria_id: string | null
          color: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          priority: Database["public"]["Enums"]["project_priority"] | null
          responsavel_id: string | null
          settings: Json | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          archived?: boolean | null
          categoria_id?: string | null
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          priority?: Database["public"]["Enums"]["project_priority"] | null
          responsavel_id?: string | null
          settings?: Json | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          archived?: boolean | null
          categoria_id?: string | null
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          priority?: Database["public"]["Enums"]["project_priority"] | null
          responsavel_id?: string | null
          settings?: Json | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categoria_projeto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "colaborador"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "vw_colaboradores_multiplas_equipes"
            referencedColumns: ["colaborador_id"]
          },
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "vw_equipe_membros"
            referencedColumns: ["colaborador_id"]
          },
          {
            foreignKeyName: "projects_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "colaborador"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "vw_colaboradores_multiplas_equipes"
            referencedColumns: ["colaborador_id"]
          },
          {
            foreignKeyName: "projects_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "vw_equipe_membros"
            referencedColumns: ["colaborador_id"]
          },
          {
            foreignKeyName: "projects_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "colaborador"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "vw_colaboradores_multiplas_equipes"
            referencedColumns: ["colaborador_id"]
          },
          {
            foreignKeyName: "projects_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "vw_equipe_membros"
            referencedColumns: ["colaborador_id"]
          },
        ]
      }
      projeto_equipe: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          data_fim: string | null
          data_inicio: string
          equipe_id: string
          id: string
          observacoes: string | null
          papel: string | null
          projeto_id: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          data_fim?: string | null
          data_inicio?: string
          equipe_id: string
          id?: string
          observacoes?: string | null
          papel?: string | null
          projeto_id: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          data_fim?: string | null
          data_inicio?: string
          equipe_id?: string
          id?: string
          observacoes?: string | null
          papel?: string | null
          projeto_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projeto_equipe_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_equipe_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "vw_equipe_membros"
            referencedColumns: ["equipe_id"]
          },
          {
            foreignKeyName: "projeto_equipe_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      sprints: {
        Row: {
          archived: boolean | null
          created_at: string | null
          created_by: string | null
          end_date: string | null
          goal: string | null
          id: string
          is_default: boolean | null
          name: string
          project_id: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["sprint_status"] | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          archived?: boolean | null
          created_at?: string | null
          created_by?: string | null
          end_date?: string | null
          goal?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          project_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["sprint_status"] | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          archived?: boolean | null
          created_at?: string | null
          created_by?: string | null
          end_date?: string | null
          goal?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          project_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["sprint_status"] | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sprints_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "colaborador"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sprints_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "vw_colaboradores_multiplas_equipes"
            referencedColumns: ["colaborador_id"]
          },
          {
            foreignKeyName: "sprints_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "vw_equipe_membros"
            referencedColumns: ["colaborador_id"]
          },
          {
            foreignKeyName: "sprints_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sprints_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "colaborador"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sprints_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "vw_colaboradores_multiplas_equipes"
            referencedColumns: ["colaborador_id"]
          },
          {
            foreignKeyName: "sprints_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "vw_equipe_membros"
            referencedColumns: ["colaborador_id"]
          },
        ]
      }
      task_baseline_snapshots: {
        Row: {
          baseline_id: string
          created_at: string | null
          due_date: string | null
          estimated_hours: number | null
          id: string
          progress: number | null
          start_date: string | null
          task_id: string
          task_title: string
        }
        Insert: {
          baseline_id: string
          created_at?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          progress?: number | null
          start_date?: string | null
          task_id: string
          task_title: string
        }
        Update: {
          baseline_id?: string
          created_at?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          progress?: number | null
          start_date?: string | null
          task_id?: string
          task_title?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_baseline_snapshots_baseline_id_fkey"
            columns: ["baseline_id"]
            isOneToOne: false
            referencedRelation: "project_baselines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_baseline_snapshots_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_dependencies: {
        Row: {
          created_at: string | null
          created_by: string | null
          dependency_type: string
          depends_on_task_id: string
          id: string
          lag_days: number | null
          task_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          dependency_type?: string
          depends_on_task_id: string
          id?: string
          lag_days?: number | null
          task_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          dependency_type?: string
          depends_on_task_id?: string
          id?: string
          lag_days?: number | null
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_dependencies_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "colaborador"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_dependencies_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "vw_colaboradores_multiplas_equipes"
            referencedColumns: ["colaborador_id"]
          },
          {
            foreignKeyName: "task_dependencies_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "vw_equipe_membros"
            referencedColumns: ["colaborador_id"]
          },
          {
            foreignKeyName: "task_dependencies_depends_on_task_id_fkey"
            columns: ["depends_on_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_dependencies_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_resources: {
        Row: {
          allocation_percentage: number | null
          colaborador_id: string
          created_at: string | null
          hours_allocated: number | null
          hours_worked: number | null
          id: string
          role_in_task: string | null
          task_id: string
          updated_at: string | null
        }
        Insert: {
          allocation_percentage?: number | null
          colaborador_id: string
          created_at?: string | null
          hours_allocated?: number | null
          hours_worked?: number | null
          id?: string
          role_in_task?: string | null
          task_id: string
          updated_at?: string | null
        }
        Update: {
          allocation_percentage?: number | null
          colaborador_id?: string
          created_at?: string | null
          hours_allocated?: number | null
          hours_worked?: number | null
          id?: string
          role_in_task?: string | null
          task_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_resources_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaborador"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_resources_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "vw_colaboradores_multiplas_equipes"
            referencedColumns: ["colaborador_id"]
          },
          {
            foreignKeyName: "task_resources_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "vw_equipe_membros"
            referencedColumns: ["colaborador_id"]
          },
          {
            foreignKeyName: "task_resources_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          actual_hours: number | null
          archived: boolean | null
          archived_by: string | null
          baseline_end_date: string | null
          baseline_start_date: string | null
          colaborador_responsavel_id: string | null
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          custom_fields: Json | null
          description: string | null
          due_date: string | null
          duration_days: number | null
          equipe_responsavel_id: string | null
          estimated_hours: number | null
          id: string
          is_critical_path: boolean | null
          is_milestone: boolean | null
          original_estimate: number | null
          parent_task_id: string | null
          priority: Database["public"]["Enums"]["task_priority"] | null
          progress: number | null
          project_id: string | null
          remaining_estimate: number | null
          slug: string
          sprint_id: string | null
          start_date: string | null
          status_id: string | null
          story_points: number | null
          task_number: number
          title: string
          type: Database["public"]["Enums"]["task_type"] | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          actual_hours?: number | null
          archived?: boolean | null
          archived_by?: string | null
          baseline_end_date?: string | null
          baseline_start_date?: string | null
          colaborador_responsavel_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          custom_fields?: Json | null
          description?: string | null
          due_date?: string | null
          duration_days?: number | null
          equipe_responsavel_id?: string | null
          estimated_hours?: number | null
          id?: string
          is_critical_path?: boolean | null
          is_milestone?: boolean | null
          original_estimate?: number | null
          parent_task_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          progress?: number | null
          project_id?: string | null
          remaining_estimate?: number | null
          slug: string
          sprint_id?: string | null
          start_date?: string | null
          status_id?: string | null
          story_points?: number | null
          task_number: number
          title: string
          type?: Database["public"]["Enums"]["task_type"] | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          actual_hours?: number | null
          archived?: boolean | null
          archived_by?: string | null
          baseline_end_date?: string | null
          baseline_start_date?: string | null
          colaborador_responsavel_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          custom_fields?: Json | null
          description?: string | null
          due_date?: string | null
          duration_days?: number | null
          equipe_responsavel_id?: string | null
          estimated_hours?: number | null
          id?: string
          is_critical_path?: boolean | null
          is_milestone?: boolean | null
          original_estimate?: number | null
          parent_task_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          progress?: number | null
          project_id?: string | null
          remaining_estimate?: number | null
          slug?: string
          sprint_id?: string | null
          start_date?: string | null
          status_id?: string | null
          story_points?: number | null
          task_number?: number
          title?: string
          type?: Database["public"]["Enums"]["task_type"] | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_archived_by_fkey"
            columns: ["archived_by"]
            isOneToOne: false
            referencedRelation: "colaborador"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_archived_by_fkey"
            columns: ["archived_by"]
            isOneToOne: false
            referencedRelation: "vw_colaboradores_multiplas_equipes"
            referencedColumns: ["colaborador_id"]
          },
          {
            foreignKeyName: "tasks_archived_by_fkey"
            columns: ["archived_by"]
            isOneToOne: false
            referencedRelation: "vw_equipe_membros"
            referencedColumns: ["colaborador_id"]
          },
          {
            foreignKeyName: "tasks_colaborador_responsavel_id_fkey"
            columns: ["colaborador_responsavel_id"]
            isOneToOne: false
            referencedRelation: "colaborador"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_colaborador_responsavel_id_fkey"
            columns: ["colaborador_responsavel_id"]
            isOneToOne: false
            referencedRelation: "vw_colaboradores_multiplas_equipes"
            referencedColumns: ["colaborador_id"]
          },
          {
            foreignKeyName: "tasks_colaborador_responsavel_id_fkey"
            columns: ["colaborador_responsavel_id"]
            isOneToOne: false
            referencedRelation: "vw_equipe_membros"
            referencedColumns: ["colaborador_id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "colaborador"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "vw_colaboradores_multiplas_equipes"
            referencedColumns: ["colaborador_id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "vw_equipe_membros"
            referencedColumns: ["colaborador_id"]
          },
          {
            foreignKeyName: "tasks_equipe_responsavel_id_fkey"
            columns: ["equipe_responsavel_id"]
            isOneToOne: false
            referencedRelation: "equipe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_equipe_responsavel_id_fkey"
            columns: ["equipe_responsavel_id"]
            isOneToOne: false
            referencedRelation: "vw_equipe_membros"
            referencedColumns: ["equipe_id"]
          },
          {
            foreignKeyName: "tasks_parent_task_id_fkey"
            columns: ["parent_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_sprint_id_fkey"
            columns: ["sprint_id"]
            isOneToOne: false
            referencedRelation: "sprints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "colaborador"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "vw_colaboradores_multiplas_equipes"
            referencedColumns: ["colaborador_id"]
          },
          {
            foreignKeyName: "tasks_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "vw_equipe_membros"
            referencedColumns: ["colaborador_id"]
          },
        ]
      }
      time_entries: {
        Row: {
          created_at: string | null
          created_by: string | null
          date: string | null
          description: string | null
          end_time: string | null
          id: string
          start_time: string | null
          task_id: string | null
          time_spent: number
          updated_at: string | null
          updated_by: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          description?: string | null
          end_time?: string | null
          id?: string
          start_time?: string | null
          task_id?: string | null
          time_spent: number
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          description?: string | null
          end_time?: string | null
          id?: string
          start_time?: string | null
          task_id?: string | null
          time_spent?: number
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      workflows: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_default: boolean | null
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown
          f_table_catalog: unknown
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown
          f_table_catalog: string | null
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
      vw_colaboradores_multiplas_equipes: {
        Row: {
          carga_horaria_total: number | null
          colaborador_id: string | null
          departamentos: string | null
          equipes: string | null
          funcao_principal: string | null
          meta_total: number | null
          nome_completo: string | null
          resultado_total: number | null
          telefone: string | null
          total_departamentos: number | null
          total_equipes: number | null
        }
        Relationships: []
      }
      vw_equipe_membros: {
        Row: {
          carga_horaria_semanal: number | null
          colaborador_id: string | null
          colaborador_nome: string | null
          colaborador_telefone: string | null
          data_fim: string | null
          data_inicio: string | null
          dedicacao: string | null
          departamento_codigo: string | null
          departamento_nome: string | null
          equipe_codigo: string | null
          equipe_id: string | null
          equipe_nome: string | null
          especialidade: string | null
          funcao_especifica: string | null
          funcao_principal: string | null
          meta_individual: number | null
          papel: string | null
          percentual_meta: number | null
          resultado_alcancado: number | null
          status_na_equipe: string | null
          tipo_equipe: string | null
        }
        Relationships: []
      }
      vw_estrutura_campanha: {
        Row: {
          ativo: boolean | null
          capacidade_total: number | null
          coordenador_nome: string | null
          coordenador_telefone: string | null
          departamento_codigo: string | null
          departamento_id: string | null
          departamento_nome: string | null
          meta_departamento: number | null
          meta_total_colaboradores: number | null
          nivel_hierarquico: number | null
          orcamento_mensal: number | null
          percentual_alcance: number | null
          resultado_total: number | null
          status: string | null
          tipo_departamento: string | null
          total_colaboradores: number | null
          total_equipes: number | null
        }
        Relationships: []
      }
      vw_hierarquia_departamentos: {
        Row: {
          ativo: boolean | null
          caminho_hierarquia: string[] | null
          caminho_texto: string | null
          codigo: string | null
          coordenador_id: string | null
          departamento_pai_id: string | null
          id: string | null
          nivel: number | null
          nivel_hierarquico: number | null
          nome: string | null
          status: string | null
          tipo_departamento: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown }
        Returns: unknown
      }
      _postgis_pgsql_version: { Args: never; Returns: string }
      _postgis_scripts_pgsql_version: { Args: never; Returns: string }
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown }
        Returns: number
      }
      _postgis_stats: {
        Args: { ""?: string; att_name: string; tbl: unknown }
        Returns: string
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_sortablehash: { Args: { geom: unknown }; Returns: number }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          clip?: unknown
          g1: unknown
          return_polygons?: boolean
          tolerance?: number
        }
        Returns: unknown
      }
      _st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      addauth: { Args: { "": string }; Returns: boolean }
      addgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              new_dim: number
              new_srid_in: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
      disablelongtransactions: { Args: never; Returns: string }
      dropgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { column_name: string; table_name: string }; Returns: string }
      dropgeometrytable:
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { schema_name: string; table_name: string }; Returns: string }
        | { Args: { table_name: string }; Returns: string }
      enablelongtransactions: { Args: never; Returns: string }
      equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      geometry: { Args: { "": string }; Returns: unknown }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geomfromewkt: { Args: { "": string }; Returns: unknown }
      get_areas_in_viewport: {
        Args: {
          east_lng: number
          max_areas?: number
          north_lat: number
          south_lat: number
          west_lng: number
          zoom_level?: number
        }
        Returns: {
          ativo: boolean
          cep: string
          codigo: string
          data_atualizacao: string
          data_criacao: string
          descricao: string
          eleitores_estimados: number
          endereco: string
          id: string
          latitude: number
          liderancas_count: number
          longitude: number
          municipio_id: string
          nome: string
          populacao_estimada: number
          prioridade: number
          secao_eleitoral: string
          tipo: string
          zona_eleitoral: string
        }[]
      }
      get_caminho_departamento: { Args: { depto_id: string }; Returns: string }
      get_departamentos_filhos: {
        Args: { parent_id: string }
        Returns: {
          departamento_id: string
          departamento_nome: string
          nivel: number
        }[]
      }
      get_liderancas_by_area: {
        Args: { area_uuid: string }
        Returns: {
          email: string
          foto_url: string
          id: string
          nivel_influencia: number
          nivel_influencia_area: number
          nome_completo: string
          nome_popular: string
          profissao: string
          telefone: string
          tipo_atuacao: string
          tipo_lideranca: string
        }[]
      }
      get_municipios_with_areas_in_bounds: {
        Args: {
          east_lng: number
          north_lat: number
          south_lat: number
          west_lng: number
        }
        Returns: {
          id: string
          latitude: number
          longitude: number
          nome: string
          total_areas: number
          total_liderancas: number
        }[]
      }
      get_municipios_with_areas_in_viewport: {
        Args: {
          east_lng: number
          north_lat: number
          south_lat: number
          west_lng: number
        }
        Returns: {
          id: string
          latitude: number
          longitude: number
          nome: string
          total_areas: number
          total_liderancas: number
        }[]
      }
      get_municipios_with_areas_simple: {
        Args: {
          east_lng?: number
          north_lat?: number
          south_lat?: number
          west_lng?: number
        }
        Returns: {
          id: string
          latitude: number
          longitude: number
          nome: string
          total_areas: number
        }[]
      }
      gettransactionid: { Args: never; Returns: unknown }
      longtransactionsenabled: { Args: never; Returns: boolean }
      populate_geometry_columns:
        | { Args: { tbl_oid: unknown; use_typmod?: boolean }; Returns: number }
        | { Args: { use_typmod?: boolean }; Returns: string }
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: string
      }
      postgis_extensions_upgrade: { Args: never; Returns: string }
      postgis_full_version: { Args: never; Returns: string }
      postgis_geos_version: { Args: never; Returns: string }
      postgis_lib_build_date: { Args: never; Returns: string }
      postgis_lib_revision: { Args: never; Returns: string }
      postgis_lib_version: { Args: never; Returns: string }
      postgis_libjson_version: { Args: never; Returns: string }
      postgis_liblwgeom_version: { Args: never; Returns: string }
      postgis_libprotobuf_version: { Args: never; Returns: string }
      postgis_libxml_version: { Args: never; Returns: string }
      postgis_proj_version: { Args: never; Returns: string }
      postgis_scripts_build_date: { Args: never; Returns: string }
      postgis_scripts_installed: { Args: never; Returns: string }
      postgis_scripts_released: { Args: never; Returns: string }
      postgis_svn_version: { Args: never; Returns: string }
      postgis_type_name: {
        Args: {
          coord_dimension: number
          geomname: string
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_version: { Args: never; Returns: string }
      postgis_wagyu_version: { Args: never; Returns: string }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle:
        | { Args: { line1: unknown; line2: unknown }; Returns: number }
        | {
            Args: { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
            Returns: number
          }
      st_area:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkt: { Args: { "": string }; Returns: string }
      st_asgeojson:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: {
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
              r: Record<string, unknown>
            }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_asgml:
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
            }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
      st_askml:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: { Args: { format?: string; geom: unknown }; Returns: string }
      st_asmvtgeom: {
        Args: {
          bounds: unknown
          buffer?: number
          clip_geom?: boolean
          extent?: number
          geom: unknown
        }
        Returns: unknown
      }
      st_assvg:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_astext: { Args: { "": string }; Returns: string }
      st_astwkb:
        | {
            Args: {
              geom: unknown
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: number }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown }
        Returns: unknown
      }
      st_buffer:
        | {
            Args: { geom: unknown; options?: string; radius: number }
            Returns: unknown
          }
        | {
            Args: { geom: unknown; quadsegs: number; radius: number }
            Returns: unknown
          }
      st_centroid: { Args: { "": string }; Returns: unknown }
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collect: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean
          param_geom: unknown
          param_pctconvex: number
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_coorddim: { Args: { geometry: unknown }; Returns: number }
      st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_crosses: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance:
        | {
            Args: { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
            Returns: number
          }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_distancesphere:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | {
            Args: { geom1: unknown; geom2: unknown; radius: number }
            Returns: number
          }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_expand:
        | { Args: { box: unknown; dx: number; dy: number }; Returns: unknown }
        | {
            Args: { box: unknown; dx: number; dy: number; dz?: number }
            Returns: unknown
          }
        | {
            Args: {
              dm?: number
              dx: number
              dy: number
              dz?: number
              geom: unknown
            }
            Returns: unknown
          }
      st_force3d: { Args: { geom: unknown; zvalue?: number }; Returns: unknown }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number }
        Returns: unknown
      }
      st_generatepoints:
        | { Args: { area: unknown; npoints: number }; Returns: unknown }
        | {
            Args: { area: unknown; npoints: number; seed: number }
            Returns: unknown
          }
      st_geogfromtext: { Args: { "": string }; Returns: unknown }
      st_geographyfromtext: { Args: { "": string }; Returns: unknown }
      st_geohash:
        | { Args: { geog: unknown; maxchars?: number }; Returns: string }
        | { Args: { geom: unknown; maxchars?: number }; Returns: string }
      st_geomcollfromtext: { Args: { "": string }; Returns: unknown }
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean
          g: unknown
          max_iter?: number
          tolerance?: number
        }
        Returns: unknown
      }
      st_geometryfromtext: { Args: { "": string }; Returns: unknown }
      st_geomfromewkt: { Args: { "": string }; Returns: unknown }
      st_geomfromgeojson:
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": string }; Returns: unknown }
      st_geomfromgml: { Args: { "": string }; Returns: unknown }
      st_geomfromkml: { Args: { "": string }; Returns: unknown }
      st_geomfrommarc21: { Args: { marc21xml: string }; Returns: unknown }
      st_geomfromtext: { Args: { "": string }; Returns: unknown }
      st_gmltosql: { Args: { "": string }; Returns: unknown }
      st_hasarc: { Args: { geometry: unknown }; Returns: boolean }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
        SetofOptions: {
          from: "*"
          to: "valid_detail"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      st_length:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_letters: { Args: { font?: Json; letters: string }; Returns: unknown }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string }
        Returns: unknown
      }
      st_linefromtext: { Args: { "": string }; Returns: unknown }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linetocurve: { Args: { geometry: unknown }; Returns: unknown }
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          frommeasure: number
          geometry: unknown
          leftrightoffset?: number
          tomeasure: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_mlinefromtext: { Args: { "": string }; Returns: unknown }
      st_mpointfromtext: { Args: { "": string }; Returns: unknown }
      st_mpolyfromtext: { Args: { "": string }; Returns: unknown }
      st_multilinestringfromtext: { Args: { "": string }; Returns: unknown }
      st_multipointfromtext: { Args: { "": string }; Returns: unknown }
      st_multipolygonfromtext: { Args: { "": string }; Returns: unknown }
      st_node: { Args: { g: unknown }; Returns: unknown }
      st_normalize: { Args: { geom: unknown }; Returns: unknown }
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_pointfromtext: { Args: { "": string }; Returns: unknown }
      st_pointm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
        }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_polyfromtext: { Args: { "": string }; Returns: unknown }
      st_polygonfromtext: { Args: { "": string }; Returns: unknown }
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_m?: number
          prec_x: number
          prec_y?: number
          prec_z?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: { Args: { geom1: unknown; geom2: unknown }; Returns: string }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid:
        | { Args: { geog: unknown; srid: number }; Returns: unknown }
        | { Args: { geom: unknown; srid: number }; Returns: unknown }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number }
        Returns: unknown
      }
      st_split: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_square: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_srid:
        | { Args: { geog: unknown }; Returns: number }
        | { Args: { geom: unknown }; Returns: number }
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number }
        Returns: unknown[]
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          bounds?: unknown
          margin?: number
          x: number
          y: number
          zoom: number
        }
        Returns: unknown
      }
      st_touches: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_transform:
        | {
            Args: { from_proj: string; geom: unknown; to_proj: string }
            Returns: unknown
          }
        | {
            Args: { from_proj: string; geom: unknown; to_srid: number }
            Returns: unknown
          }
        | { Args: { geom: unknown; to_proj: string }; Returns: unknown }
      st_triangulatepolygon: { Args: { g1: unknown }; Returns: unknown }
      st_union:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
        | {
            Args: { geom1: unknown; geom2: unknown; gridsize: number }
            Returns: unknown
          }
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_wkbtosql: { Args: { wkb: string }; Returns: unknown }
      st_wkttosql: { Args: { "": string }; Returns: unknown }
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number }
        Returns: unknown
      }
      unlockrows: { Args: { "": string }; Returns: number }
      update_area_coordinates: {
        Args: never
        Returns: {
          area_id: string
          area_nome: string
          endereco_usado: string
          latitude_antiga: number
          latitude_nova: number
          longitude_antiga: number
          longitude_nova: number
          status: string
        }[]
      }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          column_name: string
          new_srid_in: number
          schema_name: string
          table_name: string
        }
        Returns: string
      }
    }
    Enums: {
      dependency_type: "BLOCKS" | "BLOCKED_BY" | "RELATES_TO"
      member_role: "OWNER" | "ADMIN" | "MANAGER" | "MEMBER" | "VIEWER"
      project_priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
      project_status:
        | "PLANNING"
        | "ACTIVE"
        | "ON_HOLD"
        | "COMPLETED"
        | "CANCELLED"
      project_visibility: "PRIVATE" | "INTERNAL" | "PUBLIC"
      sprint_status: "PLANNING" | "ACTIVE" | "COMPLETED"
      status_category: "TODO" | "IN_PROGRESS" | "DONE"
      task_priority: "LOWEST" | "LOW" | "MEDIUM" | "HIGH" | "HIGHEST"
      task_type: "TASK" | "BUG" | "EPIC" | "STORY" | "SUBTASK"
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      dependency_type: ["BLOCKS", "BLOCKED_BY", "RELATES_TO"],
      member_role: ["OWNER", "ADMIN", "MANAGER", "MEMBER", "VIEWER"],
      project_priority: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      project_status: [
        "PLANNING",
        "ACTIVE",
        "ON_HOLD",
        "COMPLETED",
        "CANCELLED",
      ],
      project_visibility: ["PRIVATE", "INTERNAL", "PUBLIC"],
      sprint_status: ["PLANNING", "ACTIVE", "COMPLETED"],
      status_category: ["TODO", "IN_PROGRESS", "DONE"],
      task_priority: ["LOWEST", "LOW", "MEDIUM", "HIGH", "HIGHEST"],
      task_type: ["TASK", "BUG", "EPIC", "STORY", "SUBTASK"],
    },
  },
} as const
