import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { TablesInsert } from '@/types';
import type { CreateAreaData } from '../modals/CreateAreaModal';

export function useCreateArea() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createArea = async (areaData: CreateAreaData): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      // Preparar dados básicos para inserção
      const insertData: TablesInsert<'area'> = {
        nome: areaData.nome,
        tipo: areaData.tipo,
        codigo: areaData.codigo || null,
        descricao: areaData.descricao || null,
        endereco: areaData.endereco_legado,
        latitude: areaData.latitude || null,
        longitude: areaData.longitude || null,
        populacao_estimada: areaData.populacao_estimada || null,
        eleitores_estimados: areaData.eleitores_estimados || null,
        zona_eleitoral: areaData.zona_eleitoral || null,
        secao_eleitoral: areaData.secao_eleitoral || null,
        prioridade: areaData.prioridade || 1,
        ativo: true,
        municipio_id: '' // Será preenchido depois via geocoding
      };

      // Se temos coordenadas, fazer geocoding reverso e buscar município
      if (areaData.latitude && areaData.longitude) {
        try {
          const response = await fetch(
            `/api/geocode?lat=${areaData.latitude}&lng=${areaData.longitude}&reverse=true`
          );
          
          if (response.ok) {
            const geocodeData = await response.json();
            if (geocodeData.success && geocodeData.results?.[0]) {
              const result = geocodeData.results[0];
              
              // Extrair componentes do endereço
              const addressComponents = result.address_components || [];
              
              const getComponent = (types: string[]) => {
                const component = addressComponents.find((comp: { types: string[]; long_name: string }) => 
                  comp.types.some((type: string) => types.includes(type))
                );
                return component?.long_name || null;
              };

              // Usar geocoding reverso APENAS para obter informações do município
              // Preservar o endereço original inserido pelo usuário
              
              // Buscar município pelo nome na nossa base de dados
              const municipioNome = getComponent(['administrative_area_level_2']);
              if (municipioNome) {
                const { data: municipioData, error: municipioError } = await supabase
                  .from('municipio')
                  .select('id')
                  .eq('nome', municipioNome)
                  .eq('ativo', true)
                  .single();

                if (!municipioError && municipioData) {
                  insertData.municipio_id = municipioData.id;
                } else {
                  console.warn(`Município "${municipioNome}" não encontrado na base de dados`);
                  throw new Error(`Município "${municipioNome}" não está cadastrado no sistema`);
                }
              }

              // Criar coordenadas PostGIS
              if (areaData.latitude && areaData.longitude) {
                insertData.coordenadas_completas = `POINT(${areaData.longitude} ${areaData.latitude})`;
              }
            }
          }
        } catch (geocodeError) {
          console.error('Erro no geocoding reverso:', geocodeError);
          throw geocodeError;
        }
      }

      // Verificar se municipio_id foi definido
      if (!insertData.municipio_id) {
        throw new Error('Não foi possível determinar o município desta área. Verifique se o endereço está correto.');
      }

      const { error: insertError } = await supabase
        .from('area')
        .insert([insertData]);

      if (insertError) {
        throw insertError;
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createArea,
    loading,
    error
  };
}
