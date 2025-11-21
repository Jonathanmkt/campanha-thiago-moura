import { useQuery } from "@tanstack/react-query";

export interface Pesquisa {
  id: string;
  data_pesquisa: string;
  percentual: number;
  metodo_coleta: string | null;
  fonte: string | null;
}

export const usePesquisas = (areaId: string) => {
  return useQuery({
    queryKey: ["pesquisas", areaId],
    queryFn: async () => {
      const response = await fetch(`/api/supabase/pesquisas?area_id=${areaId}`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar pesquisas');
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Erro ao buscar pesquisas');
      }
      
      return result.data as Pesquisa[];
    },
    enabled: !!areaId,
  });
};
