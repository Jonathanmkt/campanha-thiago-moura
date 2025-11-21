'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Task {
  id: string
  title: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  type: 'TASK' | 'BUG' | 'EPIC' | 'STORY'
  due_date?: string
  created_at: string
  story_points?: number
  task_assignees?: Array<{
    colaborador: {
      funcao: string
    }
  }>
}

interface Project {
  id: string
  name: string
  created_at: string
  start_date?: string
  end_date?: string
}

interface SimpleGanttChartProps {
  tasks: Task[]
  projects: Project[]
  loading?: boolean
}

export function SimpleGanttChart({ tasks = [], loading = false }: SimpleGanttChartProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date())

  // Converter tarefas reais para formato Gantt
  const ganttTasks = useMemo(() => {
    return tasks.map((task) => ({
      id: task.id,
      title: task.title,
      startDate: task.created_at,
      endDate: task.due_date || format(addDays(new Date(task.created_at), 7), 'yyyy-MM-dd'),
      progress: Math.min((task.story_points || 1) * 20, 100), // Progresso baseado em story points
      priority: task.priority,
      assignee: task.task_assignees?.[0]?.colaborador?.funcao || 'Não atribuído',
      type: task.type === 'EPIC' ? 'MILESTONE' : 'TASK'
    }))
  }, [tasks])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-muted-foreground">Carregando cronograma...</span>
        </div>
      </div>
    )
  }

  // Usar dados reais
  const displayTasks = ganttTasks.length > 0 ? ganttTasks : [
    {
      id: '1',
      title: 'Planejamento da Campanha',
      startDate: '2025-11-20',
      endDate: '2025-11-25',
      progress: 80,
      priority: 'HIGH',
      assignee: 'Thiago Moura',
      type: 'EPIC'
    },
    {
      id: '2',
      title: 'Registro no TSE',
      startDate: '2025-11-21',
      endDate: '2025-11-22',
      progress: 100,
      priority: 'URGENT',
      assignee: 'Carlos Lima',
      type: 'MILESTONE',
      dependencies: ['1']
    },
    {
      id: '3',
      title: 'Desenvolvimento do Site',
      startDate: '2025-11-23',
      endDate: '2025-11-30',
      progress: 45,
      priority: 'HIGH',
      assignee: 'Ana Costa',
      type: 'TASK',
      dependencies: ['1']
    },
    {
      id: '4',
      title: 'Material Gráfico',
      startDate: '2025-11-24',
      endDate: '2025-11-28',
      progress: 20,
      priority: 'MEDIUM',
      assignee: 'Maria Silva',
      type: 'TASK'
    },
    {
      id: '5',
      title: 'Evento de Lançamento',
      startDate: '2025-11-29',
      endDate: '2025-12-01',
      progress: 10,
      priority: 'HIGH',
      assignee: 'João Santos',
      type: 'MILESTONE',
      dependencies: ['3', '4']
    },
    {
      id: '6',
      title: 'Campanha Digital',
      startDate: '2025-11-26',
      endDate: '2025-12-05',
      progress: 30,
      priority: 'HIGH',
      assignee: 'Maria Silva',
      type: 'EPIC'
    }
  ]

  const weekStart = startOfWeek(currentWeek, { locale: ptBR })
  const weekEnd = endOfWeek(currentWeek, { locale: ptBR })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return '#ef4444'
      case 'HIGH': return '#f97316'
      case 'MEDIUM': return '#f59e0b'
      case 'LOW': return '#10b981'
      default: return '#6b7280'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'MILESTONE': return '#8b5cf6'
      case 'EPIC': return '#3b82f6'
      case 'TASK': return '#10b981'
      default: return '#6b7280'
    }
  }

  const calculatePosition = (startDate: string, endDate: string) => {
    const start = parseISO(startDate)
    const end = parseISO(endDate)
    
    const dayWidth = 100 / 7 // 7 dias na semana
    
    let startPos = 0
    let width = 0
    
    weekDays.forEach((day, index) => {
      if (isSameDay(day, start)) {
        startPos = index * dayWidth
      }
      if (start <= day && day <= end) {
        width += dayWidth
      }
    })
    
    return { left: `${startPos}%`, width: `${width}%` }
  }

  const isTaskInWeek = (startDate: string, endDate: string) => {
    const start = parseISO(startDate)
    const end = parseISO(endDate)
    return start <= weekEnd && end >= weekStart
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => addDays(prev, direction === 'next' ? 7 : -7))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium px-3">
            {format(weekStart, 'dd MMM', { locale: ptBR })} - {format(weekEnd, 'dd MMM yyyy', { locale: ptBR })}
          </span>
          <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayTasks.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {displayTasks.filter(t => t.progress > 0 && t.progress < 100).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {displayTasks.filter(t => t.progress === 100).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso Médio</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {displayTasks.length > 0 ? Math.round(displayTasks.reduce((acc, t) => acc + t.progress, 0) / displayTasks.length) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gantt Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Cronograma das Tarefas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Header dos dias */}
            <div className="flex border-b pb-2">
              <div className="w-80 font-medium text-sm">Tarefa</div>
              <div className="flex-1 grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
                {weekDays.map((day) => (
                  <div key={day.toISOString()} className="py-1">
                    <div className="font-medium">
                      {format(day, 'EEE', { locale: ptBR })}
                    </div>
                    <div className="text-xs">
                      {format(day, 'dd', { locale: ptBR })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tarefas */}
            <div className="space-y-3">
              {displayTasks
                .filter(task => isTaskInWeek(task.startDate, task.endDate))
                .map((task) => {
                  const position = calculatePosition(task.startDate, task.endDate)
                  
                  return (
                    <div key={task.id} className="flex items-center">
                      {/* Info da tarefa */}
                      <div className="w-80 pr-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant="outline"
                            className="text-xs"
                            style={{ 
                              borderColor: getTypeColor(task.type),
                              color: getTypeColor(task.type)
                            }}
                          >
                            {task.type}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-xs"
                            style={{ 
                              borderColor: getPriorityColor(task.priority),
                              color: getPriorityColor(task.priority)
                            }}
                          >
                            {task.priority}
                          </Badge>
                        </div>
                        <h4 className="text-sm font-medium line-clamp-1 mb-1">
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{task.assignee}</span>
                          <span>•</span>
                          <span>{task.progress}%</span>
                        </div>
                      </div>

                      {/* Barra do Gantt */}
                      <div className="flex-1 relative h-8 bg-gray-100 rounded">
                        <div
                          className="absolute top-1 h-6 rounded flex items-center px-2"
                          style={{
                            ...position,
                            backgroundColor: `${getTypeColor(task.type)}20`,
                            border: `1px solid ${getTypeColor(task.type)}40`
                          }}
                        >
                          {/* Progresso */}
                          <div
                            className="absolute left-0 top-0 h-full rounded"
                            style={{
                              width: `${task.progress}%`,
                              backgroundColor: getTypeColor(task.type),
                              opacity: 0.7
                            }}
                          />
                          
                          {/* Texto da tarefa */}
                          <span className="relative text-xs font-medium z-10 text-gray-700 truncate">
                            {task.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>

            {/* Legenda */}
            <div className="pt-4 border-t">
              <div className="flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-500"></div>
                  <span>Épico</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-green-500"></div>
                  <span>Tarefa</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-purple-500"></div>
                  <span>Marco</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
