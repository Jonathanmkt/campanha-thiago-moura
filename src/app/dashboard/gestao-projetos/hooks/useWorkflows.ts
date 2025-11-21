'use client'

import { useState, useEffect, useCallback } from 'react'

export interface TaskStatus {
  id: string
  name: string
  category: 'TODO' | 'IN_PROGRESS' | 'DONE'
  color: string
  position: number
  is_default: boolean
  workflow_id: string
  created_at: string
  updated_at: string
}

export interface Workflow {
  id: string
  name: string
  description?: string
  is_default: boolean
  created_at: string
  updated_at: string
  task_statuses?: TaskStatus[]
}

interface UseWorkflowsReturn {
  workflows: Workflow[]
  taskStatuses: TaskStatus[]
  loading: boolean
  error: string | null
  // Actions
  fetchWorkflows: () => Promise<void>
  fetchTaskStatuses: (workflowId?: string) => Promise<void>
  createWorkflow: (workflowData: Partial<Workflow>) => Promise<Workflow | null>
  updateWorkflow: (id: string, workflowData: Partial<Workflow>) => Promise<Workflow | null>
  createTaskStatus: (statusData: Partial<TaskStatus>) => Promise<TaskStatus | null>
  updateTaskStatus: (id: string, statusData: Partial<TaskStatus>) => Promise<TaskStatus | null>
  // Utilities
  getDefaultWorkflow: () => Workflow | null
  getStatusesByCategory: () => {
    todo: TaskStatus[]
    inProgress: TaskStatus[]
    done: TaskStatus[]
  }
  getStatusById: (id: string) => TaskStatus | null
}

export function useWorkflows(): UseWorkflowsReturn {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [taskStatuses, setTaskStatuses] = useState<TaskStatus[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWorkflows = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/supabase/workflows')
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar workflows: ${response.statusText}`)
      }

      const result = await response.json()
      setWorkflows(result.data || [])
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao buscar workflows:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchTaskStatuses = useCallback(async (workflowId?: string) => {
    setLoading(true)
    setError(null)

    try {
      const queryParams = new URLSearchParams()
      if (workflowId) queryParams.set('workflow_id', workflowId)

      const response = await fetch(`/api/supabase/task-statuses?${queryParams.toString()}`)
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar status de tarefas: ${response.statusText}`)
      }

      const result = await response.json()
      setTaskStatuses(result.data || [])
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao buscar status de tarefas:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createWorkflow = useCallback(async (workflowData: Partial<Workflow>): Promise<Workflow | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/supabase/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflowData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Erro ao criar workflow: ${response.statusText}`)
      }

      const newWorkflow = await response.json()
      
      // Atualizar lista local
      setWorkflows(prev => [newWorkflow, ...prev])
      
      return newWorkflow
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao criar workflow:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateWorkflow = useCallback(async (id: string, workflowData: Partial<Workflow>): Promise<Workflow | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/supabase/workflows/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflowData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Erro ao atualizar workflow: ${response.statusText}`)
      }

      const updatedWorkflow = await response.json()
      
      // Atualizar lista local
      setWorkflows(prev => prev.map(w => w.id === id ? updatedWorkflow : w))
      
      return updatedWorkflow
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao atualizar workflow:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const createTaskStatus = useCallback(async (statusData: Partial<TaskStatus>): Promise<TaskStatus | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/supabase/task-statuses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(statusData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Erro ao criar status: ${response.statusText}`)
      }

      const newStatus = await response.json()
      
      // Atualizar lista local
      setTaskStatuses(prev => [...prev, newStatus].sort((a, b) => a.position - b.position))
      
      return newStatus
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao criar status:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateTaskStatus = useCallback(async (id: string, statusData: Partial<TaskStatus>): Promise<TaskStatus | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/supabase/task-statuses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(statusData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Erro ao atualizar status: ${response.statusText}`)
      }

      const updatedStatus = await response.json()
      
      // Atualizar lista local
      setTaskStatuses(prev => prev.map(s => s.id === id ? updatedStatus : s).sort((a, b) => a.position - b.position))
      
      return updatedStatus
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao atualizar status:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getDefaultWorkflow = useCallback(() => {
    return workflows.find(w => w.is_default) || null
  }, [workflows])

  const getStatusesByCategory = useCallback(() => {
    return {
      todo: taskStatuses.filter(s => s.category === 'TODO'),
      inProgress: taskStatuses.filter(s => s.category === 'IN_PROGRESS'),
      done: taskStatuses.filter(s => s.category === 'DONE'),
    }
  }, [taskStatuses])

  const getStatusById = useCallback((id: string) => {
    return taskStatuses.find(s => s.id === id) || null
  }, [taskStatuses])

  // Carregar dados na inicialização
  useEffect(() => {
    fetchWorkflows()
    fetchTaskStatuses()
  }, [fetchWorkflows, fetchTaskStatuses])

  return {
    workflows,
    taskStatuses,
    loading,
    error,
    fetchWorkflows,
    fetchTaskStatuses,
    createWorkflow,
    updateWorkflow,
    createTaskStatus,
    updateTaskStatus,
    getDefaultWorkflow,
    getStatusesByCategory,
    getStatusById,
  }
}
