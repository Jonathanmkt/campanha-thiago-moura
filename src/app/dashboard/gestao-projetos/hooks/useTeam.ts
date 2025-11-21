'use client'

import { useState, useEffect, useCallback } from 'react'

export interface Colaborador {
  id: string
  funcao: string
  ativo: boolean
  profiles: {
    id: string
    name: string
    email: string
  }
  colaborador_equipe?: Array<{
    papel: string
    carga_horaria_semanal: number
    equipe: {
      id: string
      nome: string
      tipo_equipe: string
    }
  }>
  task_assignees?: Array<{
    id: string
    task: {
      id: string
      title: string
      priority: string
      completed_at?: string
    }
  }>
  estatisticas?: {
    active_tasks: number
    completed_tasks: number
    total_tasks: number
    estimated_hours: number
    spent_hours: number
    efficiency: number
    workload: number
  }
}

export interface Equipe {
  id: string
  nome: string
  tipo_equipe: string
  especialidade?: string
  lider_id?: string
  area_id?: string
  ativo: boolean
  created_at: string
  updated_at: string
  lider?: {
    id: string
    funcao: string
    profiles: {
      name: string
    }
  }
  colaborador_equipe?: Array<{
    colaborador: {
      id: string
      funcao: string
      profiles: {
        name: string
        email: string
      }
    }
  }>
}

interface UseTeamReturn {
  colaboradores: Colaborador[]
  equipes: Equipe[]
  loading: boolean
  error: string | null
  // Actions
  fetchColaboradores: (params?: {
    equipe_id?: string
    projeto_id?: string
    ativo?: boolean
  }) => Promise<void>
  fetchEquipes: () => Promise<void>
  updateColaborador: (id: string, data: Partial<Colaborador>) => Promise<Colaborador | null>
  // Task assignments
  assignTask: (taskId: string, colaboradorId: string, papel?: string) => Promise<boolean>
  unassignTask: (taskId: string, colaboradorId: string) => Promise<boolean>
  // Team management
  addColaboradorToEquipe: (colaboradorId: string, equipeId: string, papel: string) => Promise<boolean>
  removeColaboradorFromEquipe: (colaboradorId: string, equipeId: string) => Promise<boolean>
  // Utilities
  getColaboradorById: (id: string) => Colaborador | null
  getEquipeById: (id: string) => Equipe | null
  getColaboradoresByEquipe: (equipeId: string) => Colaborador[]
  getTeamStats: () => {
    totalColaboradores: number
    totalEquipes: number
    activeColaboradores: number
    averageWorkload: number
  }
  getTopPerformers: (limit?: number) => Colaborador[]
}

export function useTeam(): UseTeamReturn {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([])
  const [equipes, setEquipes] = useState<Equipe[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchColaboradores = useCallback(async (params?: {
    equipe_id?: string
    projeto_id?: string
    ativo?: boolean
  }) => {
    setLoading(true)
    setError(null)

    try {
      const queryParams = new URLSearchParams()
      
      if (params?.equipe_id) queryParams.set('equipe_id', params.equipe_id)
      if (params?.projeto_id) queryParams.set('projeto_id', params.projeto_id)
      if (params?.ativo !== undefined) queryParams.set('ativo', params.ativo.toString())

      const response = await fetch(`/api/supabase/colaboradores?${queryParams.toString()}`)
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar colaboradores: ${response.statusText}`)
      }

      const result = await response.json()
      setColaboradores(result.data || [])
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao buscar colaboradores:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchEquipes = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/supabase/projeto-equipes')
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar equipes: ${response.statusText}`)
      }

      const result = await response.json()
      setEquipes(result.data || [])
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao buscar equipes:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateColaborador = useCallback(async (id: string, data: Partial<Colaborador>): Promise<Colaborador | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/supabase/colaboradores-projetos`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...data }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Erro ao atualizar colaborador: ${response.statusText}`)
      }

      const updatedColaborador = await response.json()
      
      // Atualizar lista local
      setColaboradores(prev => prev.map(c => c.id === id ? updatedColaborador : c))
      
      return updatedColaborador
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao atualizar colaborador:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const assignTask = useCallback(async (taskId: string, colaboradorId: string, papel = 'executor'): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/supabase/task-assignees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task_id: taskId,
          colaborador_id: colaboradorId,
          papel_na_tarefa: papel,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Erro ao atribuir tarefa: ${response.statusText}`)
      }

      // Recarregar colaboradores para atualizar estatísticas
      await fetchColaboradores()
      
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao atribuir tarefa:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [fetchColaboradores])

  const unassignTask = useCallback(async (taskId: string, colaboradorId: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      // Buscar a atribuição específica
      const response = await fetch(`/api/supabase/task-assignees?task_id=${taskId}&colaborador_id=${colaboradorId}`)
      
      if (!response.ok) {
        throw new Error('Atribuição não encontrada')
      }

      const result = await response.json()
      const assignment = result.data?.[0]

      if (!assignment) {
        throw new Error('Atribuição não encontrada')
      }

      // Remover a atribuição
      const deleteResponse = await fetch(`/api/supabase/task-assignees`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: assignment.id,
          ativo: false,
        }),
      })

      if (!deleteResponse.ok) {
        const errorData = await deleteResponse.json()
        throw new Error(errorData.error || 'Erro ao remover atribuição')
      }

      // Recarregar colaboradores para atualizar estatísticas
      await fetchColaboradores()
      
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao remover atribuição:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [fetchColaboradores])

  const addColaboradorToEquipe = useCallback(async (colaboradorId: string, equipeId: string, papel: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/supabase/projeto-equipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          colaborador_id: colaboradorId,
          equipe_id: equipeId,
          papel,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Erro ao adicionar colaborador à equipe: ${response.statusText}`)
      }

      // Recarregar dados
      await Promise.all([fetchColaboradores(), fetchEquipes()])
      
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao adicionar colaborador à equipe:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [fetchColaboradores, fetchEquipes])

  const removeColaboradorFromEquipe = useCallback(async (colaboradorId: string, equipeId: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/supabase/projeto-equipes`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          colaborador_id: colaboradorId,
          equipe_id: equipeId,
          ativo: false,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Erro ao remover colaborador da equipe: ${response.statusText}`)
      }

      // Recarregar dados
      await Promise.all([fetchColaboradores(), fetchEquipes()])
      
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao remover colaborador da equipe:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [fetchColaboradores, fetchEquipes])

  const getColaboradorById = useCallback((id: string) => {
    return colaboradores.find(c => c.id === id) || null
  }, [colaboradores])

  const getEquipeById = useCallback((id: string) => {
    return equipes.find(e => e.id === id) || null
  }, [equipes])

  const getColaboradoresByEquipe = useCallback((equipeId: string) => {
    return colaboradores.filter(c => 
      c.colaborador_equipe?.some(ce => ce.equipe.id === equipeId)
    )
  }, [colaboradores])

  const getTeamStats = useCallback(() => {
    const activeColaboradores = colaboradores.filter(c => c.ativo)
    const totalWorkload = colaboradores.reduce((sum, c) => 
      sum + (c.estatisticas?.workload || 0), 0
    )

    return {
      totalColaboradores: colaboradores.length,
      totalEquipes: equipes.length,
      activeColaboradores: activeColaboradores.length,
      averageWorkload: colaboradores.length > 0 ? Math.round(totalWorkload / colaboradores.length) : 0,
    }
  }, [colaboradores, equipes])

  const getTopPerformers = useCallback((limit = 5) => {
    return colaboradores
      .filter(c => c.ativo && c.estatisticas)
      .sort((a, b) => {
        const scoreA = (a.estatisticas?.completed_tasks || 0) * 0.7 + (a.estatisticas?.efficiency || 0) * 0.3
        const scoreB = (b.estatisticas?.completed_tasks || 0) * 0.7 + (b.estatisticas?.efficiency || 0) * 0.3
        return scoreB - scoreA
      })
      .slice(0, limit)
  }, [colaboradores])

  // Carregar dados na inicialização
  useEffect(() => {
    fetchColaboradores()
    fetchEquipes()
  }, [fetchColaboradores, fetchEquipes])

  return {
    colaboradores,
    equipes,
    loading,
    error,
    fetchColaboradores,
    fetchEquipes,
    updateColaborador,
    assignTask,
    unassignTask,
    addColaboradorToEquipe,
    removeColaboradorFromEquipe,
    getColaboradorById,
    getEquipeById,
    getColaboradoresByEquipe,
    getTeamStats,
    getTopPerformers,
  }
}
