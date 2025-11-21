import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { usePesquisas } from '../hooks/usePesquisas';
import { PesquisaChart } from './PesquisaChart';

interface PesquisaBadgeProps {
  areaId: string;
}

export const PesquisaBadge = ({ areaId }: PesquisaBadgeProps) => {
  const { data: pesquisas = [], isLoading } = usePesquisas(areaId);
  
  const hasPesquisas = pesquisas.length > 0;
  
  const getTrend = () => {
    if (pesquisas.length < 2) return null;
    
    const ultima = pesquisas[pesquisas.length - 1];
    const penultima = pesquisas[pesquisas.length - 2];
    
    const diferenca = ultima.percentual - penultima.percentual;
    
    return {
      crescimento: diferenca > 0,
      valor: Math.abs(diferenca),
    };
  };

  const trend = getTrend();
  
  return (
    <Popover>
      <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Badge 
          variant="outline" 
          className={`h-8 flex items-center gap-1 py-1 px-2 cursor-pointer transition-colors ${
            hasPesquisas 
              ? 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200' 
              : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border-gray-200'
          }`}
        >
          <BarChart3 className="h-3.5 w-3.5" />
          <span className="font-medium text-xs">
            {isLoading ? 'Carregando...' : hasPesquisas ? 'Pesquisas' : 'Sem pesquisas'}
          </span>
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="w-[500px]" align="start" side="left" sideOffset={10}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Série Histórica de Pesquisas</h4>
            {trend && (
              <div className={`flex items-center gap-1 text-xs font-medium ${
                trend.crescimento ? "text-green-600" : "text-red-600"
              }`}>
                {trend.crescimento ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {trend.valor.toFixed(1)}%
              </div>
            )}
          </div>
          
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Carregando pesquisas...
            </div>
          ) : pesquisas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Nenhuma pesquisa registrada
            </div>
          ) : (
            <PesquisaChart pesquisas={pesquisas} />
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
