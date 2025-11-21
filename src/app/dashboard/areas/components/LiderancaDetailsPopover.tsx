import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Calendar, Briefcase, User, Star } from 'lucide-react';
import type { LiderancaComRelacao } from '../hooks/useAreaLiderancas';

interface LiderancaDetailsPopoverProps {
  lideranca: LiderancaComRelacao;
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
}

export function LiderancaDetailsPopover({ lideranca, children, onOpenChange }: LiderancaDetailsPopoverProps) {
  const getTipoLiderancaColor = (tipo: string) => {
    const colors = {
      'comunitaria': 'bg-blue-100 text-blue-800',
      'religiosa': 'bg-purple-100 text-purple-800',
      'sindical': 'bg-orange-100 text-orange-800',
      'empresarial': 'bg-green-100 text-green-800',
      'politica': 'bg-red-100 text-red-800',
      'social': 'bg-yellow-100 text-yellow-800',
      'esportiva': 'bg-indigo-100 text-indigo-800',
      'cultural': 'bg-pink-100 text-pink-800'
    };
    return colors[tipo as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTipoAtuacaoColor = (tipo: string) => {
    const colors = {
      'coordenacao': 'bg-blue-50 text-blue-700 border-blue-200',
      'influencia': 'bg-green-50 text-green-700 border-green-200',
      'trabalho': 'bg-purple-50 text-purple-700 border-purple-200',
      'representacao': 'bg-orange-50 text-orange-700 border-orange-200',
      'moradia': 'bg-red-50 text-red-700 border-red-200',
      'religioso': 'bg-yellow-50 text-yellow-700 border-yellow-200'
    };
    return colors[tipo as keyof typeof colors] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const renderStars = (nivel: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < nivel ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Popover onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4 space-y-4">
          {/* Header com foto e nome */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {lideranca.foto_url ? (
                <img
                  src={lideranca.foto_url}
                  alt={lideranca.nome_completo}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary/60" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg leading-tight">
                {lideranca.nome_popular || lideranca.nome_completo}
              </h3>
              {lideranca.nome_popular && (
                <p className="text-sm text-gray-600 truncate">
                  {lideranca.nome_completo}
                </p>
              )}
              <Badge className={`text-xs mt-1 ${getTipoLiderancaColor(lideranca.tipo_lideranca)}`}>
                {lideranca.tipo_lideranca?.charAt(0).toUpperCase() + 
                 lideranca.tipo_lideranca?.slice(1)}
              </Badge>
            </div>
          </div>

          {/* Informações de contato */}
          <div className="space-y-2">
            {lideranca.telefone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{lideranca.telefone}</span>
              </div>
            )}
            {lideranca.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="truncate">{lideranca.email}</span>
              </div>
            )}
            {lideranca.profissao && (
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-gray-500" />
                <span>{lideranca.profissao}</span>
              </div>
            )}
          </div>

          {/* Níveis de influência */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Influência Geral:</span>
              <div className="flex items-center gap-1">
                {renderStars(lideranca.nivel_influencia)}
                <span className="text-xs text-gray-500 ml-1">
                  {lideranca.nivel_influencia}/5
                </span>
              </div>
            </div>
            {lideranca.nivel_influencia_area && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Influência na Área:</span>
                <div className="flex items-center gap-1">
                  {renderStars(lideranca.nivel_influencia_area)}
                  <span className="text-xs text-gray-500 ml-1">
                    {lideranca.nivel_influencia_area}/5
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Tipo de atuação */}
          {lideranca.tipo_atuacao && (
            <div>
              <span className="text-sm text-gray-600">Tipo de Atuação:</span>
              <Badge 
                variant="outline" 
                className={`text-xs mt-1 ml-2 ${getTipoAtuacaoColor(lideranca.tipo_atuacao)}`}
              >
                {lideranca.tipo_atuacao?.charAt(0).toUpperCase() + 
                 lideranca.tipo_atuacao?.slice(1)}
              </Badge>
            </div>
          )}

          {/* Ações */}
          <div className="flex gap-2 pt-2 border-t">
            {lideranca.telefone && (
              <Button size="sm" variant="outline" className="flex-1">
                <Phone className="h-3 w-3 mr-1" />
                Ligar
              </Button>
            )}
            {lideranca.email && (
              <Button size="sm" variant="outline" className="flex-1">
                <Mail className="h-3 w-3 mr-1" />
                Email
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
