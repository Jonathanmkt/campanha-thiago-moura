'use client'

import { useState, useCallback } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { KanbanColumn } from './KanbanColumn'
import { KanbanCard } from './KanbanCard'
import { KanbanBoard as KanbanBoardType, TaskWithDetails } from '@/types/gestao-projetos'

interface KanbanBoardProps {
  board: KanbanBoardType
  onTaskMove?: (taskId: string, fromColumnId: string, toColumnId: string, newIndex: number) => void
  onAddTask?: (columnId: string) => void
}

export function KanbanBoard({ board, onTaskMove, onAddTask }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<TaskWithDetails | null>(null)
  const [columns, setColumns] = useState(board.columns)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event
    const taskId = active.id as string
    
    // Encontrar a tarefa ativa
    const task = columns
      .flatMap(column => column.tasks)
      .find(task => (task as any).id === taskId)
    
    setActiveTask(task || null)
  }, [columns])

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event
    
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Se estamos arrastando sobre a mesma posição, não fazer nada
    if (activeId === overId) return

    // Encontrar as colunas de origem e destino
    const activeColumn = columns.find(col => 
      col.tasks.some(task => task.id === activeId)
    )
    const overColumn = columns.find(col => 
      col.id === overId || col.tasks.some(task => task.id === overId)
    )

    if (!activeColumn || !overColumn) return

    // Se estamos movendo entre colunas diferentes
    if (activeColumn.id !== overColumn.id) {
      setColumns(prevColumns => {
        const activeColumnIndex = prevColumns.findIndex(col => col.id === activeColumn.id)
        const overColumnIndex = prevColumns.findIndex(col => col.id === overColumn.id)
        
        const activeTask = activeColumn.tasks.find(task => task.id === activeId)
        if (!activeTask) return prevColumns

        const newColumns = [...prevColumns]
        
        // Remover tarefa da coluna de origem
        newColumns[activeColumnIndex] = {
          ...activeColumn,
          tasks: activeColumn.tasks.filter(task => task.id !== activeId),
          tasks_count: activeColumn.tasks_count - 1
        }

        // Adicionar tarefa na coluna de destino
        const overTaskIndex = overColumn.tasks.findIndex(task => task.id === overId)
        const insertIndex = overTaskIndex >= 0 ? overTaskIndex : overColumn.tasks.length

        const newTasks = [...overColumn.tasks]
        newTasks.splice(insertIndex, 0, activeTask)

        newColumns[overColumnIndex] = {
          ...overColumn,
          tasks: newTasks,
          tasks_count: overColumn.tasks_count + 1
        }

        return newColumns
      })
    }
  }, [columns])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    
    setActiveTask(null)
    
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Encontrar as colunas finais
    const activeColumn = columns.find(col => 
      col.tasks.some(task => task.id === activeId)
    )
    const overColumn = columns.find(col => 
      col.id === overId || col.tasks.some(task => task.id === overId)
    )

    if (!activeColumn || !overColumn) return

    // Se estamos reordenando dentro da mesma coluna
    if (activeColumn.id === overColumn.id) {
      const columnIndex = columns.findIndex(col => col.id === activeColumn.id)
      const activeIndex = activeColumn.tasks.findIndex(task => task.id === activeId)
      const overIndex = activeColumn.tasks.findIndex(task => task.id === overId)

      if (activeIndex !== overIndex) {
        setColumns(prevColumns => {
          const newColumns = [...prevColumns]
          const newTasks = arrayMove(activeColumn.tasks, activeIndex, overIndex)
          
          newColumns[columnIndex] = {
            ...activeColumn,
            tasks: newTasks
          }

          return newColumns
        })

        // Notificar sobre a mudança
        onTaskMove?.(activeId, activeColumn.id, overColumn.id, overIndex)
      }
    } else {
      // Movimento entre colunas já foi tratado no dragOver
      const overTaskIndex = overColumn.tasks.findIndex(task => task.id === overId)
      const newIndex = overTaskIndex >= 0 ? overTaskIndex : overColumn.tasks.length - 1
      
      onTaskMove?.(activeId, activeColumn.id, overColumn.id, newIndex)
    }
  }, [columns, onTaskMove])

  return (
    <div className="h-full flex flex-col">
      {/* Header do Board */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{board.project.name}</h2>
            <p className="text-muted-foreground">
              {board.columns.reduce((acc, col) => acc + col.tasks_count, 0)} tarefas • 
              {board.columns.length} colunas
            </p>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 pb-6 min-w-max">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                onAddTask={() => onAddTask?.(column.id)}
              />
            ))}
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeTask ? (
              <div className="rotate-3 scale-105">
                <KanbanCard task={activeTask} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}
