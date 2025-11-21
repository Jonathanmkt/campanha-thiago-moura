import { useEffect, useState } from 'react';

// Estado global para controlar o carregamento do Google Maps
let isGoogleMapsLoaded = false;
let isGoogleMapsLoading = false;
let googleMapsCallbacks: (() => void)[] = [];

// Chave da API do Google Maps - usar a do .env ou uma hardcoded para debug
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyDmcVPAHjwXyBGi2o8SE4MX8PvdKah68rM';

export function useGoogleMaps() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Debug para verificar se a API está disponível
    // eslint-disable-next-line no-console
    console.log('useGoogleMaps: Verificando disponibilidade da API', { 
      googleExists: typeof window !== 'undefined' && !!window.google,
      mapsExists: typeof window !== 'undefined' && !!window.google?.maps,
      apiKey: API_KEY ? API_KEY.substring(0, 5) + '...' : 'Não definida'
    });

    // Se já está carregado, marcar como loaded
    if (typeof window !== 'undefined' && window.google && window.google.maps) {
      // eslint-disable-next-line no-console
      console.log('useGoogleMaps: API já carregada');
      setIsLoaded(true);
      return;
    }

    // Se já está carregado globalmente, marcar como loaded
    if (isGoogleMapsLoaded) {
      // eslint-disable-next-line no-console
      console.log('useGoogleMaps: API marcada como carregada globalmente');
      setIsLoaded(true);
      return;
    }

    // Adicionar callback para quando carregar
    const callback = () => {
      // eslint-disable-next-line no-console
      console.log('useGoogleMaps: Callback de carregamento executado');
      setIsLoaded(true);
    };
    googleMapsCallbacks.push(callback);

    // Se já está carregando, apenas aguardar
    if (isGoogleMapsLoading) {
      // eslint-disable-next-line no-console
      console.log('useGoogleMaps: API já está carregando, aguardando...');
      return;
    }

    // Iniciar carregamento
    isGoogleMapsLoading = true;

    const loadGoogleMaps = () => {
      // Verificar se já existe um script
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        // eslint-disable-next-line no-console
        console.log('useGoogleMaps: Script já existe no DOM, aguardando carregamento');
        
        // Script já existe, aguardar carregamento
        const checkInterval = setInterval(() => {
          if (window.google && window.google.maps) {
            // eslint-disable-next-line no-console
            console.log('useGoogleMaps: API detectada após aguardar');
            clearInterval(checkInterval);
            isGoogleMapsLoaded = true;
            isGoogleMapsLoading = false;
            // Executar todos os callbacks
            googleMapsCallbacks.forEach(cb => cb());
            googleMapsCallbacks = [];
          }
        }, 100);

        // Timeout de segurança
        setTimeout(() => {
          clearInterval(checkInterval);
          if (!isGoogleMapsLoaded) {
            // eslint-disable-next-line no-console
            console.error('useGoogleMaps: Timeout ao aguardar carregamento');
            isGoogleMapsLoading = false;
            setError('Timeout ao carregar Google Maps');
          }
        }, 10000);
        return;
      }

      // Criar novo script
      // eslint-disable-next-line no-console
      console.log('useGoogleMaps: Criando novo script para a API');
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places,geometry&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      // Definir callback global para o Google Maps
      (window as any).initMap = function() {
        // eslint-disable-next-line no-console
        console.log('useGoogleMaps: Callback initMap executado');
        isGoogleMapsLoaded = true;
        isGoogleMapsLoading = false;
        // Executar todos os callbacks
        googleMapsCallbacks.forEach(cb => cb());
        googleMapsCallbacks = [];
      };
      
      script.onload = () => {
        // eslint-disable-next-line no-console
        console.log('useGoogleMaps: Script carregado (evento onload)');
      };
      
      script.onerror = (e) => {
        // eslint-disable-next-line no-console
        console.error('useGoogleMaps: Erro ao carregar script', e);
        isGoogleMapsLoading = false;
        setError('Erro ao carregar Google Maps');
      };

      document.head.appendChild(script);
    };

    loadGoogleMaps();

    // Cleanup
    return () => {
      const index = googleMapsCallbacks.indexOf(callback);
      if (index > -1) {
        googleMapsCallbacks.splice(index, 1);
      }
    };
  }, []);

  return { isLoaded, error };
}
