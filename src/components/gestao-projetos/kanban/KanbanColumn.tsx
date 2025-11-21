'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, MoreHorizontal } from 'lucide-react'
import { KanbanCard } from './KanbanCard'
import { KanbanColumn as KanbanColumnType } from '@/types/gestao-projetos'

interface KanbanColumnProps {
  column: KanbanColumnType
  onAddTask?: () => void
}

export function KanbanColumn({ column, onAddTask }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  })

  const taskIds = column.tasks.map(task => task.id)

  return (
    <div className="flex flex-col w-80 min-w-80">
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
                {column.tasks_count}
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={onAddTask}
              >
                <Plus className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Drop Zone para as tarefas */}
      <div
        ref={setNodeRef}
        className={`
          flex-1 min-h-[200px] p-2 rounded-lg transition-colors
          ${isOver ? 'bg-blue-50 border-2 border-blue-200 border-dashed' : 'bg-gray-50/50'}
        `}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {column.tasks.map((task) => (
              <KanbanCard key={task.id} task={task} />
            ))}
            
            {/* Placeholder quando não há tarefas */}
            {column.tasks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <Plus className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Nenhuma tarefa
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onAddTask}
                  className="text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Adicionar tarefa
                </Button>
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  )
}
