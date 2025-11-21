'use client';

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface LiderancasFiltersProps {
  selectedCidade: string;
  selectedBairro: string;
  selectedTipoLideranca: string;
  onCidadeChange: (cidade: string) => void;
  onBairroChange: (bairro: string) => void;
  onTipoLiderancaChange: (tipo: string) => void;
  onClearFilters: () => void;
}

export const LiderancasFilters: React.FC<LiderancasFiltersProps> = ({
  selectedCidade,
  selectedBairro,
  selectedTipoLideranca,
  onCidadeChange,
  onBairroChange,
  onTipoLiderancaChange,
  onClearFilters
}) => {
  const cidades = ['São Paulo']; // Por enquanto só temos São Paulo
  
  const bairros = [
    'Centro', 'Vila Madalena', 'Jardins', 'Pinheiros', 'Moema',
    'Vila Olímpia', 'Itaim Bibi', 'Brooklin', 'Campo Belo', 'Santo Amaro',
    'Vila Nova Conceição', 'Morumbi', 'Perdizes', 'Higienópolis', 'Consolação',
    'Liberdade', 'Bela Vista', 'República', 'Santa Cecília', 'Vila Mariana'
  ];

  const tiposLideranca = [
    'comunitaria', 'religiosa', 'sindical', 'empresarial', 
    'politica', 'social', 'esportiva', 'cultural'
  ];

  const hasActiveFilters = selectedCidade || selectedBairro || selectedTipoLideranca;

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg border mb-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Filtros:</span>
        
        <Select value={selectedCidade} onValueChange={onCidadeChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Cidade" />
          </SelectTrigger>
          <SelectContent>
            {cidades.map((cidade) => (
              <SelectItem key={cidade} value={cidade}>
                {cidade}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedBairro} onValueChange={onBairroChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Bairro" />
          </SelectTrigger>
          <SelectContent>
            {bairros.map((bairro) => (
              <SelectItem key={bairro} value={bairro}>
                {bairro}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedTipoLideranca} onValueChange={onTipoLiderancaChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Tipo de Liderança" />
          </SelectTrigger>
          <SelectContent>
            {tiposLideranca.map((tipo) => (
              <SelectItem key={tipo} value={tipo}>
                {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            Limpar
          </Button>
        )}
      </div>
    </div>
  );
};
