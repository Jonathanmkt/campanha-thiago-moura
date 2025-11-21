import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Colaborador {
  id: string;
  profile_id: string;
  funcao: string;
  salario: number | null;
  comissao: number | null;
  status_colaborador: string | null;
  data_inicio_atividade: string | null;
  data_fim_atividade: string | null;
  ativo: boolean | null;
  area_responsavel_id: string | null;
  supervisor_id: string | null;
  eleitores_cadastrados: number | null;
  meta_mensal_eleitores: number | null;
  habilidades: string[] | null;
  disponibilidade: string[] | null;
  observacoes: string | null;
  profiles: {
    nome_completo: string;
    telefone: string | null;
    cpf: string | null;
    foto_url: string | null;
  };
  supervisor?: {
    id: string;
    profiles: {
      nome_completo: string;
    };
  } | null;
  departamentos?: Array<{
    id: string;
    departamento_id: string;
    papel: string;
    funcao: string | null;
    status: string | null;
    departamento: {
      id: string;
      nome: string;
      tipo_departamento: string;
      codigo: string | null;
    };
  }>;
  equipes?: Array<{
    id: string;
    equipe_id: string;
    papel: string;
    funcao_especifica: string | null;
    status: string | null;
    equipe: {
      id: string;
      nome: string;
      tipo_equipe: string;
      codigo: string | null;
    };
  }>;
}

export interface Departamento {
  id: string;
  nome: string;
  codigo: string | null;
  tipo_departamento: string;
  nivel_hierarquico: number;
  departamento_pai_id: string | null;
  ativo: boolean;
}

interface ColaboradoresFilters {
  search?: string;
  funcao?: string;
  status_colaborador?: string;
  departamento_id?: string;
  page?: number;
  limit?: number;
}

interface ColaboradoresResponse {
  data: Colaborador[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const useColaboradoresData = () => {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { toast } = useToast();

  const fetchColaboradores = useCallback(async (filters: ColaboradoresFilters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.funcao) params.append('funcao', filters.funcao);
      if (filters.status_colaborador) params.append('status_colaborador', filters.status_colaborador);
      if (filters.departamento_id) params.append('departamento_id', filters.departamento_id);
      
      params.append('page', (filters.page || 1).toString());
      params.append('limit', (filters.limit || 50).toString());
      params.append('sort_by', 'data_criacao');
      params.append('sort_order', 'desc');

      const response = await fetch(`/api/supabase/colaboradores?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const result: ColaboradoresResponse & { success: boolean; error: string | null } = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Erro ao buscar colaboradores');
      }

      setColaboradores(result.data);
      setTotalCount(result.count);
      setCurrentPage(result.page);
      setTotalPages(result.totalPages);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      toast({
        title: 'Erro ao carregar colaboradores',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchDepartamentos = useCallback(async () => {
    try {
      const response = await fetch('/api/supabase/departamentos?ativo=true');
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const result: { data: Departamento[]; success: boolean; error: string | null } = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Erro ao buscar departamentos');
      }

      setDepartamentos(result.data);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('Erro ao carregar departamentos:', errorMessage);
    }
  }, []);

  const refetch = useCallback((filters?: ColaboradoresFilters) => {
    return fetchColaboradores(filters);
  }, [fetchColaboradores]);

  useEffect(() => {
    fetchColaboradores();
    fetchDepartamentos();
  }, [fetchColaboradores, fetchDepartamentos]);

  return {
    colaboradores,
    departamentos,
    loading,
    error,
    totalCount,
    currentPage,
    totalPages,
    refetch,
  };
};
