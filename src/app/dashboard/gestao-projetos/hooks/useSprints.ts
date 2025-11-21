'use client'

import { useState, useEffect, useCallback } from 'react'

export interface Sprint {
  id: string
  name: string
  goal?: string
  status: 'PLANNING' | 'ACTIVE' | 'COMPLETED'
  is_default: boolean
  archived: boolean
  start_date?: string
  end_date?: string
  project_id?: string
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
  projects?: {
    id: string
    name: string
    slug: string
  }
  tasks?: Array<{
    id: string
    title: string
    status_id: string
    priority: string
    story_points?: number
  }>
  estatisticas?: {
    total_tasks: number
    completed_tasks: number
    total_story_points: number
    completed_story_points: number
    progress_percentage: number
    velocity: number
  }
}

interface UseSprintsReturn {
  sprints: Sprint[]
  loading: boolean
  error: string | null
  // Actions
  fetchSprints: (params?: {
    project_id?: string
    status?: string
    archived?: boolean
  }) => Promise<void>
  createSprint: (sprintData: Partial<Sprint>) => Promise<Sprint | null>
  updateSprint: (id: string, sprintData: Partial<Sprint>) => Promise<Sprint | null>
  deleteSprint: (id: string) => Promise<boolean>
  getSprint: (id: string) => Promise<Sprint | null>
  // Sprint management
  startSprint: (id: string) => Promise<boolean>
  completeSprint: (id: string) => Promise<boolean>
  // Filters
  setProjectFilter: (projectId: string) => void
  setStatusFilter: (status: string) => void
  // Utilities
  getActiveSprints: () => Sprint[]
  getSprintsByProject: (projectId: string) => Sprint[]
  getCurrentSprint: (projectId?: string) => Sprint | null
  getSprintStats: () => {
    total: number
    planning: number
    active: number
    completed: number
  }
}

export function useSprints(): UseSprintsReturn {
  const [sprints, setSprints] = useState<Sprint[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Filters
  const [projectFilter, setProjectFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const fetchSprints = useCallback(async (params?: {
    project_id?: string
    status?: string
    archived?: boolean
  }) => {
    setLoading(true)
    setError(null)

    try {
      const queryParams = new URLSearchParams()
      
      if (params?.project_id || projectFilter) queryParams.set('project_id', params?.project_id || projectFilter)
      if (params?.status || statusFilter) queryParams.set('status', params?.status || statusFilter)
      if (params?.archived !== undefined) queryParams.set('archived', params.archived.toString())

      const response = await fetch(`/api/supabase/sprints?${queryParams.toString()}`)
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar sprints: ${response.statusText}`)
      }

      const result = await response.json()
      setSprints(result.data || [])
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao buscar sprints:', err)
    } finally {
      setLoading(false)
    }
  }, [projectFilter, statusFilter])

  const createSprint = useCallback(async (sprintData: Partial<Sprint>): Promise<Sprint | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/supabase/sprints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sprintData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Erro ao criar sprint: ${response.statusText}`)
      }

      const newSprint = await response.json()
      
      // Atualizar lista local
      setSprints(prev => [newSprint, ...prev])
      
      return newSprint
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao criar sprint:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateSprint = useCallback(async (id: string, sprintData: Partial<Sprint>): Promise<Sprint | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/supabase/sprints/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sprintData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Erro ao atualizar sprint: ${response.statusText}`)
      }

      const updatedSprint = await response.json()
      
      // Atualizar lista local
      setSprints(prev => prev.map(s => s.id === id ? updatedSprint : s))
      
      return updatedSprint
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao atualizar sprint:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteSprint = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/supabase/sprints/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Erro ao arquivar sprint: ${response.statusText}`)
      }

      // Remover da lista local
      setSprints(prev => prev.filter(s => s.id !== id))
      
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao arquivar sprint:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const getSprint = useCallback(async (id: string): Promise<Sprint | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/supabase/sprints/${id}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Erro ao buscar sprint: ${response.statusText}`)
      }

      const sprint = await response.json()
      return sprint
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao buscar sprint:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const startSprint = useCallback(async (id: string): Promise<boolean> => {
    return await updateSprint(id, { 
      status: 'ACTIVE',
      start_date: new Date().toISOString().split('T')[0]
    }) !== null
  }, [updateSprint])

  const completeSprint = useCallback(async (id: string): Promise<boolean> => {
    return await updateSprint(id, { 
      status: 'COMPLETED',
      end_date: new Date().toISOString().split('T')[0]
    }) !== null
  }, [updateSprint])

  const getActiveSprints = useCallback(() => {
    return sprints.filter(s => s.status === 'ACTIVE')
  }, [sprints])

  const getSprintsByProject = useCallback((projectId: string) => {
    return sprints.filter(s => s.project_id === projectId)
  }, [sprints])

  const getCurrentSprint = useCallback((projectId?: string) => {
    const activeSprints = sprints.filter(s => s.status === 'ACTIVE')
    
    if (projectId) {
      return activeSprints.find(s => s.project_id === projectId) || null
    }
    
    return activeSprints[0] || null
  }, [sprints])

  const getSprintStats = useCallback(() => {
    return {
      total: sprints.length,
      planning: sprints.filter(s => s.status === 'PLANNING').length,
      active: sprints.filter(s => s.status === 'ACTIVE').length,
      completed: sprints.filter(s => s.status === 'COMPLETED').length,
    }
  }, [sprints])

  // Carregar sprints na inicialização
  useEffect(() => {
    fetchSprints()
  }, [fetchSprints])

  // Recarregar quando filtros mudarem
  useEffect(() => {
    if (projectFilter || statusFilter) {
      fetchSprints()
    }
  }, [projectFilter, statusFilter, fetchSprints])

  return {
    sprints,
    loading,
    error,
    fetchSprints,
    createSprint,
    updateSprint,
    deleteSprint,
    getSprint,
    startSprint,
    completeSprint,
    setProjectFilter,
    setStatusFilter,
    getActiveSprints,
    getSprintsByProject,
    getCurrentSprint,
    getSprintStats,
  }
}
