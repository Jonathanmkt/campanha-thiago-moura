'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target,
  AlertTriangle,
  Download,
  Filter
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from 'recharts'

interface Analytics {
  overview: {
    total_projects: number
    active_projects: number
    total_tasks: number
    completed_tasks: number
    total_colaboradores: number
    completion_rate: number
  }
  projects_by_status: Record<string, number>
  tasks_by_priority: Record<string, number>
  tasks_by_type: Record<string, number>
}

interface ProjectAnalyticsProps {
  analytics: Analytics
  loading?: boolean
}

export function ProjectAnalytics({ analytics, loading = false }: ProjectAnalyticsProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-muted-foreground">Carregando analytics...</span>
        </div>
      </div>
    )
  }

  // Usar dados reais ou fallback
  const projectStats = {
    totalTasks: analytics?.overview?.total_tasks || 0,
    completedTasks: analytics?.overview?.completed_tasks || 0,
    inProgressTasks: (analytics?.overview?.total_tasks || 0) - (analytics?.overview?.completed_tasks || 0),
    overdueTasks: 0, // Calculado separadamente se necessário
    totalProjects: analytics?.overview?.total_projects || 0,
    activeProjects: analytics?.overview?.active_projects || 0,
    teamMembers: analytics?.overview?.total_colaboradores || 0,
    avgCompletionTime: 3.2 // dias - pode ser calculado dos dados reais
  }

  const tasksByPriority = [
    { name: 'Baixa', value: 8, color: '#10b981' },
    { name: 'Média', value: 15, color: '#f59e0b' },
    { name: 'Alta', value: 12, color: '#f97316' },
    { name: 'Urgente', value: 7, color: '#ef4444' }
  ]

  const tasksByType = [
    { name: 'Tarefa', value: 25, color: '#3b82f6' },
    { name: 'Bug', value: 5, color: '#ef4444' },
    { name: 'Épico', value: 8, color: '#8b5cf6' },
    { name: 'História', value: 4, color: '#10b981' }
  ]

  const weeklyProgress = [
    { week: 'Sem 1', planned: 12, completed: 10 },
    { week: 'Sem 2', planned: 15, completed: 14 },
    { week: 'Sem 3', planned: 18, completed: 16 },
    { week: 'Sem 4', planned: 20, completed: 18 },
    { week: 'Sem 5', planned: 16, completed: 15 }
  ]

  const teamPerformance = [
    { name: 'Thiago Moura', completed: 8, assigned: 10, efficiency: 80 },
    { name: 'Maria Silva', completed: 9, assigned: 12, efficiency: 75 },
    { name: 'João Santos', completed: 7, assigned: 10, efficiency: 70 },
    { name: 'Ana Costa', completed: 4, assigned: 6, efficiency: 67 },
    { name: 'Carlos Lima', completed: 3, assigned: 4, efficiency: 75 }
  ]

  const burndownData = [
    { day: 'Dia 1', remaining: 42, ideal: 42 },
    { day: 'Dia 2', remaining: 38, ideal: 38 },
    { day: 'Dia 3', remaining: 35, ideal: 34 },
    { day: 'Dia 4', remaining: 32, ideal: 30 },
    { day: 'Dia 5', remaining: 28, ideal: 26 },
    { day: 'Dia 6', remaining: 25, ideal: 22 },
    { day: 'Dia 7', remaining: 20, ideal: 18 },
    { day: 'Dia 8', remaining: 16, ideal: 14 },
    { day: 'Dia 9', remaining: 12, ideal: 10 },
    { day: 'Dia 10', remaining: 8, ideal: 6 }
  ]

  const completionRate = Math.round((projectStats.completedTasks / projectStats.totalTasks) * 100)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-end">
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {projectStats.completedTasks} de {projectStats.totalTasks} tarefas
            </p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectStats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              de {projectStats.totalProjects} projetos totais
            </p>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-green-600">+1 este mês</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectStats.avgCompletionTime}d</div>
            <p className="text-xs text-muted-foreground">
              para conclusão de tarefas
            </p>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-green-600">-0.5d vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Atrasadas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{projectStats.overdueTasks}</div>
            <p className="text-xs text-muted-foreground">
              requerem atenção imediata
            </p>
            {projectStats.overdueTasks > 0 && (
              <Badge variant="destructive" className="mt-2 text-xs">
                Ação necessária
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Burndown Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Gráfico Burndown</CardTitle>
            <p className="text-sm text-muted-foreground">
              Progresso vs planejamento ideal
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={burndownData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="ideal" 
                  stackId="1"
                  stroke="#10b981" 
                  fill="#10b98120"
                  name="Ideal"
                />
                <Area 
                  type="monotone" 
                  dataKey="remaining" 
                  stackId="2"
                  stroke="#3b82f6" 
                  fill="#3b82f620"
                  name="Real"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Progresso Semanal</CardTitle>
            <p className="text-sm text-muted-foreground">
              Tarefas planejadas vs concluídas
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="planned" fill="#e5e7eb" name="Planejadas" />
                <Bar dataKey="completed" fill="#3b82f6" name="Concluídas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tasks by Priority */}
        <Card>
          <CardHeader>
            <CardTitle>Tarefas por Prioridade</CardTitle>
            <p className="text-sm text-muted-foreground">
              Distribuição das tarefas por nível de prioridade
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tasksByPriority}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {tasksByPriority.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {tasksByPriority.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tasks by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Tarefas por Tipo</CardTitle>
            <p className="text-sm text-muted-foreground">
              Distribuição das tarefas por categoria
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tasksByType}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {tasksByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {tasksByType.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Performance da Equipe</CardTitle>
          <p className="text-sm text-muted-foreground">
            Produtividade e eficiência dos membros da equipe
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamPerformance.map((member, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {member.completed}/{member.assigned} tarefas concluídas
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{member.efficiency}%</p>
                    <p className="text-xs text-muted-foreground">Eficiência</p>
                  </div>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        member.efficiency >= 80 ? 'bg-green-500' :
                        member.efficiency >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${member.efficiency}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Insights */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🎯 Meta do Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              Concluir 35 tarefas até o final do mês
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${(28/35)*100}%` }}
                />
              </div>
              <span className="text-sm font-medium">28/35</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">⚡ Velocidade</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">7.2</p>
            <p className="text-sm text-muted-foreground">
              tarefas por semana (média)
            </p>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-green-600">+15% vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🏆 Próximo Marco</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">Evento de Lançamento</p>
            <p className="text-sm text-muted-foreground mb-2">
              Em 10 dias
            </p>
            <Badge variant="outline" className="text-xs">
              85% concluído
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
