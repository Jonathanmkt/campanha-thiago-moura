'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronDown, MoreVertical, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { Tables } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

type Eleitor = Tables<'eleitor'>;

interface EleitoresTableRowProps {
  eleitor: Eleitor;
}

/**
 * Componente de linha da tabela de eleitores
 */
const EleitoresTableRow: React.FC<EleitoresTableRowProps> = ({ eleitor }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleRow = () => {
    setIsExpanded(!isExpanded);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const formatName = (name: string) => {
    const words = name.split(' ');
    if (words.length <= 2) return name;
    return `${words[0]} ${words[words.length - 1]}`;
  };

  const formatCPF = (cpf: string | null) => {
    if (!cpf) return 'Não informado';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const getNivelApoioStars = (nivel: number | null) => {
    if (nivel === null) {
      return (
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star} 
              size={14} 
              className="text-gray-300" 
            />
          ))}
        </div>
      );
    }
    
    // Definir cores baseadas no nível (1-5)
    const getStarColor = (starIndex: number, nivel: number) => {
      if (starIndex <= nivel) {
        switch (nivel) {
          case 1:
            return 'text-red-300 fill-red-200'; // Vermelho pastel
          case 2:
            return 'text-orange-300 fill-orange-200'; // Laranja pastel
          case 3:
            return 'text-gray-400 fill-gray-300'; // Cinza
          case 4:
            return 'text-yellow-400 fill-yellow-300'; // Amarelo pastel
          case 5:
            return 'text-green-400 fill-green-300'; // Verde pastel
          default:
            return 'text-gray-300';
        }
      }
      return 'text-gray-200';
    };

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            size={14} 
            className={getStarColor(star, nivel)}
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      key={eleitor.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative"
    >
      {/* Row principal */}
      <div className={`bg-background transition-all duration-200 ${isExpanded ? 'rounded-t-lg border-t border-l border-r border-primary/20' : 'border border-primary/20 rounded-lg hover:bg-gray-100/80'}`}>
        <div 
          className="grid grid-cols-12 gap-3 px-4 py-4 items-center cursor-pointer"
          onClick={toggleRow}
        >
          {/* Chevron */}
          <div className="col-span-1 pr-0">
            <button className="p-1 hover:bg-primary/10 rounded-full transition-colors">
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
          </div>

          {/* Avatar */}
          <div className="col-span-1 pl-0">
            <Avatar className="h-11 w-11 ring-2 ring-primary ring-offset-2">
              <AvatarImage src={eleitor.foto_url || undefined} alt={eleitor.nome_completo} />
              <AvatarFallback className="text-xs">
                {getInitials(eleitor.nome_completo)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Nome Completo com Tooltip */}
          <div className="col-span-2 text-sm font-medium">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="truncate">
                    {formatName(eleitor.nome_completo)}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p>{eleitor.nome_completo}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* CPF com Tooltip */}
          <div className="col-span-2 text-sm text-muted-foreground">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="truncate">
                    {formatCPF(eleitor.cpf)}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>CPF: {formatCPF(eleitor.cpf)}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Profissão com Tooltip */}
          <div className="col-span-2 text-sm text-muted-foreground">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="truncate">
                    {eleitor.profissao || 'Não informado'}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Profissão: {eleitor.profissao || 'Não informado'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Bairro com Tooltip */}
          <div className="col-span-2 text-sm text-muted-foreground">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="truncate">
                    {eleitor.bairro || 'Não informado'}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Bairro: {eleitor.bairro || 'Não informado'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Nível de Apoio */}
          <div className="col-span-1">
            {getNivelApoioStars(eleitor.nivel_apoio)}
          </div>

          {/* Ações */}
          <div className="col-span-1 flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 hover:bg-primary/10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Editar</DropdownMenuItem>
                <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Row expandida */}
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-gray-50 border-l border-r border-b border-primary/20 rounded-b-lg overflow-hidden"
        >
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-sm">{eleitor.email || 'Não informado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Telefone</label>
                <p className="text-sm">{eleitor.telefone || 'Não informado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Data de Nascimento</label>
                <p className="text-sm">
                  {eleitor.data_nascimento 
                    ? new Date(eleitor.data_nascimento).toLocaleDateString('pt-BR')
                    : 'Não informado'
                  }
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Estado Civil</label>
                <p className="text-sm">{eleitor.estado_civil || 'Não informado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Escolaridade</label>
                <p className="text-sm">{eleitor.escolaridade || 'Não informado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Intenção de Voto</label>
                <p className="text-sm">{eleitor.intencao_voto || 'Não informado'}</p>
              </div>
            </div>
            
            {eleitor.observacoes && (
              <div>
                <label className="text-sm font-medium text-gray-600">Observações</label>
                <p className="text-sm mt-1">{eleitor.observacoes}</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EleitoresTableRow;
