import { useState, useEffect } from 'react';
import type { Tables } from '@/types';

type Eleitor = Tables<'eleitor'>;

interface EleitorComRelacao extends Eleitor {
  tipo_relacao: string;
  nivel_proximidade: number;
}

interface UseEleitoresPorLiderancaReturn {
  data: EleitorComRelacao[];
  isLoading: boolean;
  error: Error | null;
}

export function useEleitoresPorLideranca(liderancaId?: string): UseEleitoresPorLiderancaReturn {
  const [data, setData] = useState<EleitorComRelacao[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!liderancaId) {
      setData([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    const fetchEleitores = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/supabase/liderancas/${liderancaId}/eleitores`);
        const result = await response.json();

        if (result.success) {
          setData(result.data || []);
        } else {
          setError(new Error(result.error || 'Erro ao carregar eleitores'));
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchEleitores();
  }, [liderancaId]);

  return { data, isLoading, error };
}
