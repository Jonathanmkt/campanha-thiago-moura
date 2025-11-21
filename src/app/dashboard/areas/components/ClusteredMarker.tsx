import React, { useEffect, useState } from 'react';
import { 
  ClusteredArea, 
  getClusterColor, 
  getClusterScale, 
  generateInfoWindowContent 
} from '../utils/clustering';

interface ClusteredMarkerProps {
  cluster: ClusteredArea;
  map: google.maps.Map;
  onMarkerClick?: (cluster: ClusteredArea) => void;
}

export function ClusteredMarker({ cluster, map, onMarkerClick }: ClusteredMarkerProps) {
  // Estados para controlar o ciclo de vida dos marcadores
  // Necessários para cleanup adequado quando o componente for desmontado
  const [, setMarker] = useState<google.maps.Marker | null>(null);
  const [, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);

  useEffect(() => {
    if (!map || !cluster) return;

    const position = {
      lat: cluster.latitude,
      lng: cluster.longitude
    };

    // Criar marcador com visual diferenciado para clusters
    const markerInstance = new google.maps.Marker({
      position,
      map,
      title: cluster.isCluster 
        ? `${cluster.areas.length} áreas - ${cluster.totalLiderancas} lideranças` 
        : `${cluster.areas[0].nome} - ${cluster.areas[0].liderancas_count || 0} lideranças`,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: getClusterScale(cluster.clusterSize, map.getZoom() || 15),
        fillColor: getClusterColor(cluster.clusterSize),
        fillOpacity: 0.8,
        strokeColor: '#ffffff',
        strokeWeight: 2,
        labelOrigin: new google.maps.Point(0, 0)
      },
      label: cluster.isCluster ? {
        text: cluster.areas.length.toString(),
        color: 'white',
        fontSize: '12px',
        fontWeight: 'bold'
      } : undefined
    });

    // Criar InfoWindow usando o utilitário de clustering
    const infoWindowInstance = new google.maps.InfoWindow({
      content: generateInfoWindowContent(cluster)
    });

    // Adicionar evento de clique
    markerInstance.addListener('click', () => {
      // Fechar outras InfoWindows (opcional - pode ser implementado globalmente)
      infoWindowInstance.open(map, markerInstance);
      
      // Callback personalizado
      if (onMarkerClick) {
        onMarkerClick(cluster);
      }
      
      // Se for um cluster, dar zoom para mostrar áreas individuais
      if (cluster.isCluster) {
        const currentZoom = map.getZoom() || 15;
        map.setCenter(position);
        map.setZoom(Math.min(currentZoom + 2, 20)); // Aumentar zoom em 2 níveis
      }
    });

    setMarker(markerInstance);
    setInfoWindow(infoWindowInstance);

    // Cleanup - aqui usamos os estados marker e infoWindow
    return () => {
      markerInstance.setMap(null);
      infoWindowInstance.close();
    };
  }, [cluster, map, onMarkerClick]);

  // Componente não renderiza nada visualmente (marcador é criado diretamente na API do Google Maps)
  return null;
}

// Componente para renderizar múltiplos clusters
interface ClusteredMarkersProps {
  clusters: ClusteredArea[];
  map: google.maps.Map | null;
  onMarkerClick?: (cluster: ClusteredArea) => void;
}

export function ClusteredMarkers({ clusters, map, onMarkerClick }: ClusteredMarkersProps) {
  if (!map) return null;

  return (
    <>
      {clusters.map((cluster) => (
        <ClusteredMarker
          key={cluster.id}
          cluster={cluster}
          map={map}
          onMarkerClick={onMarkerClick}
        />
      ))}
    </>
  );
}
