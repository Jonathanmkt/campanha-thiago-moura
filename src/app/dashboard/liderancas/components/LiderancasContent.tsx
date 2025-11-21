'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { LiderancasTable } from './LiderancasTable';
import { LiderancaDetail } from './LiderancaDetail';
import type { Tables } from '@/types';
import { useLiderancasData } from '../hooks/useLiderancasData';

type Lideranca = Tables<'lideranca'>;

export function LiderancasContent() {
  const [sortOrder] = useState<'asc' | 'desc'>('asc');
  const [liderancaSelecionada, setLiderancaSelecionada] = useState<Lideranca | null>(null);
  
  // Busca os dados das lideranças do Supabase
  const { data: liderancas = [], isLoading, error } = useLiderancasData();
  
  // Seleciona a primeira liderança quando os dados são carregados
  useEffect(() => {
    if (liderancas.length > 0 && !liderancaSelecionada) {
      const timer = setTimeout(() => {
        setLiderancaSelecionada(liderancas[0]);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [liderancas, liderancaSelecionada]);
  
  // Ordena as lideranças
  const liderancasOrdenadas = useMemo(() => {
    return [...liderancas].sort((a, b) => {
      return sortOrder === 'asc' 
        ? a.nome_completo.localeCompare(b.nome_completo)
        : b.nome_completo.localeCompare(a.nome_completo);
    });
  }, [liderancas, sortOrder]);

  const handleLiderancaClick = useCallback((lideranca: Lideranca) => {
    setLiderancaSelecionada(lideranca);
  }, []);
  
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-red-500">
        Erro ao carregar lideranças: {error.message}
      </div>
    );
  }

  return (
    <div className='h-full flex flex-col overflow-hidden'>
      <div className='h-full flex flex-col bg-gray-200 rounded-lg shadow flex-1' style={{ minHeight: 0 }}>

        {/* Área principal com tabela e detalhes */}
        <div className='flex-1 flex p-4 gap-4 overflow-hidden'>
          <div className="w-1/4 min-w-[200px] flex flex-col">
            <div className="flex-1 overflow-y-auto border-r border-gray-200 pr-4">
              <LiderancasTable 
                liderancas={liderancasOrdenadas} 
                isLoading={isLoading}
                onLiderancaClick={handleLiderancaClick}
                liderancaSelecionadaId={liderancaSelecionada?.id}
              />
            </div>
          </div>
          <div className="w-3/4 flex-1 flex flex-col">
            <LiderancaDetail lideranca={liderancaSelecionada} />
          </div>
        </div>
      </div>
    </div>
  );
}
