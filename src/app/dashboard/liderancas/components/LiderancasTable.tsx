'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Tables } from '@/types';

type Lideranca = Tables<'lideranca'>;

interface LiderancasTableProps {
  liderancas: Lideranca[];
  isLoading: boolean;
  onLiderancaClick?: (lideranca: Lideranca) => void;
  liderancaSelecionadaId?: string;
}

export const LiderancasTable: React.FC<LiderancasTableProps> = ({ 
  liderancas, 
  isLoading,
  onLiderancaClick,
  liderancaSelecionadaId
}) => {
  const formatName = (name: string) => {
    const words = name.split(' ');
    if (words.length <= 2) return name;
    return `${words[0]} ${words[words.length - 1]}`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };


  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {liderancas.map((lideranca) => {
        const isSelected = lideranca.id === liderancaSelecionadaId;
        return (
          <motion.div
            key={lideranca.id}
            className={`flex items-center p-3 rounded-lg transition-all cursor-pointer ${
              isSelected 
                ? 'bg-green-50 border border-green-200 shadow-md' 
                : 'bg-white hover:bg-gray-50 shadow-sm hover:shadow-md'
            }`}
            whileHover={{ scale: isSelected ? 1 : 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onLiderancaClick?.(lideranca)}
          >
            <div className="flex-shrink-0">
              <Avatar className={`${isSelected ? 'ring-2 ring-green-500 ring-offset-2' : 'ring-1 ring-green-500/30 ring-offset-1'}`}>
                {lideranca.foto_url && (
                  <AvatarImage 
                    src={lideranca.foto_url} 
                    alt={lideranca.nome_completo}
                  />
                )}
                <AvatarFallback className="text-xs font-medium">
                  {getInitials(lideranca.nome_completo)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${isSelected ? 'text-green-800' : 'text-gray-900'}`}>
                {formatName(lideranca.nome_completo)}
              </p>
              <p className={`text-xs truncate ${isSelected ? 'text-green-600' : 'text-gray-500'}`}>
                {lideranca.tipo_lideranca}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
