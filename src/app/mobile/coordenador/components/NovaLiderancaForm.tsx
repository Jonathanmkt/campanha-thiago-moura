'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { AddressSearch } from './AddressSearch';

interface NovaLiderancaFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface AddressData {
  endereco_formatado: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  latitude: number;
  longitude: number;
}

export function NovaLiderancaForm({ onSuccess, onCancel }: NovaLiderancaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressData | null>(null);
  const [formData, setFormData] = useState({
    nome_completo: '',
    nome_popular: '',
    telefone: '',
    email: '',
    tipo_lideranca: '',
    nivel_influencia: '3',
    observacoes: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressSelect = (address: AddressData) => {
    setSelectedAddress(address);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome_completo.trim()) {
      alert('Nome é obrigatório');
      return;
    }

    if (!formData.tipo_lideranca) {
      alert('Tipo de liderança é obrigatório');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/mobile/liderancas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          nivel_influencia: parseInt(formData.nivel_influencia),
          // Campos de endereço
          ...(selectedAddress && {
            endereco_formatado: selectedAddress.endereco_formatado,
            logradouro: selectedAddress.logradouro,
            numero: selectedAddress.numero,
            complemento: selectedAddress.complemento,
            bairro: selectedAddress.bairro,
            cidade: selectedAddress.cidade,
            estado: selectedAddress.estado,
            cep: selectedAddress.cep,
            latitude: selectedAddress.latitude,
            longitude: selectedAddress.longitude,
          }),
        }),
      });

      const result = await response.json();

      if (result.success) {
        onSuccess();
      } else {
        alert(result.error || 'Erro ao cadastrar liderança');
      }
    } catch (error) {
      console.error('Erro ao cadastrar liderança:', error);
      alert('Erro ao cadastrar liderança');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {/* Nome Completo */}
        <div className="space-y-2">
          <Label htmlFor="nome_completo" className="text-sm font-medium">
            Nome Completo <span className="text-red-500">*</span>
          </Label>
          <Input
            id="nome_completo"
            placeholder="Digite o nome completo"
            value={formData.nome_completo}
            onChange={(e) => handleChange('nome_completo', e.target.value)}
            className="h-12"
            autoComplete="off"
          />
        </div>

        {/* Nome Popular */}
        <div className="space-y-2">
          <Label htmlFor="nome_popular" className="text-sm font-medium">
            Nome Popular (Apelido)
          </Label>
          <Input
            id="nome_popular"
            placeholder="Como é conhecido"
            value={formData.nome_popular}
            onChange={(e) => handleChange('nome_popular', e.target.value)}
            className="h-12"
            autoComplete="off"
          />
        </div>

        {/* Telefone */}
        <div className="space-y-2">
          <Label htmlFor="telefone" className="text-sm font-medium">
            Telefone
          </Label>
          <Input
            id="telefone"
            type="tel"
            placeholder="(21) 99999-9999"
            value={formData.telefone}
            onChange={(e) => handleChange('telefone', e.target.value)}
            className="h-12"
            autoComplete="off"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="email@exemplo.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="h-12"
            autoComplete="off"
          />
        </div>

        {/* Tipo de Liderança */}
        <div className="space-y-2">
          <Label htmlFor="tipo_lideranca" className="text-sm font-medium">
            Tipo de Liderança <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.tipo_lideranca}
            onValueChange={(value) => handleChange('tipo_lideranca', value)}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione o tipo..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="comunitaria">Comunitária</SelectItem>
              <SelectItem value="religiosa">Religiosa</SelectItem>
              <SelectItem value="sindical">Sindical</SelectItem>
              <SelectItem value="empresarial">Empresarial</SelectItem>
              <SelectItem value="politica">Política</SelectItem>
              <SelectItem value="social">Social</SelectItem>
              <SelectItem value="esportiva">Esportiva</SelectItem>
              <SelectItem value="cultural">Cultural</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Nível de Influência */}
        <div className="space-y-2">
          <Label htmlFor="nivel_influencia" className="text-sm font-medium">
            Nível de Influência
          </Label>
          <Select
            value={formData.nivel_influencia}
            onValueChange={(value) => handleChange('nivel_influencia', value)}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 - Baixo</SelectItem>
              <SelectItem value="2">2 - Moderado</SelectItem>
              <SelectItem value="3">3 - Médio</SelectItem>
              <SelectItem value="4">4 - Alto</SelectItem>
              <SelectItem value="5">5 - Muito Alto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Endereço - Busca via Google */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Endereço
          </Label>
          <AddressSearch onAddressSelect={handleAddressSelect} />
          {selectedAddress && (
            <div className="text-xs text-muted-foreground mt-1 space-y-1">
              {selectedAddress.bairro && <p><strong>Bairro:</strong> {selectedAddress.bairro}</p>}
              {selectedAddress.cidade && <p><strong>Cidade:</strong> {selectedAddress.cidade}</p>}
              {selectedAddress.estado && <p><strong>Estado:</strong> {selectedAddress.estado}</p>}
            </div>
          )}
        </div>

        {/* Observações */}
        <div className="space-y-2">
          <Label htmlFor="observacoes" className="text-sm font-medium">
            Observações
          </Label>
          <Textarea
            id="observacoes"
            placeholder="Anotações sobre a liderança..."
            value={formData.observacoes}
            onChange={(e) => handleChange('observacoes', e.target.value)}
            rows={3}
          />
        </div>
      </div>

      {/* Botões de ação */}
      <div className="sticky bottom-0 bg-white pt-4 border-t flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 h-12"
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="flex-1 h-12 bg-blue-600 hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            'Salvar Liderança'
          )}
        </Button>
      </div>
    </form>
  );
}
