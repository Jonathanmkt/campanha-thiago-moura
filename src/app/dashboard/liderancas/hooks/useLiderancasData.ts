import { useState, useEffect } from 'react';
import type { Tables } from '@/types';

type Lideranca = Tables<'lideranca'>;

interface UseLiderancasDataReturn {
  data: Lideranca[];
  isLoading: boolean;
  error: Error | null;
  refetch: (filters?: {
    cidade?: string;
    bairro?: string;
    tipo_lideranca?: string;
  }) => void;
}

export function useLiderancasData(): UseLiderancasDataReturn {
  const [data, setData] = useState<Lideranca[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLiderancas = async (filters?: {
    cidade?: string;
    bairro?: string;
    tipo_lideranca?: string;
  }) => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: '1',
        limit: '100'
      });

      if (filters?.cidade) {
        params.append('cidade', filters.cidade);
      }
      if (filters?.bairro) {
        params.append('bairro', filters.bairro);
      }
      if (filters?.tipo_lideranca) {
        params.append('tipo_lideranca', filters.tipo_lideranca);
      }

      const response = await fetch(`/api/supabase/liderancas?${params}`);
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError(new Error(result.error || 'Erro ao carregar lideranças'));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiderancas();
  }, []);

  return { data, isLoading, error, refetch: fetchLiderancas };
}
