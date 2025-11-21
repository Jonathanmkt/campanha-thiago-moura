import { useCallback, useState } from 'react';
import { EleitoresActionsHeader } from './EleitoresActionsHeader';
import { useEleitoresData } from '../hooks/useEleitoresData';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import EleitoresTable from './EleitoresTable';
import { EleitoresProvider } from '../store';
import { NovoEleitorModal } from '../modals/NovoEleitorModal';

export function EleitoresContent() {
  const [isNovoEleitorOpen, setNovoEleitorOpen] = useState(false);
  
  const {
    searchQuery,
    setSearchQuery,
    isFetchingNextPage,
    sortBy,
    sortOrder,
    onSortChange,
    items,
    isLoading,
    fetchNextPage,
    hasNextPage
  } = useEleitoresData();

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, [setSearchQuery]);
  
  const handleOpenNovoEleitorModal = useCallback(() => {
    setNovoEleitorOpen(true);
  }, []);

  return (
    <EleitoresProvider>
      <div className='h-full flex flex-col overflow-hidden'>
        <div className='h-full flex flex-col bg-gray-200 rounded-lg shadow flex-1' style={{ minHeight: 0 }}>
          {/* Header com filtros e contador - fixo no topo */}
          <div className='shrink-0 p-6 pb-0'>
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-8'>
                <EleitoresActionsHeader 
                  searchQuery={searchQuery}
                  onSearchChange={handleSearchChange}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSortChange={onSortChange}
                />
              </div>
              <div className='col-span-4 flex justify-end'>
                <Button 
                  onClick={handleOpenNovoEleitorModal}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-md hover:shadow-primary/30 transition-all duration-300 flex items-center gap-2 w-full md:w-auto justify-center"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Novo Eleitor</span>
                  <span className="sm:hidden">Novo</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Cabeçalho da tabela - fixo abaixo dos filtros */}
          <div className='px-6 pt-3 pb-0'>
            {/* Cabeçalho da tabela será adicionado aqui */}
          </div>

          {/* Tabela com scroll infinito */}
          <div className="flex-1 px-6 pt-0 overflow-hidden">
            <EleitoresTable 
              eleitores={items}
              isLoading={isLoading}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
            />
          </div>

          {/* Rodapé - deve ter shrink-0 para não ser comprimido */}
          <div className='shrink-0 pt-4 border-t border-gray-200 mt-4'>
            <div className='flex justify-end items-center text-sm text-gray-500 px-6 pb-4'>
              {isFetchingNextPage && (
                <span>Carregando mais itens...</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <NovoEleitorModal 
        isOpen={isNovoEleitorOpen} 
        onClose={() => setNovoEleitorOpen(false)} 
      />
    </EleitoresProvider>
  );
}
