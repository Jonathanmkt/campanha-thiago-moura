'use client'

import { useState, useEffect, useCallback } from 'react'

export interface Project {
  id: string
  name: string
  slug: string
  description?: string
  avatar?: string
  color: string
  status: 'ACTIVE' | 'PLANNING' | 'ON_HOLD' | 'COMPLETED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  visibility: 'PUBLIC' | 'INTERNAL' | 'PRIVATE'
  start_date?: string
  end_date?: string
  created_at: string
  updated_at: string
  archived: boolean
  projeto_equipe?: Array<{
    id: string
    papel: string
    equipe: {
      id: string
      nome: string
      tipo_equipe: string
    }
  }>
  tasks?: Array<{
    id: string
    title: string
    status_id: string
    priority: string
    completed_at?: string
  }>
  sprints?: Array<{
    id: string
    name: string
    status: string
  }>
  estatisticas?: {
    total_tasks: number
    completed_tasks: number
    progress_percentage: number
    total_story_points: number
    total_sprints: number
    active_sprints: number
    team_size: number
  }
}

interface UseProjectsReturn {
  projects: Project[]
  loading: boolean
  error: string | null
  totalProjects: number
  totalPages: number
  currentPage: number
  // Actions
  fetchProjects: (params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
    priority?: string
    equipe_id?: string
  }) => Promise<void>
  createProject: (projectData: Partial<Project>) => Promise<Project | null>
  updateProject: (id: string, projectData: Partial<Project>) => Promise<Project | null>
  deleteProject: (id: string) => Promise<boolean>
  getProject: (id: string) => Promise<Project | null>
  // Filters
  setSearch: (search: string) => void
  setStatusFilter: (status: string) => void
  setPriorityFilter: (priority: string) => void
  setEquipeFilter: (equipeId: string) => void
  // Stats
  getProjectStats: () => {
    total: number
    active: number
    planning: number
    completed: number
    onHold: number
  }
}

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalProjects, setTotalProjects] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  
  // Filters
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [equipeFilter, setEquipeFilter] = useState('')

  const fetchProjects = useCallback(async (params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
    priority?: string
    equipe_id?: string
  }) => {
    setLoading(true)
    setError(null)

    try {
      const queryParams = new URLSearchParams()
      
      if (params?.page) queryParams.set('page', params.page.toString())
      if (params?.limit) queryParams.set('limit', params.limit.toString())
      if (params?.search || search) queryParams.set('search', params?.search || search)
      if (params?.status || statusFilter) queryParams.set('status', params?.status || statusFilter)
      if (params?.priority || priorityFilter) queryParams.set('priority', params?.priority || priorityFilter)
      if (params?.equipe_id || equipeFilter) queryParams.set('equipe_id', params?.equipe_id || equipeFilter)

      const response = await fetch(`/api/supabase/projetos?${queryParams.toString()}`)
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar projetos: ${response.statusText}`)
      }

      const result = await response.json()
      
      setProjects(result.data || [])
      setTotalProjects(result.pagination?.total || 0)
      setTotalPages(result.pagination?.totalPages || 0)
      setCurrentPage(result.pagination?.page || 1)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao buscar projetos:', err)
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter, priorityFilter, equipeFilter])

  const createProject = useCallback(async (projectData: Partial<Project>): Promise<Project | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/supabase/projetos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Erro ao criar projeto: ${response.statusText}`)
      }

      const newProject = await response.json()
      
      // Atualizar lista local
      setProjects(prev => [newProject, ...prev])
      setTotalProjects(prev => prev + 1)
      
      return newProject
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao criar projeto:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateProject = useCallback(async (id: string, projectData: Partial<Project>): Promise<Project | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/supabase/projetos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Erro ao atualizar projeto: ${response.statusText}`)
      }

      const updatedProject = await response.json()
      
      // Atualizar lista local
      setProjects(prev => prev.map(p => p.id === id ? updatedProject : p))
      
      return updatedProject
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao atualizar projeto:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteProject = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/supabase/projetos/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Erro ao arquivar projeto: ${response.statusText}`)
      }

      // Remover da lista local
      setProjects(prev => prev.filter(p => p.id !== id))
      setTotalProjects(prev => prev - 1)
      
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao arquivar projeto:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const getProject = useCallback(async (id: string): Promise<Project | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/supabase/projetos/${id}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Erro ao buscar projeto: ${response.statusText}`)
      }

      const project = await response.json()
      return project
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao buscar projeto:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getProjectStats = useCallback(() => {
    return {
      total: projects.length,
      active: projects.filter(p => p.status === 'ACTIVE').length,
      planning: projects.filter(p => p.status === 'PLANNING').length,
      completed: projects.filter(p => p.status === 'COMPLETED').length,
      onHold: projects.filter(p => p.status === 'ON_HOLD').length,
    }
  }, [projects])

  // Carregar projetos na inicialização
  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  // Recarregar quando filtros mudarem
  useEffect(() => {
    if (search || statusFilter || priorityFilter || equipeFilter) {
      fetchProjects()
    }
  }, [search, statusFilter, priorityFilter, equipeFilter, fetchProjects])

  return {
    projects,
    loading,
    error,
    totalProjects,
    totalPages,
    currentPage,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    getProject,
    setSearch,
    setStatusFilter,
    setPriorityFilter,
    setEquipeFilter,
    getProjectStats,
  }
}
