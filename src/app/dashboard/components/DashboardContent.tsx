'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, MapPin, UserCheck, TrendingUp, Calendar, Target, Award, Activity } from 'lucide-react';

interface DashboardStats {
  totalEleitores: number;
  totalLiderancas: number;
  totalAreas: number;
  totalMunicipios: number;
  eleitoresFavoraveis: number;
  eleitoresIndecisos: number;
  liderancasAtivas: number;
  metaMensal: number;
}

export function DashboardContent() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEleitores: 0,
    totalLiderancas: 0,
    totalAreas: 0,
    totalMunicipios: 0,
    eleitoresFavoraveis: 0,
    eleitoresIndecisos: 0,
    liderancasAtivas: 0,
    metaMensal: 150
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        
        // Buscar estatísticas dos eleitores
        const eleitoresResponse = await fetch('/api/supabase/eleitores?limit=1');
        const eleitoresData = await eleitoresResponse.json();
        
        // Buscar estatísticas das lideranças
        const liderancasResponse = await fetch('/api/supabase/liderancas?limit=1');
        const liderancasData = await liderancasResponse.json();
        
        // Buscar estatísticas das áreas
        const areasResponse = await fetch('/api/supabase/areas?limit=1');
        const areasData = await areasResponse.json();

        // Simular dados adicionais (em uma implementação real, viriam de endpoints específicos)
        setStats({
          totalEleitores: eleitoresData.count || 0,
          totalLiderancas: liderancasData.count || 0,
          totalAreas: areasData.count || 0,
          totalMunicipios: 11, // Baseado nos dados que criamos
          eleitoresFavoraveis: Math.round((eleitoresData.count || 0) * 0.35),
          eleitoresIndecisos: Math.round((eleitoresData.count || 0) * 0.25),
          liderancasAtivas: Math.round((liderancasData.count || 0) * 0.85),
          metaMensal: 150
        });
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const progressoMeta = Math.min((stats.totalEleitores / stats.metaMensal) * 100, 100);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-lg text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard - Campanha Thiago Moura</h1>
        <p className="text-muted-foreground">
          Acompanhe o progresso da campanha e as principais métricas em tempo real
        </p>
      </div>

      {/* Cards de Estatísticas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Eleitores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEleitores.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Base eleitoral cadastrada
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lideranças</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLiderancas}</div>
            <p className="text-xs text-muted-foreground">
              {stats.liderancasAtivas} ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Áreas de Atuação</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAreas}</div>
            <p className="text-xs text-muted-foreground">
              Em {stats.totalMunicipios} municípios
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meta Mensal</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progressoMeta.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalEleitores} de {stats.metaMensal} eleitores
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cards de Análise Detalhada */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Intenção de Voto
            </CardTitle>
            <CardDescription>
              Distribuição dos eleitores por intenção de voto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Favoráveis</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{stats.eleitoresFavoraveis}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {((stats.eleitoresFavoraveis / stats.totalEleitores) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Indecisos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{stats.eleitoresIndecisos}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {((stats.eleitoresIndecisos / stats.totalEleitores) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-sm">Outros</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {stats.totalEleitores - stats.eleitoresFavoraveis - stats.eleitoresIndecisos}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {(((stats.totalEleitores - stats.eleitoresFavoraveis - stats.eleitoresIndecisos) / stats.totalEleitores) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Atividade Recente
            </CardTitle>
            <CardDescription>
              Últimas ações na campanha
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Novos eleitores cadastrados</p>
                  <p className="text-xs text-muted-foreground">Há 2 horas</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Liderança ativada</p>
                  <p className="text-xs text-muted-foreground">Há 4 horas</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Nova área mapeada</p>
                  <p className="text-xs text-muted-foreground">Ontem</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Card de Progresso da Meta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Progresso da Meta Mensal
          </CardTitle>
          <CardDescription>
            Acompanhe o progresso em direção à meta de {stats.metaMensal} eleitores cadastrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progresso Atual</span>
              <span className="text-sm text-muted-foreground">
                {stats.totalEleitores} / {stats.metaMensal} eleitores
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressoMeta}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">0</span>
              <span className="font-medium text-primary">{progressoMeta.toFixed(1)}% concluído</span>
              <span className="text-muted-foreground">{stats.metaMensal}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Links Rápidos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Ações Rápidas
          </CardTitle>
          <CardDescription>
            Acesse rapidamente as principais funcionalidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <a 
              href="/dashboard/eleitores" 
              className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">Ver Eleitores</span>
            </a>
            
            <a 
              href="/dashboard/liderancas" 
              className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <UserCheck className="h-4 w-4" />
              <span className="text-sm font-medium">Ver Lideranças</span>
            </a>
            
            <a 
              href="/dashboard/areas" 
              className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium">Mapa de Áreas</span>
            </a>
            
            <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/50 cursor-not-allowed">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Relatórios</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
