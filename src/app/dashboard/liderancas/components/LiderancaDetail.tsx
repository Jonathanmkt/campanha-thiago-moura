'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Tables } from '@/types';
import { useEleitoresPorLideranca } from '../hooks/useEleitoresPorLideranca';

type Lideranca = Tables<'lideranca'>;

interface LiderancaDetailProps {
  lideranca: Lideranca | null;
}

export const LiderancaDetail: React.FC<LiderancaDetailProps> = ({ lideranca }) => {
  // Hook para buscar eleitores relacionados
  const { data: eleitores = [], isLoading: isLoadingEleitores } = useEleitoresPorLideranca(lideranca?.id);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const formatName = (name: string) => {
    const words = name.split(' ');
    if (words.length <= 2) return name;
    return `${words[0]} ${words[words.length - 1]}`;
  };

  const getTipoLiderancaBadge = (tipo: string) => {
    const colors: Record<string, string> = {
      'comunitaria': 'bg-blue-100 text-blue-800',
      'religiosa': 'bg-purple-100 text-purple-800',
      'sindical': 'bg-red-100 text-red-800',
      'empresarial': 'bg-green-100 text-green-800',
      'politica': 'bg-yellow-100 text-yellow-800',
      'social': 'bg-pink-100 text-pink-800',
      'esportiva': 'bg-orange-100 text-orange-800',
      'cultural': 'bg-indigo-100 text-indigo-800'
    };
    
    return (
      <Badge className={colors[tipo] || 'bg-gray-100 text-gray-800'}>
        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
      </Badge>
    );
  };

  const getNivelInfluenciaBadge = (nivel: number | null) => {
    if (nivel === null) return <Badge variant="secondary">N/A</Badge>;
    
    if (nivel >= 4) {
      return <Badge variant="default" className="bg-green-500">Alto ({nivel})</Badge>;
    } else if (nivel >= 2) {
      return <Badge variant="secondary">Médio ({nivel})</Badge>;
    } else {
      return <Badge variant="destructive">Baixo ({nivel})</Badge>;
    }
  };

  const getTipoRelacaoBadge = (tipo: string) => {
    const colors: Record<string, string> = {
      'influencia': 'bg-purple-100 text-purple-800',
      'familia': 'bg-pink-100 text-pink-800',
      'trabalho': 'bg-blue-100 text-blue-800',
      'vizinhanca': 'bg-green-100 text-green-800',
      'amizade': 'bg-yellow-100 text-yellow-800',
      'religioso': 'bg-indigo-100 text-indigo-800',
      'politico': 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge variant="outline" className={`text-xs ${colors[tipo] || 'bg-gray-100 text-gray-800'}`}>
        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
      </Badge>
    );
  };

  const calcularDiasSemContato = (dataUltimoContato: string | null) => {
    if (!dataUltimoContato) return null;
    
    const hoje = new Date();
    const ultimoContato = new Date(dataUltimoContato);
    const diffTime = Math.abs(hoje.getTime() - ultimoContato.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const getBadgeTempoSemContato = (dias: number | null) => {
    if (dias === null) return null;
    
    if (dias <= 3) {
      return (
        <Badge variant="default" className="bg-green-500 text-white">
          {dias} dia{dias !== 1 ? 's' : ''}
        </Badge>
      );
    } else if (dias <= 7) {
      return (
        <Badge variant="secondary" className="bg-yellow-500 text-white">
          {dias} dias
        </Badge>
      );
    } else if (dias <= 15) {
      return (
        <Badge variant="secondary" className="bg-orange-500 text-white">
          {dias} dias
        </Badge>
      );
    } else {
      return (
        <Badge variant="destructive">
          {dias} dias
        </Badge>
      );
    }
  };

  if (!lideranca) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Selecione uma liderança para ver os detalhes
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-4 min-h-0">
      {/* Quadrante Superior: Informações da Liderança */}
      <div className="border rounded-lg p-6 bg-white h-1/2">
        <div className="flex items-start space-x-6 mb-6">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 -m-1"></div>
            <Avatar className="h-32 w-32 ring-4 ring-primary/20 ring-offset-2 ring-offset-white">
              <AvatarImage src={lideranca.foto_url || undefined} alt={lideranca.nome_completo} />
              <AvatarFallback className="text-2xl">
                {getInitials(lideranca.nome_completo)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-2xl font-medium mb-3">{lideranca.nome_completo}</h4>
            {lideranca.nome_popular && (
              <p className="text-lg text-gray-600 mb-2">&ldquo;{lideranca.nome_popular}&rdquo;</p>
            )}
            <div className="flex gap-2 mb-3 flex-wrap">
              {getTipoLiderancaBadge(lideranca.tipo_lideranca)}
              {getNivelInfluenciaBadge(lideranca.nivel_influencia)}
              {getBadgeTempoSemContato(calcularDiasSemContato(lideranca.data_ultimo_contato))}
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <p><span className="font-medium">Profissão:</span> {lideranca.profissao || 'N/A'}</p>
              <p><span className="font-medium">Alcance:</span> {lideranca.alcance_estimado || 0} pessoas</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{eleitores.length}</div>
              <div className="text-sm text-muted-foreground">Eleitores</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{lideranca.nivel_influencia || 0}</div>
              <div className="text-sm text-muted-foreground">Nível Influência</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{lideranca.alcance_estimado || 0}</div>
              <div className="text-sm text-muted-foreground">Alcance Estimado</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quadrantes Inferiores */}
      <div className="flex gap-4 h-1/2">
        {/* Quadrante Inferior Esquerdo: Informações Detalhadas */}
        <div className="w-1/2 border rounded-lg p-4 bg-white overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Informações Detalhadas</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Contato
              </h4>
              <div className="space-y-2">
                {lideranca.telefone && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Telefone:</span>
                    <p className="text-sm">{lideranca.telefone}</p>
                  </div>
                )}
                {lideranca.email && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Email:</span>
                    <p className="text-sm">{lideranca.email}</p>
                  </div>
                )}
              </div>
            </div>

            {lideranca.endereco && (
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Endereço
                </h4>
                <p className="text-sm">
                  {lideranca.endereco}
                  {lideranca.cep && ` - CEP: ${lideranca.cep}`}
                </p>
              </div>
            )}

            {lideranca.observacoes && (
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Observações
                </h4>
                <p className="text-sm text-gray-700">{lideranca.observacoes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Quadrante Inferior Direito: Lista de Eleitores */}
        <div className="w-1/2 border rounded-lg p-4 flex flex-col bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Eleitores de {formatName(lideranca.nome_completo)}
            </h3>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {eleitores.length}
            </Badge>
          </div>
          <div className="flex-1 overflow-auto">
            {isLoadingEleitores ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4 p-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : eleitores.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-8">
                <Users className="h-12 w-12 mb-4 opacity-50" />
                <p>Nenhum eleitor encontrado</p>
                <p className="text-sm text-muted-foreground/70">Esta liderança ainda não possui eleitores relacionados</p>
              </div>
            ) : (
              <div className="space-y-2">
                {eleitores.map((eleitor, index) => (
                  <div key={eleitor.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                    <div className="flex-shrink-0 w-6 text-center">
                      <span className="text-xs font-medium text-muted-foreground">{index + 1}</span>
                    </div>
                    <Avatar className="h-10 w-10 ring-1 ring-primary/30 ring-offset-1">
                      <AvatarImage 
                        src={eleitor.foto_url || undefined} 
                        alt={eleitor.nome_completo}
                      />
                      <AvatarFallback>
                        {getInitials(eleitor.nome_completo)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{formatName(eleitor.nome_completo)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getTipoRelacaoBadge(eleitor.tipo_relacao)}
                        <span className="text-xs text-muted-foreground">
                          Proximidade: {eleitor.nivel_proximidade}/5
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{eleitor.profissao || 'Profissão não informada'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
