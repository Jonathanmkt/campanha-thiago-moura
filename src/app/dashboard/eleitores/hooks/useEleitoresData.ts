import { useState, useEffect, useCallback } from 'react';
import type { Tables } from '@/types';

type Eleitor = Tables<'eleitor'>;

interface UseEleitoresDataReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isFetchingNextPage: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (field: string) => void;
  items: Eleitor[];
  isLoading: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
}

export function useEleitoresData(): UseEleitoresDataReturn {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('nome_completo');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [items, setItems] = useState<Eleitor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const fetchEleitores = useCallback(async (pageNum: number = 1, reset: boolean = false) => {
    if (pageNum === 1) {
      setIsLoading(true);
    } else {
      setIsFetchingNextPage(true);
    }

    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '20',
        sort_by: sortBy,
        sort_order: sortOrder,
      });

      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`/api/supabase/eleitores?${params}`);
      const data = await response.json();

      if (data.success) {
        if (reset || pageNum === 1) {
          setItems(data.data);
        } else {
          setItems(prev => [...prev, ...data.data]);
        }
        
        setHasNextPage(pageNum < data.totalPages);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Erro ao buscar eleitores:', error);
    } finally {
      setIsLoading(false);
      setIsFetchingNextPage(false);
    }
  }, [searchQuery, sortBy, sortOrder]);

  const fetchNextPage = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchEleitores(page + 1, false);
    }
  }, [fetchEleitores, page, isFetchingNextPage, hasNextPage]);

  const onSortChange = useCallback((field: string) => {
    if (field === sortBy) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  }, [sortBy]);

  // Buscar dados quando os filtros mudarem
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchEleitores(1, true);
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [fetchEleitores]);

  return {
    searchQuery,
    setSearchQuery,
    isFetchingNextPage,
    sortBy,
    sortOrder,
    onSortChange,
    items,
    isLoading,
    fetchNextPage,
    hasNextPage,
  };
}
