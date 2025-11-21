import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Area } from './useAreas';

interface ViewportBounds {
  south: number;
  west: number;
  north: number;
  east: number;
}

interface UseOptimizedAreasProps {
  mapInstance: google.maps.Map | null;
  enabled?: boolean;
}

// Configuração de zoom inteligente
const ZOOM_CONFIG = {
  REGION_LEVEL: { min: 0, max: 12, maxAreas: 50 },
  NEIGHBORHOOD_LEVEL: { min: 13, max: 16, maxAreas: 200 },
  STREET_LEVEL: { min: 17, max: 22, maxAreas: 500 }
};

// Função para determinar se deve mostrar marcadores baseado no zoom
function shouldShowMarkers(zoomLevel: number): boolean {
  return zoomLevel >= ZOOM_CONFIG.NEIGHBORHOOD_LEVEL.min;
}

// Função para obter máximo de áreas por zoom
function getMaxAreasForZoom(zoomLevel: number): number {
  if (zoomLevel <= ZOOM_CONFIG.REGION_LEVEL.max) return ZOOM_CONFIG.REGION_LEVEL.maxAreas;
  if (zoomLevel <= ZOOM_CONFIG.NEIGHBORHOOD_LEVEL.max) return ZOOM_CONFIG.NEIGHBORHOOD_LEVEL.maxAreas;
  return ZOOM_CONFIG.STREET_LEVEL.maxAreas;
}

export function useOptimizedAreas({ mapInstance, enabled = true }: UseOptimizedAreasProps) {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(15);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Função para buscar áreas no viewport atual
  const fetchAreasInViewport = useCallback(async (bounds: ViewportBounds, zoom: number) => {
    if (!enabled || !shouldShowMarkers(zoom)) {
      setAreas([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const supabase = createClient();
      const maxAreas = getMaxAreasForZoom(zoom);

      // Chamar a função SQL customizada
      const { data, error: supabaseError } = await supabase
        .rpc('get_areas_in_viewport', {
          south_lat: bounds.south,
          west_lng: bounds.west,
          north_lat: bounds.north,
          east_lng: bounds.east,
          zoom_level: zoom,
          max_areas: maxAreas
        });

      if (supabaseError) {
        throw supabaseError;
      }

      setAreas(data || []);
      
      // Debug info: Carregadas ${data?.length || 0} áreas no zoom ${zoom} (máx: ${maxAreas})
      
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Erro ao buscar áreas no viewport:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [enabled]);

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
      fetchAreasInViewport(bounds, zoom);
    }, 300);

  }, [mapInstance, getCurrentBounds, fetchAreasInViewport]);

  // Configurar listeners do mapa
  useEffect(() => {
    if (!mapInstance || !enabled) return;

    const boundsListener = mapInstance.addListener('bounds_changed', handleMapChange);
    const zoomListener = mapInstance.addListener('zoom_changed', handleMapChange);

    // Carregar áreas iniciais
    const initialBounds = getCurrentBounds();
    const initialZoom = mapInstance.getZoom();
    
    if (initialBounds && typeof initialZoom === 'number') {
      setCurrentZoom(initialZoom);
      fetchAreasInViewport(initialBounds, initialZoom);
    }

    return () => {
      google.maps.event.removeListener(boundsListener);
      google.maps.event.removeListener(zoomListener);
      
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [mapInstance, enabled, handleMapChange, getCurrentBounds, fetchAreasInViewport]);

  // Função para refresh manual
  const refreshAreas = useCallback(() => {
    if (!mapInstance) return;

    const bounds = getCurrentBounds();
    const zoom = mapInstance.getZoom();

    if (bounds && typeof zoom === 'number') {
      fetchAreasInViewport(bounds, zoom);
    }
  }, [mapInstance, getCurrentBounds, fetchAreasInViewport]);

  return {
    areas,
    loading,
    error,
    currentZoom,
    shouldShowMarkers: shouldShowMarkers(currentZoom),
    refreshAreas,
    zoomInfo: {
      level: currentZoom,
      category: currentZoom <= 12 ? 'REGION' : currentZoom <= 16 ? 'NEIGHBORHOOD' : 'STREET',
      maxAreas: getMaxAreasForZoom(currentZoom)
    }
  };
}
