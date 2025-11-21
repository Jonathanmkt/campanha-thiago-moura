'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, MapPin, X } from 'lucide-react';

interface SearchResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}

interface MapSearchProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
}

export function MapSearch({ onLocationSelect }: MapSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounce para busca
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      searchAddresses(query);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchAddresses = async (searchQuery: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Usar Google Geocoding API via nossa API route (apenas Rio de Janeiro)
      const response = await fetch(
        `/api/geocode?address=${encodeURIComponent(searchQuery + ', Rio de Janeiro, RJ, Brasil')}`
      );

      if (!response.ok) {
        throw new Error('Erro na busca de endereços');
      }

      const data = await response.json();
      
      if (data.success && data.results) {
        // Converter resultados do Google para o formato esperado
        const convertedResults: SearchResult[] = data.results.map((result: any, index: number) => ({
          place_id: result.place_id || `result-${index}`,
          display_name: result.formatted_address,
          lat: result.geometry.location.lat.toString(),
          lon: result.geometry.location.lng.toString()
        }));

        setResults(convertedResults);
        setShowResults(convertedResults.length > 0);
      } else {
        setResults([]);
        setShowResults(false);
      }
    } catch (err) {
      setError('Erro ao buscar endereços');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    setQuery(result.display_name);
    setShowResults(false);
    onLocationSelect(lat, lng, result.display_name);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    setError(null);
  };

  return (
    <div ref={searchContainerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Digite um endereço para buscar..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
          🔍 Buscando endereços...
        </div>
      )}

      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {results.map((result) => (
            <button
              key={result.place_id}
              onClick={() => handleResultClick(result)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:bg-gray-50 focus:outline-none"
            >
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {result.display_name}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults && results.length === 0 && !isLoading && query.trim() && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4">
          <div className="text-sm text-gray-500 text-center">
            Nenhum endereço encontrado para "{query}"
          </div>
        </div>
      )}
    </div>
  );
}
