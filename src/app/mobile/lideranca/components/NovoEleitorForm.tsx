'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface NovoEleitorFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function NovoEleitorForm({ onSuccess, onCancel }: NovoEleitorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome_completo: '',
    telefone: '',
    email: '',
    bairro: '',
    endereco: '',
    intencao_voto: '',
    observacoes: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome_completo.trim()) {
      alert('Nome é obrigatório');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/mobile/eleitores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        onSuccess();
      } else {
        alert(result.error || 'Erro ao cadastrar eleitor');
      }
    } catch (error) {
      console.error('Erro ao cadastrar eleitor:', error);
      alert('Erro ao cadastrar eleitor');
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

        {/* Bairro */}
        <div className="space-y-2">
          <Label htmlFor="bairro" className="text-sm font-medium">
            Bairro
          </Label>
          <Input
            id="bairro"
            placeholder="Digite o bairro"
            value={formData.bairro}
            onChange={(e) => handleChange('bairro', e.target.value)}
            className="h-12"
            autoComplete="off"
          />
        </div>

        {/* Endereço */}
        <div className="space-y-2">
          <Label htmlFor="endereco" className="text-sm font-medium">
            Endereço
          </Label>
          <Input
            id="endereco"
            placeholder="Rua, número, complemento"
            value={formData.endereco}
            onChange={(e) => handleChange('endereco', e.target.value)}
            className="h-12"
            autoComplete="off"
          />
        </div>

        {/* Intenção de Voto */}
        <div className="space-y-2">
          <Label htmlFor="intencao_voto" className="text-sm font-medium">
            Intenção de Voto
          </Label>
          <Select
            value={formData.intencao_voto}
            onValueChange={(value) => handleChange('intencao_voto', value)}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="favoravel">Favorável</SelectItem>
              <SelectItem value="indeciso">Indeciso</SelectItem>
              <SelectItem value="contrario">Contrário</SelectItem>
              <SelectItem value="nao_informado">Não informado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Observações */}
        <div className="space-y-2">
          <Label htmlFor="observacoes" className="text-sm font-medium">
            Observações
          </Label>
          <Textarea
            id="observacoes"
            placeholder="Anotações sobre o eleitor..."
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
          className="flex-1 h-12"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            'Salvar Eleitor'
          )}
        </Button>
      </div>
    </form>
  );
}
