import { useState, useEffect } from 'react';
import type { Tables } from '@/types';

export type Area = Tables<'area'> & {
  municipio?: Tables<'municipio'>;
  liderancas_count?: number;
};

interface UseAreasReturn {
  areas: Area[];
  loading: boolean;
  error: Error | null;
  refreshAreas: () => void;
}

export function useAreas(): UseAreasReturn {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAreas = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/supabase/areas?page=1&limit=100');
      const result = await response.json();

      if (result.success) {
        setAreas(result.data);
      } else {
        setError(new Error(result.error || 'Erro ao carregar áreas'));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  return { areas, loading, error, refreshAreas: fetchAreas };
}
