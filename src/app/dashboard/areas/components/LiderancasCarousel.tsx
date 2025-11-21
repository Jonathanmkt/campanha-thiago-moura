import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, UserX } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAreaLiderancas } from '../hooks/useAreaLiderancas';
import { LiderancaDetailsPopover } from './LiderancaDetailsPopover';

interface LiderancasCarouselProps {
  areaId: string;
  onCountChange?: (count: number) => void;
}

export function LiderancasCarousel({ areaId, onCountChange }: LiderancasCarouselProps) {
  // Todos os hooks primeiro, no topo do componente
  const { liderancas, loading } = useAreaLiderancas(areaId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const lastCountRef = useRef<number>(-1);
  
  // Dados da liderança atual - calcular mesmo durante carregamento para evitar erros
  const currentLideranca = !loading && liderancas && liderancas.length > 0 
    ? liderancas[currentIndex] 
    : null;
    
  // Usar useMemo antes de qualquer retorno condicional
  const initials = useMemo(() => {
    if (!currentLideranca) return '';
    return currentLideranca.nome_completo
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }, [currentLideranca]);
  
  const primeiroNome = currentLideranca ? currentLideranca.nome_completo.split(' ')[0] : '';
  
  // Resetar o índice quando mudar de área
  useEffect(() => {
    setCurrentIndex(0);
  }, [areaId]);

  // Resetar erro da imagem quando mudar de liderança
  useEffect(() => {
    setImageError(false);
  }, [currentLideranca]);

  // Notificar o componente pai sobre a quantidade de lideranças
  useEffect(() => {
    if (onCountChange && !loading && lastCountRef.current !== (liderancas?.length || 0)) {
      lastCountRef.current = liderancas?.length || 0;
      onCountChange(liderancas?.length || 0);
    }
  }, [liderancas?.length, loading, onCountChange]);

  // Auto-rotação do carrossel a cada 3 segundos (pausa quando popover está aberto)
  useEffect(() => {
    if (!liderancas || liderancas.length <= 1 || isPopoverOpen) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % liderancas.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [liderancas, isPopoverOpen]);

  // Handlers de navegação
  const goToPrevious = useCallback(() => {
    if (!liderancas || liderancas.length <= 1) return;
    setCurrentIndex((prev) => 
      prev === 0 ? liderancas.length - 1 : prev - 1
    );
  }, [liderancas]);

  const goToNext = useCallback(() => {
    if (!liderancas || liderancas.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % liderancas.length);
  }, [liderancas]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const getTipoAtuacaoBadge = (tipo: string) => {
    const colors = {
      'coordenacao': 'bg-blue-100 text-blue-800',
      'influencia': 'bg-green-100 text-green-800',
      'representacao': 'bg-purple-100 text-purple-800',
      'trabalho': 'bg-orange-100 text-orange-800',
      'moradia': 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge variant="outline" className={`text-xs ${colors[tipo as keyof typeof colors] || colors['coordenacao']}`}>
        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
      </Badge>
    );
  };

  const getNivelInfluenciaBadge = (nivel: number) => {
    const colors = {
      5: 'bg-red-500 text-white',
      4: 'bg-orange-500 text-white',
      3: 'bg-yellow-500 text-white',
      2: 'bg-green-500 text-white',
      1: 'bg-gray-500 text-white'
    };

    return (
      <Badge className={`text-xs ${colors[nivel as keyof typeof colors] || colors[1]}`}>
        Nível {nivel}
      </Badge>
    );
  };

  // Estado de carregamento
  if (loading) {
    return (
      <CarouselContainer>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </CarouselContainer>
    );
  }

  // Estado vazio - mostrar ícone UserX centralizado
  if (!liderancas || liderancas.length === 0) {
    return (
      <CarouselContainer>
        <UserX className="h-8 w-8 text-gray-400" />
      </CarouselContainer>
    );
  }

  return (
    <div className="relative w-24 h-full min-h-[120px] rounded-lg overflow-hidden bg-gray-200">
      {/* Conteúdo principal - foto ou iniciais com Popover */}
      <LiderancaDetailsPopover 
        lideranca={currentLideranca}
        onOpenChange={setIsPopoverOpen}
      >
        <div className="cursor-pointer h-full w-full">
          {currentLideranca?.foto_url && !imageError ? (
            <img
              src={currentLideranca.foto_url}
              alt={currentLideranca.nome_completo}
              className="h-full w-full object-cover hover:opacity-90 transition-opacity"
              onError={() => setImageError(true)}
              onLoad={() => setImageError(false)}
            />
          ) : (
            <div className="h-full w-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
              <div className="text-2xl font-bold text-primary/60">
                {initials}
              </div>
            </div>
          )}
        </div>
      </LiderancaDetailsPopover>

      {/* Overlay com nome - verde escuro 50% transparente */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="bg-emerald-800/50 text-[11px] font-medium text-white truncate py-0.5 px-2 text-center" 
          title={currentLideranca?.nome_popular || currentLideranca?.nome_completo}>
          {currentLideranca?.nome_popular || primeiroNome}
        </div>
      </div>

      {/* Controles de navegação */}
      {liderancas.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-1 top-1/2 z-10 transform -translate-y-1/2 h-6 w-6 p-0 rounded-full bg-white/70 hover:bg-white"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-3 w-3 text-gray-700" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 z-10 transform -translate-y-1/2 h-6 w-6 p-0 rounded-full bg-white/70 hover:bg-white"
            onClick={goToNext}
          >
            <ChevronRight className="h-3 w-3 text-gray-700" />
          </Button>
        </>
      )}
    </div>
  );
}

// Componente auxiliar para manter consistência no container
function CarouselContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-24 h-full min-h-[120px] rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
      {children}
    </div>
  );
}
