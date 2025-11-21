'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Loader2 } from 'lucide-react';
import { MapSearch } from '../components/MapSearch';

interface CreateAreaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateArea: (areaData: CreateAreaData) => Promise<void>;
}

export interface CreateAreaData {
  nome: string;
  tipo: string;
  codigo?: string;
  descricao?: string;
  endereco_legado: string;
  populacao_estimada?: number;
  eleitores_estimados?: number;
  zona_eleitoral?: string;
  secao_eleitoral?: string;
  prioridade?: number;
  latitude?: number;
  longitude?: number;
}

export function CreateAreaModal({ open, onOpenChange, onCreateArea }: CreateAreaModalProps) {
  const [formData, setFormData] = useState<CreateAreaData>({
    nome: '',
    tipo: '',
    codigo: '',
    descricao: '',
    endereco_legado: '',
    populacao_estimada: undefined,
    eleitores_estimados: undefined,
    zona_eleitoral: '',
    secao_eleitoral: '',
    prioridade: 1
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number, address: string} | null>(null);

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setSelectedLocation({ lat, lng, address });
    setFormData(prev => ({
      ...prev,
      endereco_legado: address,
      latitude: lat,
      longitude: lng
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.tipo || !formData.endereco_legado) {
      alert('Por favor, preencha os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreateArea(formData);
      // Reset form
      setFormData({
        nome: '',
        tipo: '',
        codigo: '',
        descricao: '',
        endereco_legado: '',
        populacao_estimada: undefined,
        eleitores_estimados: undefined,
        zona_eleitoral: '',
        secao_eleitoral: '',
        prioridade: 1
      });
      setSelectedLocation(null);
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao criar área:', error);
      alert('Erro ao criar área. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof CreateAreaData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Criar Nova Área Política
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome da Área */}
          <div className="space-y-2">
            <Label htmlFor="nome">
              Nome da Área <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              placeholder="Ex: Centro, Copacabana, Zona Norte"
              required
            />
          </div>

          {/* Tipo da Área */}
          <div className="space-y-2">
            <Label htmlFor="tipo">
              Tipo da Área <span className="text-red-500">*</span>
            </Label>
            <Select onValueChange={(value) => handleInputChange('tipo', value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bairro">Bairro</SelectItem>
                <SelectItem value="distrito">Distrito</SelectItem>
                <SelectItem value="zona_eleitoral">Zona Eleitoral</SelectItem>
                <SelectItem value="setor">Setor</SelectItem>
                <SelectItem value="quadra">Quadra</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Código da Área */}
          <div className="space-y-2">
            <Label htmlFor="codigo">Código da Área</Label>
            <Input
              id="codigo"
              value={formData.codigo}
              onChange={(e) => handleInputChange('codigo', e.target.value)}
              placeholder="Ex: CP001, ZN002"
            />
          </div>

          {/* Busca de Endereço */}
          <div className="space-y-2">
            <Label>
              Endereço <span className="text-red-500">*</span>
            </Label>
            <MapSearch onLocationSelect={handleLocationSelect} />
            {selectedLocation && (
              <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                📍 Localização selecionada: {selectedLocation.address}
              </div>
            )}
          </div>

          {/* Dados Eleitorais */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="populacao_estimada">População Estimada</Label>
              <Input
                id="populacao_estimada"
                type="number"
                min="0"
                value={formData.populacao_estimada || ''}
                onChange={(e) => handleInputChange('populacao_estimada', parseInt(e.target.value) || undefined)}
                placeholder="Ex: 50000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eleitores_estimados">Eleitores Estimados</Label>
              <Input
                id="eleitores_estimados"
                type="number"
                min="0"
                value={formData.eleitores_estimados || ''}
                onChange={(e) => handleInputChange('eleitores_estimados', parseInt(e.target.value) || undefined)}
                placeholder="Ex: 35000"
              />
            </div>
          </div>

          {/* Dados Eleitorais - Zona e Seção */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zona_eleitoral">Zona Eleitoral</Label>
              <Input
                id="zona_eleitoral"
                value={formData.zona_eleitoral}
                onChange={(e) => handleInputChange('zona_eleitoral', e.target.value)}
                placeholder="Ex: 001, 147"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secao_eleitoral">Seção Eleitoral</Label>
              <Input
                id="secao_eleitoral"
                value={formData.secao_eleitoral}
                onChange={(e) => handleInputChange('secao_eleitoral', e.target.value)}
                placeholder="Ex: 0001, 0234"
              />
            </div>
          </div>

          {/* Prioridade */}
          <div className="space-y-2">
            <Label htmlFor="prioridade">Prioridade</Label>
            <Select onValueChange={(value) => handleInputChange('prioridade', parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 - Baixa</SelectItem>
                <SelectItem value="2">2 - Média-Baixa</SelectItem>
                <SelectItem value="3">3 - Média</SelectItem>
                <SelectItem value="4">4 - Alta</SelectItem>
                <SelectItem value="5">5 - Muito Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => handleInputChange('descricao', e.target.value)}
              placeholder="Descreva características importantes desta área política..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Criar Área
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
