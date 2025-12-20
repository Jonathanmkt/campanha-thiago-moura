'use client';

import { useState, useEffect } from 'react';
import { Plus, Users, Search, ChevronRight, Phone, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { NovaLiderancaForm } from './components/NovaLiderancaForm';
import type { Tables } from '@/types';

type Lideranca = Tables<'lideranca'>;

export default function CoordenadorPage() {
  const [liderancas, setLiderancas] = useState<Lideranca[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const fetchLiderancas = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/mobile/liderancas');
      const result = await response.json();
      
      if (result.success) {
        setLiderancas(result.data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar lideranças:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiderancas();
  }, []);

  const filteredLiderancas = liderancas.filter(lideranca =>
    lideranca.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lideranca.telefone?.includes(searchTerm) ||
    lideranca.bairro?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLiderancaAdded = () => {
    setIsSheetOpen(false);
    fetchLiderancas();
  };

  const getTipoLiderancaLabel = (tipo: string | null) => {
    const tipos: Record<string, string> = {
      comunitaria: 'Comunitária',
      religiosa: 'Religiosa',
      sindical: 'Sindical',
      empresarial: 'Empresarial',
      politica: 'Política',
      social: 'Social',
      esportiva: 'Esportiva',
      cultural: 'Cultural',
    };
    return tipo ? tipos[tipo] || tipo : 'Não definido';
  };

  const getNivelInfluenciaStars = (nivel: number | null) => {
    const n = nivel || 1;
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < n ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header fixo */}
      <header className="sticky top-0 z-10 bg-blue-600 text-white px-4 py-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            <h1 className="text-lg font-semibold">Minhas Lideranças</h1>
          </div>
          <Badge variant="secondary" className="text-xs bg-blue-500 text-white">
            {liderancas.length} cadastradas
          </Badge>
        </div>
      </header>

      {/* Barra de busca */}
      <div className="sticky top-[52px] z-10 bg-gray-50 px-4 py-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, telefone ou bairro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>
      </div>

      {/* Lista de lideranças */}
      <main className="flex-1 overflow-y-auto px-4 py-3 pb-24">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredLiderancas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              {searchTerm ? 'Nenhuma liderança encontrada' : 'Nenhuma liderança cadastrada ainda'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Toque no botão + para adicionar
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLiderancas.map((lideranca) => (
              <Card key={lideranca.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center p-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-sm truncate">
                          {lideranca.nome_completo}
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {getTipoLiderancaLabel(lideranca.tipo_lideranca)}
                        </Badge>
                        <div className="flex items-center">
                          {getNivelInfluenciaStars(lideranca.nivel_influencia)}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                        {lideranca.telefone && (
                          <a 
                            href={`tel:${lideranca.telefone}`}
                            className="flex items-center gap-1.5 hover:text-primary"
                          >
                            <Phone className="h-3 w-3" />
                            {lideranca.telefone}
                          </a>
                        )}
                        {(lideranca.bairro || lideranca.cidade) && (
                          <span className="flex items-center gap-1.5 truncate">
                            <MapPin className="h-3 w-3" />
                            {[lideranca.bairro, lideranca.cidade].filter(Boolean).join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Botão flutuante para adicionar */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button
            size="icon"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full aspect-square shadow-lg bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[90vh] rounded-t-xl">
          <SheetHeader className="pb-4">
            <SheetTitle>Nova Liderança</SheetTitle>
          </SheetHeader>
          <NovaLiderancaForm onSuccess={handleLiderancaAdded} onCancel={() => setIsSheetOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
