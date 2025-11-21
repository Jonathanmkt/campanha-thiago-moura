import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Pesquisa } from '../hooks/usePesquisas';

interface PesquisaChartProps {
  pesquisas: Pesquisa[];
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      dataCompleta: string;
      percentual: number;
      origem: string;
      instituto: string;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-popover border border-border rounded-lg shadow-lg p-3 space-y-2">
        <p className="font-semibold text-sm text-foreground">{data.dataCompleta}</p>
        <div className="space-y-1 text-xs">
          <p className="text-foreground">
            <span className="font-medium">Percentual:</span> {data.percentual.toFixed(1)}%
          </p>
          <p className="text-muted-foreground">
            <span className="font-medium">Origem:</span> {data.origem}
          </p>
          <p className="text-muted-foreground">
            <span className="font-medium">Instituto:</span> {data.instituto}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export const PesquisaChart = ({ pesquisas }: PesquisaChartProps) => {
  const chartData = pesquisas.map((p) => ({
    data: format(new Date(p.data_pesquisa), "dd/MM/yyyy"),
    dataCompleta: format(new Date(p.data_pesquisa), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
    percentual: Number(p.percentual),
    origem: p.metodo_coleta || "Não informado",
    instituto: p.fonte || "Não informado",
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <defs>
          <linearGradient id="fillPercentual" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="data" 
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          stroke="hsl(var(--border))"
        />
        <YAxis 
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          stroke="hsl(var(--border))"
          domain={['dataMin - 2', 'dataMax + 2']}
          tickFormatter={(value: number) => `${value}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area 
          type="linear" 
          dataKey="percentual" 
          stroke="#3b82f6" 
          strokeWidth={3}
          fill="url(#fillPercentual)"
          dot={{ fill: "#3b82f6", r: 4, strokeWidth: 2, stroke: "hsl(var(--background))" }}
          activeDot={{ r: 6, fill: "#3b82f6", strokeWidth: 2, stroke: "hsl(var(--background))" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
