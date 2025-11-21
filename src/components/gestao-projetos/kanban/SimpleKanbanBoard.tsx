'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { 
  Plus, 
  Calendar, 
  MessageCircle, 
  Flag,
  MoreHorizontal
} from 'lucide-react'

// Tipos para tarefas reais do Supabase
interface Task {
  id: string
  title: string
  description?: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  type: 'TASK' | 'BUG' | 'EPIC' | 'STORY'
  due_date?: string
  task_assignees?: Array<{
    colaborador: {
      id: string
      funcao: string
    }
  }>
  task_comments?: Array<{ id: string }>
  status_id: string
}

interface TaskStatus {
  id: string
  name: string
  category: 'TODO' | 'IN_PROGRESS' | 'DONE'
  color?: string
}


interface SimpleKanbanBoardProps {
  tasks: Task[]
  loading?: boolean
  onTaskUpdate?: (taskId: string, data: any) => Promise<void>
  onTaskEdit?: (task: Task) => void
}

export function SimpleKanbanBoard({ tasks = [], loading = false, onTaskUpdate, onTaskEdit }: SimpleKanbanBoardProps) {
  // Organizar tarefas por status usando dados reais
  const columns = useMemo(() => {
    const statusColumns = [
      {
        id: 'todo',
        name: 'A Fazer',
        color: '#6b7280',
        statusIds: ['44444444-4444-4444-a444-444444444444'] // A Fazer
      },
      {
        id: 'in-progress', 
        name: 'Em Progresso',
        color: '#3b82f6',
        statusIds: ['55555555-5555-4555-a555-555555555555'] // Em Progresso
      },
      {
        id: 'review',
        name: 'Em Revisão', 
        color: '#f59e0b',
        statusIds: ['66666666-6666-4666-a666-666666666666'] // Em Revisão
      },
      {
        id: 'done',
        name: 'Concluído',
        color: '#10b981', 
        statusIds: ['77777777-7777-4777-a777-777777777777'] // Concluído
      }
    ]

    return statusColumns.map(column => ({
      ...column,
      tasks: tasks.filter(task => column.statusIds.includes(task.status_id))
    }))
  }, [tasks])

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
      case 'BUG': return '#ef4444'
      case 'EPIC': return '#8b5cf6'
      case 'STORY': return '#10b981'
      case 'TASK': return '#3b82f6'
      default: return '#6b7280'
    }
  }

  const TaskCard = ({ task }: { task: Task }) => (
    <Card className="mb-3 hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium leading-tight line-clamp-2 mb-1">
              {task.title}
            </h4>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Badge 
                variant="outline" 
                className="h-4 px-1 text-[10px]"
                style={{ 
                  borderColor: getTypeColor(task.type),
                  color: getTypeColor(task.type)
                }}
              >
                {task.type}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Flag 
              className="h-3 w-3" 
              style={{ color: getPriorityColor(task.priority) }} 
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0"
              onClick={() => onTaskEdit?.(task)}
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}

        {task.due_date && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{new Date(task.due_date).toLocaleDateString('pt-BR')}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
          <div className="flex items-center">
            {task.task_assignees && task.task_assignees.length > 0 ? (
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-[10px]">
                  {task.task_assignees[0].colaborador.funcao.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-[10px] text-gray-400">?</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {task.task_comments && task.task_comments.length > 0 && (
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                <span>{task.task_comments.length}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-muted-foreground">Carregando tarefas...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-end mb-6">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Tarefa
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-6 pb-6 min-w-max">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col w-80 min-w-80">
              {/* Header da Coluna */}
              <Card className="mb-3">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: column.color }}
                      />
                      <CardTitle className="text-sm font-medium">
                        {column.name}
                      </CardTitle>
                      <Badge variant="secondary" className="h-5 px-2 text-xs">
                        {column.tasks.length}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0"
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Tarefas */}
              <div className="flex-1 min-h-[200px] p-2 rounded-lg bg-gray-50/50">
                {column.tasks.length > 0 ? (
                  column.tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                      <Plus className="h-5 w-5 text-gray-400" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Nenhuma tarefa
                    </p>
                    <Button variant="outline" size="sm" className="text-xs">
                      <Plus className="h-3 w-3 mr-1" />
                      Adicionar tarefa
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
