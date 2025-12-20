'use client';

import { useState, useEffect } from 'react';
import { Plus, Users, Search, ChevronRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { NovoEleitorForm } from './components/NovoEleitorForm';
import type { Tables } from '@/types';

type Eleitor = Tables<'eleitor'>;

export default function LiderancaPage() {
  const [eleitores, setEleitores] = useState<Eleitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const fetchEleitores = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/mobile/eleitores');
      const result = await response.json();
      
      if (result.success) {
        setEleitores(result.data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar eleitores:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEleitores();
  }, []);

  const filteredEleitores = eleitores.filter(eleitor =>
    eleitor.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eleitor.telefone?.includes(searchTerm)
  );

  const handleEleitorAdded = () => {
    setIsSheetOpen(false);
    fetchEleitores();
  };

  const getIntencaoColor = (intencao: string | null) => {
    switch (intencao) {
      case 'favoravel':
        return 'bg-green-100 text-green-800';
      case 'indeciso':
        return 'bg-yellow-100 text-yellow-800';
      case 'contrario':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header fixo */}
      <header className="sticky top-0 z-10 bg-primary text-primary-foreground px-4 py-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            <h1 className="text-lg font-semibold">Meus Eleitores</h1>
          </div>
          <Badge variant="secondary" className="text-xs">
            {eleitores.length} cadastrados
          </Badge>
        </div>
      </header>

      {/* Barra de busca */}
      <div className="sticky top-[52px] z-10 bg-gray-50 px-4 py-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>
      </div>

      {/* Lista de eleitores */}
      <main className="flex-1 overflow-y-auto px-4 py-3 pb-24">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredEleitores.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              {searchTerm ? 'Nenhum eleitor encontrado' : 'Nenhum eleitor cadastrado ainda'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Toque no botão + para adicionar
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEleitores.map((eleitor) => (
              <Card key={eleitor.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center p-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-sm truncate">
                          {eleitor.nome_completo}
                        </h3>
                        {eleitor.intencao_voto && (
                          <Badge 
                            variant="secondary" 
                            className={`text-xs shrink-0 ${getIntencaoColor(eleitor.intencao_voto)}`}
                          >
                            {eleitor.intencao_voto}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                        {eleitor.telefone && (
                          <a 
                            href={`tel:${eleitor.telefone}`}
                            className="flex items-center gap-1.5 hover:text-primary"
                          >
                            <Phone className="h-3 w-3" />
                            {eleitor.telefone}
                          </a>
                        )}
                        {eleitor.bairro && (
                          <span className="truncate">{eleitor.bairro}</span>
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
            size="lg"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[90vh] rounded-t-xl">
          <SheetHeader className="pb-4">
            <SheetTitle>Novo Eleitor</SheetTitle>
          </SheetHeader>
          <NovoEleitorForm onSuccess={handleEleitorAdded} onCancel={() => setIsSheetOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
