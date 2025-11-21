'use client';

import React from 'react';
import type { Tables } from '@/types';
import EleitoresTableRow from './EleitoresTableRow';

type Eleitor = Tables<'eleitor'>;

interface EleitoresTableProps {
  eleitores: Eleitor[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
}

const EleitoresTable: React.FC<EleitoresTableProps> = ({ 
  eleitores, 
  isLoading, 
  isFetchingNextPage,
  fetchNextPage, 
  hasNextPage 
}) => {
  // Função para lidar com o scroll infinito
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const scrollPosition = scrollTop + clientHeight;
    const triggerPosition = scrollHeight - (25 * 60); // Considerando ~60px por item
    
    if (scrollPosition >= triggerPosition && hasNextPage && !isLoading && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Exibir spinner de carregamento enquanto carrega os dados iniciais
  if (isLoading && !eleitores.length) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Carregando eleitores...</p>
        </div>
      </div>
    );
  }

  // Exibir mensagem quando não há dados
  if (!isLoading && !eleitores.length) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <p className="text-lg font-medium">Nenhum eleitor encontrado</p>
          <p className="text-sm text-muted-foreground">Tente ajustar os filtros de busca</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Cabeçalho da tabela */}
      <div className="grid grid-cols-12 gap-3 px-4 py-3 text-sm font-medium text-muted-foreground">
        <div className="col-span-1"></div> {/* Espaço para chevron */}
        <div className="col-span-1"></div> {/* Espaço para avatar */}
        <div className="col-span-2">Nome Completo</div>
        <div className="col-span-2">CPF</div>
        <div className="col-span-2">Profissão</div>
        <div className="col-span-2">Bairro</div>
        <div className="col-span-1">Nível</div>
        <div className="col-span-1 text-center">Ações</div>
      </div>

      {/* Container das rows com scroll */}
      <div 
        className="flex-1 overflow-y-auto space-y-2"
        onScroll={handleScroll}
        style={{ minHeight: 0 }}
      >
        {eleitores.map((eleitor: Eleitor) => (
          <EleitoresTableRow 
            key={eleitor.id} 
            eleitor={eleitor}
          />
        ))}

        {/* Indicador de carregamento quando estiver carregando mais items */}
        <div className="py-4 text-center">
          {isFetchingNextPage && (
            <span>Carregando mais itens...</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EleitoresTable;
