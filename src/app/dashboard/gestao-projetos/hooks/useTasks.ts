'use client'

import { useState, useEffect, useCallback } from 'react'

export interface Task {
  id: string
  title: string
  description?: string
  type: 'TASK' | 'BUG' | 'EPIC' | 'STORY' | 'SUBTASK'
  priority: 'LOWEST' | 'LOW' | 'MEDIUM' | 'HIGH' | 'HIGHEST'
  task_number: number
  slug: string
  start_date?: string
  due_date?: string
  completed_at?: string
  story_points?: number
  original_estimate?: number
  remaining_estimate?: number
  custom_fields?: Record<string, any>
  project_id?: string
  status_id?: string
  sprint_id?: string
  parent_task_id?: string
  created_at: string
  updated_at: string
  archived: boolean
  equipe_responsavel_id?: string
  colaborador_responsavel_id?: string
  task_statuses?: {
    id: string
    name: string
    category: 'TODO' | 'IN_PROGRESS' | 'DONE'
    color: string
  }
  projects?: {
    id: string
    name: string
    slug: string
  }
  sprints?: {
    id: string
    name: string
    status: string
  }
  task_assignees?: Array<{
    id: string
    papel_na_tarefa: string
    colaborador: {
      id: string
      funcao: string
      profiles: {
        name: string
      }
    }
  }>
  estatisticas?: {
    total_assignees: number
    total_comments: number
    total_subtasks: number
    completed_subtasks: number
    subtasks_progress: number
    total_dependencies: number
    estimated_hours: number
    spent_hours: number
    time_efficiency: number
  }
}

interface UseTasksReturn {
  tasks: Task[]
  loading: boolean
  error: string | null
  totalTasks: number
  totalPages: number
  currentPage: number
  // Actions
  fetchTasks: (params?: {
    page?: number
    limit?: number
    search?: string
    project_id?: string
    sprint_id?: string
    status_id?: string
    priority?: string
    type?: string
    colaborador_id?: string
    equipe_id?: string
  }) => Promise<void>
  createTask: (taskData: Partial<Task>) => Promise<Task | null>
  updateTask: (id: string, taskData: Partial<Task>) => Promise<Task | null>
  deleteTask: (id: string) => Promise<boolean>
  getTask: (id: string) => Promise<Task | null>
  // Kanban specific
  moveTask: (taskId: string, newStatusId: string) => Promise<boolean>
  // Filters
  setSearch: (search: string) => void
  setProjectFilter: (projectId: string) => void
  setSprintFilter: (sprintId: string) => void
  setStatusFilter: (statusId: string) => void
  setPriorityFilter: (priority: string) => void
  setTypeFilter: (type: string) => void
  setColaboradorFilter: (colaboradorId: string) => void
  setEquipeFilter: (equipeId: string) => void
  // Stats
  getTaskStats: () => {
    total: number
    todo: number
    inProgress: number
    done: number
    byPriority: Record<string, number>
    byType: Record<string, number>
  }
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalTasks, setTotalTasks] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  
  // Filters
  const [search, setSearch] = useState('')
  const [projectFilter, setProjectFilter] = useState('')
  const [sprintFilter, setSprintFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [colaboradorFilter, setColaboradorFilter] = useState('')
  const [equipeFilter, setEquipeFilter] = useState('')

  const fetchTasks = useCallback(async (params?: {
    page?: number
    limit?: number
    search?: string
    project_id?: string
    sprint_id?: string
    status_id?: string
    priority?: string
    type?: string
    colaborador_id?: string
    equipe_id?: string
  }) => {
    setLoading(true)
    setError(null)

    try {
      const queryParams = new URLSearchParams()
      
      if (params?.page) queryParams.set('page', params.page.toString())
      if (params?.limit) queryParams.set('limit', params.limit.toString())
      if (params?.search || search) queryParams.set('search', params?.search || search)
      if (params?.project_id || projectFilter) queryParams.set('project_id', params?.project_id || projectFilter)
      if (params?.sprint_id || sprintFilter) queryParams.set('sprint_id', params?.sprint_id || sprintFilter)
      if (params?.status_id || statusFilter) queryParams.set('status_id', params?.status_id || statusFilter)
      if (params?.priority || priorityFilter) queryParams.set('priority', params?.priority || priorityFilter)
      if (params?.type || typeFilter) queryParams.set('type', params?.type || typeFilter)
      if (params?.colaborador_id || colaboradorFilter) queryParams.set('colaborador_id', params?.colaborador_id || colaboradorFilter)
      if (params?.equipe_id || equipeFilter) queryParams.set('equipe_id', params?.equipe_id || equipeFilter)

      const response = await fetch(`/api/supabase/tarefas?${queryParams.toString()}`)
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar tarefas: ${response.statusText}`)
      }

      const result = await response.json()
      
      setTasks(result.data || [])
      setTotalTasks(result.pagination?.total || 0)
      setTotalPages(result.pagination?.totalPages || 0)
      setCurrentPage(result.pagination?.page || 1)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao buscar tarefas:', err)
    } finally {
      setLoading(false)
    }
  }, [search, projectFilter, sprintFilter, statusFilter, priorityFilter, typeFilter, colaboradorFilter, equipeFilter])

  const createTask = useCallback(async (taskData: Partial<Task>): Promise<Task | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/supabase/tarefas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Erro ao criar tarefa: ${response.statusText}`)
      }

      const newTask = await response.json()
      
      // Atualizar lista local
      setTasks(prev => [newTask, ...prev])
      setTotalTasks(prev => prev + 1)
      
      return newTask
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao criar tarefa:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateTask = useCallback(async (id: string, taskData: Partial<Task>): Promise<Task | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/supabase/tarefas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Erro ao atualizar tarefa: ${response.statusText}`)
      }

      const updatedTask = await response.json()
      
      // Atualizar lista local
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t))
      
      return updatedTask
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao atualizar tarefa:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteTask = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/supabase/tarefas/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Erro ao arquivar tarefa: ${response.statusText}`)
      }

      // Remover da lista local
      setTasks(prev => prev.filter(t => t.id !== id))
      setTotalTasks(prev => prev - 1)
      
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao arquivar tarefa:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const getTask = useCallback(async (id: string): Promise<Task | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/supabase/tarefas/${id}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Erro ao buscar tarefa: ${response.statusText}`)
      }

      const task = await response.json()
      return task
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao buscar tarefa:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const moveTask = useCallback(async (taskId: string, newStatusId: string): Promise<boolean> => {
    return await updateTask(taskId, { status_id: newStatusId }) !== null
  }, [updateTask])

  const getTaskStats = useCallback(() => {
    const stats = {
      total: tasks.length,
      todo: 0,
      inProgress: 0,
      done: 0,
      byPriority: {} as Record<string, number>,
      byType: {} as Record<string, number>,
    }

    tasks.forEach(task => {
      // Status stats
      if (task.task_statuses?.category === 'TODO') stats.todo++
      else if (task.task_statuses?.category === 'IN_PROGRESS') stats.inProgress++
      else if (task.task_statuses?.category === 'DONE') stats.done++

      // Priority stats
      stats.byPriority[task.priority] = (stats.byPriority[task.priority] || 0) + 1

      // Type stats
      stats.byType[task.type] = (stats.byType[task.type] || 0) + 1
    })

    return stats
  }, [tasks])

  // Carregar tarefas na inicialização
  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  // Recarregar quando filtros mudarem
  useEffect(() => {
    if (search || projectFilter || sprintFilter || statusFilter || priorityFilter || typeFilter || colaboradorFilter || equipeFilter) {
      fetchTasks()
    }
  }, [search, projectFilter, sprintFilter, statusFilter, priorityFilter, typeFilter, colaboradorFilter, equipeFilter, fetchTasks])

  return {
    tasks,
    loading,
    error,
    totalTasks,
    totalPages,
    currentPage,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    getTask,
    moveTask,
    setSearch,
    setProjectFilter,
    setSprintFilter,
    setStatusFilter,
    setPriorityFilter,
    setTypeFilter,
    setColaboradorFilter,
    setEquipeFilter,
    getTaskStats,
  }
}
