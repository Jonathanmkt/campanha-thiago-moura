'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { 
  Clock, 
  MessageCircle, 
  Paperclip, 
  Eye,
  MoreHorizontal,
  Calendar,
  Flag
} from 'lucide-react'
import { TaskWithDetails, TASK_PRIORITY_COLORS, TASK_TYPE_COLORS } from '@/types/gestao-projetos'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface KanbanCardProps {
  task: TaskWithDetails
}

export function KanbanCard({ task }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: sortableIsDragging,
  } = useSortable({
    id: task.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: sortableIsDragging ? 0.5 : 1,
  }

  const getPriorityIcon = (priority: string) => {
    const color = TASK_PRIORITY_COLORS[priority as keyof typeof TASK_PRIORITY_COLORS] || '#6b7280'
    return <Flag className="h-3 w-3" style={{ color }} />
  }

  const getTypeColor = (type: string) => {
    return TASK_TYPE_COLORS[type as keyof typeof TASK_TYPE_COLORS] || '#3b82f6'
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM', { locale: ptBR })
  }

  const isOverdue = task.due_date && new Date(task.due_date) < new Date()

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        cursor-grab active:cursor-grabbing
        hover:shadow-md transition-all duration-200
        ${sortableIsDragging ? 'shadow-lg scale-105' : ''}
        ${isOverdue ? 'border-red-200 bg-red-50/50' : ''}
      `}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium leading-tight line-clamp-2 mb-1">
              {task.title}
            </h4>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>#{task.task_number}</span>
              <span>•</span>
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
            {getPriorityIcon(task.priority)}
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {/* Descrição (se houver) */}
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Labels */}
        {task.labels && task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.labels.slice(0, 3).map((taskLabel) => (
              <Badge
                key={taskLabel.label.id}
                variant="secondary"
                className="h-4 px-1 text-[10px]"
                style={{ 
                  backgroundColor: `${taskLabel.label.color}20`,
                  color: taskLabel.label.color,
                  borderColor: `${taskLabel.label.color}40`
                }}
              >
                {taskLabel.label.name}
              </Badge>
            ))}
            {task.labels.length > 3 && (
              <Badge variant="outline" className="h-4 px-1 text-[10px]">
                +{task.labels.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Data de vencimento */}
        {task.due_date && (
          <div className={`flex items-center gap-1 text-xs ${
            isOverdue ? 'text-red-600' : 'text-muted-foreground'
          }`}>
            <Calendar className="h-3 w-3" />
            <span>{formatDate(task.due_date)}</span>
            {isOverdue && <span className="text-red-600 font-medium">• Atrasada</span>}
          </div>
        )}

        {/* Story Points (se houver) */}
        {task.story_points && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-[10px] font-medium text-blue-600">
                {task.story_points}
              </span>
            </div>
            <span>pontos</span>
          </div>
        )}

        {/* Rodapé com estatísticas */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
          {/* Assignees */}
          <div className="flex items-center">
            {task.assignees && task.assignees.length > 0 ? (
              <div className="flex -space-x-1">
                {task.assignees.slice(0, 2).map((assignee) => (
                  <Avatar key={assignee.user.id} className="h-5 w-5 border border-white">
                    <AvatarImage src={assignee.user.avatar_url} />
                    <AvatarFallback className="text-[10px]">
                      {assignee.user.full_name?.charAt(0) || assignee.user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {task.assignees.length > 2 && (
                  <div className="h-5 w-5 rounded-full bg-gray-200 border border-white flex items-center justify-center">
                    <span className="text-[8px] font-medium text-gray-600">
                      +{task.assignees.length - 2}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-[10px] text-gray-400">?</span>
              </div>
            )}
          </div>

          {/* Ícones de atividade */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {task.comments_count && task.comments_count > 0 && (
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                <span>{task.comments_count}</span>
              </div>
            )}
            
            {task.attachments_count && task.attachments_count > 0 && (
              <div className="flex items-center gap-1">
                <Paperclip className="h-3 w-3" />
                <span>{task.attachments_count}</span>
              </div>
            )}
            
            {task.watchers_count && task.watchers_count > 0 && (
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{task.watchers_count}</span>
              </div>
            )}

            {task.time_entries && task.time_entries.length > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>
                  {Math.round(
                    task.time_entries.reduce((acc, entry) => acc + entry.time_spent, 0) / 60
                  )}h
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
