import { useState, useEffect } from 'react';

export interface LiderancaComRelacao {
  id: string;
  nome_completo: string;
  nome_popular: string | null;
  foto_url: string | null;
  tipo_lideranca: string;
  nivel_influencia: number;
  tipo_atuacao: string;
  nivel_influencia_area: number;
}

interface UseAreaLiderancasReturn {
  liderancas: LiderancaComRelacao[];
  loading: boolean;
  error: Error | null;
}

export function useAreaLiderancas(areaId: string): UseAreaLiderancasReturn {
  const [liderancas, setLiderancas] = useState<LiderancaComRelacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchLiderancas = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/supabase/areas/${areaId}/liderancas`);
        const result = await response.json();

        if (result.success) {
          setLiderancas(result.data || []);
        } else {
          setError(new Error(result.error || 'Erro ao carregar lideranças'));
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      } finally {
        setLoading(false);
      }
    };

    if (areaId) {
      fetchLiderancas();
    }
  }, [areaId]);

  return { liderancas, loading, error };
}
