'use client'

import React from 'react';
import GoogleMap from './GoogleMap';

interface MapContainerProps {
  onMapReady?: (map: google.maps.Map) => void;
  onCenterChanged?: (center: { lat: number; lng: number }) => void;
}

export function MapContainer({ onMapReady, onCenterChanged }: MapContainerProps) {
  // Console log para debug
  console.log('Renderizando MapContainer');
  
  return (
    <div className="h-full w-full" style={{ minHeight: '400px', position: 'relative' }}>
      <GoogleMap 
        className="h-full w-full rounded-lg"
        onMapReady={onMapReady}
        onCenterChanged={onCenterChanged}
      />
    </div>
  )
}
