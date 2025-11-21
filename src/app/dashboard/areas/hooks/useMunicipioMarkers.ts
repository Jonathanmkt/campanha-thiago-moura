import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

// Declaração global para o Google Maps
declare global {
  interface Window {
    google: any;
  }
}

interface ViewportBounds {
  south: number;
  west: number;
  north: number;
  east: number;
}

interface MunicipioMarker {
  id: string;
  nome: string;
  latitude: number;
  longitude: number;
  total_areas: number;
  total_liderancas?: number; // Opcional pois a nova função não retorna este campo
}

interface UseMunicipioMarkersProps {
  mapInstance: any | null;
  enabled?: boolean;
}

export function useMunicipioMarkers({ mapInstance, enabled = true }: UseMunicipioMarkersProps) {
  const [municipios, setMunicipios] = useState<MunicipioMarker[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(15);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Função para determinar se deve mostrar marcadores de município (zoom muito distante)
  const shouldShowMunicipioMarkers = useCallback((zoomLevel: number): boolean => {
    const shouldShow = zoomLevel <= 12;
    console.log('🔍 shouldShowMunicipioMarkers - zoom:', zoomLevel, 'shouldShow:', shouldShow);
    return shouldShow; // Quando zoom for menor ou igual a 12, mostrar municípios
  }, []);

  // Função para buscar municípios no viewport
  const fetchMunicipiosInViewport = useCallback(async (bounds: ViewportBounds, zoom: number) => {
    if (!enabled || !shouldShowMunicipioMarkers(zoom)) {
      setMunicipios([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🌍 Bounds enviados para RPC:', bounds, 'zoom:', zoom);
      
      const supabase = createClient();

      // TEMPORÁRIO: Buscar todos os municípios (sem parâmetros)
      console.log('📞 Chamando RPC get_municipios_with_areas_simple...');
      const { data, error: supabaseError } = await supabase.rpc('get_municipios_with_areas_simple');
      console.log('📞 RPC Response:', { data, error: supabaseError });

      if (supabaseError) {
        // Se a função RPC não existir, usar query direta (fallback)
        console.warn('RPC não encontrada, usando query direta:', supabaseError);
        
        const { data: directData, error: directError } = await supabase
          .from('area')
          .select(`
            municipio_id,
            latitude,
            longitude,
            municipio!inner(id, nome)
          `)
          .eq('ativo', true)
          .eq('municipio.ativo', true)
          .gte('latitude', bounds.south)
          .lte('latitude', bounds.north)
          .gte('longitude', bounds.west)
          .lte('longitude', bounds.east)
          .not('latitude', 'is', null)
          .not('longitude', 'is', null);

        if (directError) {
          throw directError;
        }

        // Processar dados da query direta
        const municipiosMap = new Map<string, MunicipioMarker>();
        
        directData?.forEach((area: any) => {
          const municipioId = area.municipio_id;
          const municipio = area.municipio;
          
          if (!municipiosMap.has(municipioId)) {
            municipiosMap.set(municipioId, {
              id: municipioId,
              nome: municipio.nome,
              latitude: parseFloat(area.latitude),
              longitude: parseFloat(area.longitude),
              total_areas: 1,
              total_liderancas: 0
            });
          } else {
            const existing = municipiosMap.get(municipioId)!;
            // Calcular média das coordenadas
            const newLat = (existing.latitude * existing.total_areas + parseFloat(area.latitude)) / (existing.total_areas + 1);
            const newLng = (existing.longitude * existing.total_areas + parseFloat(area.longitude)) / (existing.total_areas + 1);
            
            municipiosMap.set(municipioId, {
              ...existing,
              latitude: newLat,
              longitude: newLng,
              total_areas: existing.total_areas + 1
            });
          }
        });

        const municipiosArray = Array.from(municipiosMap.values());
        console.log('🏙️ Municípios encontrados:', municipiosArray.length, municipiosArray);
        setMunicipios(municipiosArray);
        return;
      }

      // Se chegou aqui, a RPC funcionou
      console.log('🗺️ Municípios encontrados via RPC:', data?.length || 0, data);
      setMunicipios(data || []);
      
    } catch (err) {
      console.error('❌ Erro ao buscar municípios no viewport:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [enabled, shouldShowMunicipioMarkers]);

  // Função para obter bounds do mapa
  const getCurrentBounds = useCallback((): ViewportBounds | null => {
    if (!mapInstance) return null;

    const bounds = mapInstance.getBounds();
    if (!bounds) return null;

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    return {
      north: ne.lat(),
      south: sw.lat(),
      east: ne.lng(),
      west: sw.lng()
    };
  }, [mapInstance]);

  // Handler para mudanças no mapa (com debounce)
  const handleMapChange = useCallback(() => {
    if (!mapInstance) return;

    const bounds = getCurrentBounds();
    const zoom = mapInstance.getZoom();

    if (!bounds || typeof zoom !== 'number') return;

    setCurrentZoom(zoom);

    // Debounce para evitar muitas chamadas
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchMunicipiosInViewport(bounds, zoom);
    }, 300);

  }, [mapInstance, getCurrentBounds, fetchMunicipiosInViewport]);

  // Configurar listeners do mapa
  useEffect(() => {
    if (!mapInstance || !enabled) return;

    const boundsListener = mapInstance.addListener('bounds_changed', handleMapChange);
    const zoomListener = mapInstance.addListener('zoom_changed', handleMapChange);

    // Carregar municípios iniciais
    const initialBounds = getCurrentBounds();
    const initialZoom = mapInstance.getZoom();
    
    if (initialBounds && typeof initialZoom === 'number') {
      setCurrentZoom(initialZoom);
      fetchMunicipiosInViewport(initialBounds, initialZoom);
    }

    return () => {
      (window as any).google.maps.event.removeListener(boundsListener);
      (window as any).google.maps.event.removeListener(zoomListener);
      
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [mapInstance, enabled, handleMapChange, getCurrentBounds, fetchMunicipiosInViewport]);

  return {
    municipios,
    loading,
    error,
    currentZoom,
    shouldShowMunicipioMarkers: shouldShowMunicipioMarkers(currentZoom),
    refreshMunicipios: () => {
      if (!mapInstance) return;
      const bounds = getCurrentBounds();
      const zoom = mapInstance.getZoom();
      if (bounds && typeof zoom === 'number') {
        fetchMunicipiosInViewport(bounds, zoom);
      }
    }
  };
}
