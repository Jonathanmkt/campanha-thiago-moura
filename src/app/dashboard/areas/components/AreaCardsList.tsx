import React, { useCallback, useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LiderancasCarousel } from './LiderancasCarousel';
import { Users, MapPinned, Plus, Edit } from 'lucide-react';
import type { Tables } from '@/types';
import { PesquisaBadge } from './PesquisaBadge';

type Area = Tables<'area'>;

// Interface para campos opcionais que podem existir na área
type AreaWithOptionalFields = Area & {
  endereco_formatado?: string | null;
  logradouro?: string | null;
  numero?: string | null;
  liderancas_count?: number;
};

interface AreaCardsListProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  areas: Area[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onCreateArea?: () => void;
  onEditArea?: (areaId: string) => void;
}

export function AreaCardsList({ 
  onLocationSelect, 
  areas, 
  loading, 
  hasMore, 
  onLoadMore, 
  onCreateArea, 
  onEditArea 
}: AreaCardsListProps) {
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [liderancasCounts, setLiderancasCounts] = useState<Record<string, number>>({});
  
  const handleLiderancaCountChange = useCallback((areaId: string, count: number) => {
    setLiderancasCounts(prev => ({
      ...prev,
      [areaId]: count
    }));
  }, []);

  const formatAddressLine = useCallback((area: AreaWithOptionalFields) => {
    // Construir endereço a partir dos campos detalhados (prioridade)
    if (area.logradouro) {
      const numeroPart = area.numero ? `, ${area.numero}` : '';
      const bairroPart = area.bairro ? ` - ${area.bairro}` : '';
      const cidadePart = area.cidade ? `, ${area.cidade}` : '';
      return `${area.logradouro}${numeroPart}${bairroPart}${cidadePart}`;
    }
    
    // Fallback para endereco simples (removendo redundância de CEP, UF e país)
    if (area.endereco) {
      let endereco = area.endereco;
      
      // Remover país primeiro
      endereco = endereco.replace(/,\s*Brazil[^,]*$/, ''); // Remove país
      endereco = endereco.replace(/,\s*Brasil[^,]*$/, ''); // Remove país
      
      // Remover CEP duplicado do final do endereço
      const cepRegex = /,\s*\d{5}-\d{3}[^,]*$/;
      endereco = endereco.replace(cepRegex, '');
      
      // Remover UF/estado por último
      endereco = endereco.replace(/,\s*-\s*[A-Z]{2}$/, ''); // Remove estado (ex: , - RJ)
      endereco = endereco.replace(/\s*-\s*[A-Z]{2}$/, ''); // Remove estado (ex: - RJ)
      endereco = endereco.replace(/,\s*[A-Z]{2}$/, ''); // Remove estado (ex: , RJ)
      
      // Limpar espaços e vírgulas extras
      endereco = endereco.replace(/\s*,\s*$/, ''); // Remove vírgula final
      endereco = endereco.replace(/\s{2,}/g, ' '); // Remove espaços duplos
      
      return endereco;
    }
    
    return `${area.nome}, ${area.tipo}`;
  }, []);

  const handleLocationClick = useCallback((area: AreaWithOptionalFields) => {
    if (area.latitude && area.longitude) {
      const address = formatAddressLine(area);
      onLocationSelect(
        parseFloat(area.latitude.toString()), 
        parseFloat(area.longitude.toString()), 
        address
      );
    }
  }, [onLocationSelect, formatAddressLine]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        {onCreateArea && (
          <Button 
            onClick={onCreateArea} 
            size="lg" 
            className="w-full justify-center gap-2 py-5 text-base"
          >
            <Plus className="h-5 w-5" />
            Adicionar Área
          </Button>
        )}
      </div>

      {/* Lista de áreas */}
      <ScrollArea className="flex-1">
        <div className="space-y-4 p-4">
          {loading && areas.length === 0 && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Carregando áreas...</p>
            </div>
          )}
          
          {!loading && areas.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">Nenhuma área encontrada</p>
            </div>
          )}
          
          {areas.map((area) => (
            <div 
              key={area.id}
              onClick={() => setSelectedAreaId(area.id === selectedAreaId ? null : area.id)}
              className={`cursor-pointer p-4 rounded-lg border transition-colors ${area.id === selectedAreaId ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}`}
            >
              <div className="flex gap-5">
                {/* Carousel de lideranças à esquerda */}
                <div className="flex-shrink-0 h-full">
                  <LiderancasCarousel 
                    areaId={area.id} 
                    onCountChange={(count) => handleLiderancaCountChange(area.id, count)}
                  />
                </div>
                
                {/* Informações da área à direita */}
                <div className="flex-1 min-w-0 flex flex-col space-y-2">
                  {/* Cabeçalho: Nome e Ações */}
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{area.nome}</h3>
                    <div className="flex items-center gap-2">
                      {(liderancasCounts[area.id] || (area as any).liderancas_count || 0) > 0 && (
                        <div className="flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-0.5">
                          <Users className="h-3 w-3 text-gray-500" />
                          <span className="text-xs text-gray-600">{liderancasCounts[area.id] || (area as any).liderancas_count || 0}</span>
                        </div>
                      )}
                      {onEditArea && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditArea(area.id);
                          }}
                          className="h-6 w-6 p-0 hover:bg-gray-200"
                        >
                          <Edit className="h-3 w-3 text-gray-500" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Endereço */}
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 leading-snug">
                      {formatAddressLine(area)}
                    </p>
                    {area.cep && (
                      <p className="text-xs text-gray-500">CEP {area.cep}</p>
                    )}
                    {area.tipo && (
                      <p className="text-xs text-gray-500">Tipo: {area.tipo.charAt(0).toUpperCase() + area.tipo.slice(1)}</p>
                    )}
                  </div>
                  
                  {/* Badges */}
                  <div className="flex flex-wrap gap-x-3 gap-y-2 pt-2">
                    {/* Badge de Pesquisas - Primeiro à esquerda */}
                    <PesquisaBadge areaId={area.id} />
                    <Badge variant="outline" className="h-8 bg-green-50 text-green-700 hover:bg-green-100 border-green-200 flex items-center gap-1 py-1 px-2">
                      <Users className="h-3.5 w-3.5" />
                      <span className="font-medium text-xs">{area.populacao_estimada?.toLocaleString() || 'N/A'} hab</span>
                    </Badge>
                    <Badge variant="outline" className="h-8 bg-green-50 text-green-700 hover:bg-green-100 border-green-200 flex items-center gap-1 py-1 px-2">
                      <MapPinned className="h-3.5 w-3.5" />
                      <span className="font-medium text-xs">{area.eleitores_estimados?.toLocaleString() || 'N/A'} eleit</span>
                    </Badge>
                    {area.zona_eleitoral && (
                      <Badge variant="outline" className="h-8 bg-green-50 text-green-700 hover:bg-green-100 border-green-200 flex items-center gap-1 py-1 px-2">
                        <span className="font-medium text-xs">Zona {area.zona_eleitoral}</span>
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {loading && areas.length > 0 && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              <p className="text-xs text-gray-500 mt-1">Carregando mais áreas...</p>
            </div>
          )}
          
          {hasMore && !loading && (
            <div className="text-center py-4">
              <button 
                onClick={onLoadMore}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                Carregar mais áreas
              </button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
