'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, MapPin, X, Loader2 } from 'lucide-react';

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

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface SearchResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  address_components?: AddressComponent[];
}

interface AddressSearchProps {
  onAddressSelect: (address: AddressData) => void;
  placeholder?: string;
}

export function AddressSearch({ onAddressSelect, placeholder = "Digite o endereço da liderança..." }: AddressSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounce para busca
  useEffect(() => {
    if (!query.trim() || selectedAddress === query) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      searchAddresses(query);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, selectedAddress]);

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const convertedResults: SearchResult[] = data.results.map((result: any, index: number) => ({
          place_id: result.place_id || `result-${index}`,
          display_name: result.formatted_address,
          lat: result.geometry.location.lat.toString(),
          lon: result.geometry.location.lng.toString(),
          address_components: result.address_components
        }));

        setResults(convertedResults);
        setShowResults(convertedResults.length > 0);
      } else {
        setResults([]);
        setShowResults(false);
      }
    } catch (err) {
      setError('Erro ao buscar endereços. Tente novamente.');
      console.error('Erro na busca de endereços:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const extractAddressComponent = (
    components: AddressComponent[] | undefined,
    type: string
  ): string => {
    if (!components) return '';
    const component = components.find(c => c.types.includes(type));
    return component?.long_name || '';
  };

  const extractAddressComponentShort = (
    components: AddressComponent[] | undefined,
    type: string
  ): string => {
    if (!components) return '';
    const component = components.find(c => c.types.includes(type));
    return component?.short_name || '';
  };

  const handleResultClick = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    // Extrair componentes do endereço
    const addressData: AddressData = {
      endereco_formatado: result.display_name,
      logradouro: extractAddressComponent(result.address_components, 'route'),
      numero: extractAddressComponent(result.address_components, 'street_number'),
      complemento: '',
      bairro: extractAddressComponent(result.address_components, 'sublocality_level_1') || 
              extractAddressComponent(result.address_components, 'neighborhood'),
      cidade: extractAddressComponent(result.address_components, 'administrative_area_level_2') ||
              extractAddressComponent(result.address_components, 'locality'),
      estado: extractAddressComponentShort(result.address_components, 'administrative_area_level_1'),
      cep: extractAddressComponent(result.address_components, 'postal_code'),
      latitude: lat,
      longitude: lng,
    };
    
    setQuery(result.display_name);
    setSelectedAddress(result.display_name);
    setShowResults(false);
    onAddressSelect(addressData);
  };

  const clearSearch = () => {
    setQuery('');
    setSelectedAddress(null);
    setResults([]);
    setShowResults(false);
    setError(null);
  };

  return (
    <div ref={searchContainerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (selectedAddress) setSelectedAddress(null);
          }}
          className="pl-10 pr-10 h-12"
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Buscando endereços...
        </div>
      )}

      {selectedAddress && (
        <div className="mt-2 text-sm text-green-700 bg-green-50 p-3 rounded-lg flex items-center gap-2">
          <MapPin className="h-4 w-4 text-green-600" />
          Endereço selecionado
        </div>
      )}

      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map((result) => (
            <button
              key={result.place_id}
              type="button"
              onClick={() => handleResultClick(result)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:bg-gray-50 focus:outline-none"
            >
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-900">
                    {result.display_name}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults && results.length === 0 && !isLoading && query.trim() && !selectedAddress && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <div className="text-sm text-gray-500 text-center">
            Nenhum endereço encontrado para &ldquo;{query}&rdquo;
          </div>
        </div>
      )}
    </div>
  );
}
