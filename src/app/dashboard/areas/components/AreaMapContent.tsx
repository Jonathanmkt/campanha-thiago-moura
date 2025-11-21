import React, { useState, useCallback } from 'react';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { MapContainer } from './MapContainer';
import { AreaCardsList } from './AreaCardsList';
import { CreateAreaModal } from '../modals/CreateAreaModal';
import { EditAreaModal } from '../modals/EditAreaModal';
import { useOptimizedAreas } from '../hooks/useOptimizedAreas';
import { useCreateArea } from '../hooks/useCreateArea';
import { useUpdateArea } from '../hooks/useUpdateArea';
import type { Area } from '../hooks/useAreas';

export function AreaMapContent() {
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  
  // Usar hook otimizado que carrega apenas áreas visíveis no viewport
  const { areas, loading, shouldShowMarkers, refreshAreas } = useOptimizedAreas({ mapInstance });
  
  // Hooks para criar e editar áreas
  const { createArea } = useCreateArea();
  const { updateArea } = useUpdateArea();
  
  // Simular hasMore e loadMore para compatibilidade com AreaCardsList
  const hasMore = false; // Não precisamos mais de paginação manual
  const loadMore = () => {}; // Carregamento é automático baseado no viewport

  const handleCenterChanged = useCallback(() => {
    // Centro do mapa agora é gerenciado automaticamente pelo hook otimizado
  }, []);

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    if (mapInstance) {
      // Mover o mapa para a localização selecionada
      mapInstance.setCenter({ lat, lng });
      mapInstance.setZoom(18);
      
      // Adicionar marcador na localização
      new google.maps.Marker({
        position: { lat, lng },
        map: mapInstance,
        title: address,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#ef4444',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2
        }
      });
    }
  };

  // Handlers para os modais
  const handleCreateArea = useCallback(() => {
    setCreateModalOpen(true);
  }, []);

  const handleEditArea = useCallback((areaId: string) => {
    const area = areas.find(a => a.id === areaId);
    if (area) {
      setSelectedArea(area);
      setEditModalOpen(true);
    }
  }, [areas]);

  const handleCreateAreaSubmit = useCallback(async (areaData: any) => {
    await createArea(areaData);
    refreshAreas(); // Atualizar a lista de áreas
  }, [createArea, refreshAreas]);

  const handleUpdateAreaSubmit = useCallback(async (areaId: string, areaData: any) => {
    await updateArea(areaId, areaData);
    refreshAreas(); // Atualizar a lista de áreas
  }, [updateArea, refreshAreas]);

  return (
    <div className='h-full flex flex-col overflow-hidden'>
      <div className='h-full flex flex-col bg-gray-200 rounded-lg shadow flex-1' style={{ minHeight: 0 }}>
        {/* Layout resizable com duas colunas */}
        <div className="flex-1 p-6 overflow-hidden">
          <ResizablePanelGroup
            direction="horizontal"
            className="h-full rounded-lg border bg-white"
          >
            {/* Painel esquerdo - Mapa */}
            <ResizablePanel defaultSize={60} minSize={40}>
              <div className="h-full p-4" style={{ minHeight: '500px' }}>
                {/* Console log para debug */}
                {/* eslint-disable-next-line no-console */}
                <div className="sr-only" aria-hidden="true">
                  Renderizando container do mapa
                  {(() => { console.log('Renderizando container do mapa'); return null; })()}
                </div>
                <MapContainer 
                  onMapReady={setMapInstance} 
                  onCenterChanged={handleCenterChanged}
                />
              </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            {/* Painel direito - Lista de cards */}
            <ResizablePanel defaultSize={40} minSize={30}>
              <div className="h-full p-4">
                <AreaCardsList 
                  onLocationSelect={handleLocationSelect} 
                  areas={areas}
                  loading={loading}
                  hasMore={hasMore}
                  onLoadMore={loadMore}
                  onCreateArea={handleCreateArea}
                  onEditArea={handleEditArea}
                />
                
                {/* Informações de debug para o painel lateral */}
                {!shouldShowMarkers && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded mt-4">
                    <p className="text-sm text-yellow-800">
                      🔍 Aumente o zoom para ver as áreas no mapa
                    </p>
                  </div>
                )}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>

      {/* Modais */}
      <CreateAreaModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onCreateArea={handleCreateAreaSubmit}
      />

      <EditAreaModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        area={selectedArea}
        onUpdateArea={handleUpdateAreaSubmit}
      />
    </div>
  );
}
