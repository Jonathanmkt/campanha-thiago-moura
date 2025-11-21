import { useEffect, useState } from 'react';

// Declaração global para o Google Maps
declare global {
  interface Window {
    google: typeof google;
  }
}

interface MunicipioMarker {
  id: string;
  nome: string;
  latitude: number;
  longitude: number;
  total_areas: number;
  total_liderancas?: number;
}

interface MunicipioMarkersProps {
  map: any;
  municipios: MunicipioMarker[];
  visible: boolean;
}

export function MunicipioMarkers({ map, municipios, visible }: MunicipioMarkersProps) {
  const [markers, setMarkers] = useState<any[]>([]);
  const [infoWindows, setInfoWindows] = useState<any[]>([]);

  useEffect(() => {
    console.log('🗺️ MunicipioMarkers - map:', !!map, 'visible:', visible, 'municipios:', municipios.length);
    
    if (!map || !visible) {
      // Limpar marcadores existentes
      markers.forEach((marker: any) => marker.setMap(null));
      infoWindows.forEach((infoWindow: any) => infoWindow.close());
      setMarkers([]);
      setInfoWindows([]);
      return;
    }

    // Limpar marcadores anteriores
    markers.forEach(marker => marker.setMap(null));
    infoWindows.forEach(infoWindow => infoWindow.close());

    const newMarkers: any[] = [];
    const newInfoWindows: any[] = [];

    municipios.forEach((municipio) => {
      console.log('🔴 Criando marcador para:', municipio.nome, 'lat:', municipio.latitude, 'lng:', municipio.longitude);
      
      if (!municipio.latitude || !municipio.longitude) {
        console.warn('⚠️ Município sem coordenadas:', municipio.nome);
        return;
      }

      // Criar ícone customizado para município - CÍRCULO VERMELHO
      const icon = {
        path: (window as any).google.maps.SymbolPath.CIRCLE,
        scale: Math.max(12, Math.min(8 + (municipio.total_areas * 1.5), 25)), // Tamanho baseado no número de áreas (8-25px)
        fillColor: '#DC2626', // Vermelho
        fillOpacity: 0.9,
        strokeColor: '#FFFFFF', // Borda branca para contraste
        strokeWeight: 2,
      };

      // Criar marcador
      const marker = new (window as any).google.maps.Marker({
        position: {
          lat: parseFloat(municipio.latitude.toString()),
          lng: parseFloat(municipio.longitude.toString())
        },
        map,
        icon,
        title: municipio.nome,
        zIndex: 1000
      });

      // Criar InfoWindow
      const infoWindow = new (window as any).google.maps.InfoWindow({
        content: `
          <div class="p-3 min-w-[200px]">
            <h3 class="font-semibold text-lg mb-2">${municipio.nome}</h3>
            <div class="space-y-1 text-sm">
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Áreas:</span>
                <span class="font-medium">${municipio.total_areas}</span>
              </div>
              ${municipio.total_liderancas ? `
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Lideranças:</span>
                <span class="font-medium">${municipio.total_liderancas}</span>
              </div>` : ''}
            </div>
            <div class="mt-3 pt-2 border-t">
              <p class="text-xs text-gray-500">
                Aproxime o zoom para ver as áreas individuais
              </p>
            </div>
          </div>
        `
      });

      // Adicionar listener de clique
      marker.addListener('click', () => {
        // Fechar outros InfoWindows
        newInfoWindows.forEach(iw => iw.close());
        
        // Abrir este InfoWindow
        infoWindow.open(map, marker);
      });

      newMarkers.push(marker);
      newInfoWindows.push(infoWindow);
      
      console.log('✅ Marcador criado com sucesso para:', municipio.nome);
    });

    setMarkers(newMarkers);
    setInfoWindows(newInfoWindows);

    // Cleanup function
    return () => {
      newMarkers.forEach(marker => marker.setMap(null));
      newInfoWindows.forEach(infoWindow => infoWindow.close());
    };
  }, [map, municipios, visible]);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      markers.forEach(marker => marker.setMap(null));
      infoWindows.forEach(infoWindow => infoWindow.close());
    };
  }, []);

  return null; // Este componente não renderiza nada diretamente
}
