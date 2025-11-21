'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useGoogleMaps } from '../hooks/useGoogleMaps';
import { useOptimizedAreas } from '../hooks/useOptimizedAreas';
import { useMunicipioMarkers } from '../hooks/useMunicipioMarkers';
import { clusterAreas } from '../utils/clustering';
import { ClusteredMarkers } from './ClusteredMarker';
import { MunicipioMarkers } from './MunicipioMarkers';

// Declaração global para o Google Maps
declare global {
  interface Window {
    google: typeof google;
  }
}

interface GoogleMapProps {
  className?: string;
  onMapReady?: (map: google.maps.Map) => void;
  onCenterChanged?: (center: { lat: number; lng: number }) => void;
}

export default function GoogleMap({ 
  className = "h-full w-full",
  onMapReady,
  onCenterChanged
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const { isLoaded, error: hookError } = useGoogleMaps();
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  // Usar o hook otimizado para áreas
  const { 
    areas, 
    currentZoom, 
    shouldShowMarkers
  } = useOptimizedAreas({ mapInstance: map });

  // Usar o hook para marcadores de município
  const {
    municipios,
    shouldShowMunicipioMarkers
  } = useMunicipioMarkers({ mapInstance: map });

  // Obter localização do usuário
  useEffect(() => {
    // Fallback: Centro do RJ (entre Araruama e Rio)
    const fallbackLocation = { lat: -22.6140, lng: -42.6406 };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          
          // Verificar se o usuário está próximo do Rio de Janeiro (região da campanha)
          // Se estiver muito longe, usar Araruama como centro
          const distanceFromRJ = Math.sqrt(
            Math.pow(userLat - (-22.9068), 2) + Math.pow(userLng - (-43.1729), 2)
          );
          
          if (distanceFromRJ < 2) { // Aproximadamente 200km
            setUserLocation({
              lat: userLat,
              lng: userLng
            });
          } else {
            // Usuário muito longe do RJ, usar Araruama
            setUserLocation(fallbackLocation);
          }
        },
        (error) => {
          console.warn('Erro ao obter localização:', error);
          setUserLocation(fallbackLocation);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 600000 // 10 minutos
        }
      );
    } else {
      setUserLocation(fallbackLocation);
    }
  }, []);

  // Inicializar o mapa quando o Google Maps estiver carregado
  useEffect(() => {
    if (!isLoaded || !mapRef.current || map || !userLocation) return;

    try {
      const mapInstance = new google.maps.Map(mapRef.current, {
        center: userLocation,
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'transit',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ],
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.TOP_CENTER,
        },
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_CENTER,
        },
        scaleControl: true,
        streetViewControl: true,
        streetViewControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP,
        },
        fullscreenControl: true,
      });

      setMap(mapInstance);
      onMapReady?.(mapInstance);

      // Log do centro inicial do mapa
      console.log('🗺️ Centro inicial do mapa:', userLocation);
      
      // Listener para mudanças no centro do mapa
      const centerChangedListener = mapInstance.addListener('center_changed', () => {
        const center = mapInstance.getCenter();
        if (center) {
          const centerCoords = { lat: center.lat(), lng: center.lng() };
          console.log('📍 Centro atual do mapa:', centerCoords);
          onCenterChanged?.(centerCoords);
        }
      });

      // Cleanup
      return () => {
        google.maps.event.removeListener(centerChangedListener);
      };
    } catch (err) {
      console.error('Erro ao inicializar o mapa:', err);
      setError('Erro ao carregar o mapa');
    }
  }, [isLoaded, userLocation, map, onMapReady, onCenterChanged]);

  // Renderizar marcadores clusterizados
  const clusteredAreas = clusterAreas(areas, currentZoom);

  if (hookError) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 rounded-lg`}>
        <div className="text-center p-8">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-sm text-gray-600">Erro ao carregar Google Maps</p>
          <p className="text-xs text-gray-500 mt-1">{hookError}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 rounded-lg`}>
        <div className="text-center p-8">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 rounded-lg`}>
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div ref={mapRef} className="h-full w-full" />
      
      
      {/* Renderizar marcadores clusterizados */}
      {map && shouldShowMarkers && (
        <ClusteredMarkers 
          map={map}
          clusters={clusteredAreas}
          zoom={currentZoom}
        />
      )}

      {/* Renderizar marcadores de município */}
      {map && shouldShowMunicipioMarkers && (
        <MunicipioMarkers 
          map={map}
          municipios={municipios}
          visible={shouldShowMunicipioMarkers}
        />
      )}
    </div>
  );
}
