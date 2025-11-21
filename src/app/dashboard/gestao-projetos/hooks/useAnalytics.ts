'use client'

import { useState, useEffect, useCallback } from 'react'

export interface Analytics {
  overview: {
    total_projects: number
    active_projects: number
    total_tasks: number
    completed_tasks: number
    total_colaboradores: number
    completion_rate: number
  }
  projects_by_status: Record<string, number>
  tasks_by_priority: Record<string, number>
  tasks_by_type: Record<string, number>
  productivity_metrics: {
    total_story_points: number
    completed_story_points: number
    average_completion_time: number
  }
  team_performance: Array<{
    id: string
    name: string
    funcao: string
    active_tasks: number
    completed_tasks: number
    total_tasks: number
    estimated_hours: number
    spent_hours: number
    efficiency: number
    workload: number
    teams: Array<{
      name: string
      role: string
    }>
  }>
  timeline_data: Array<{
    date: string
    tasks_created: number
    tasks_completed: number
  }>
}

interface UseAnalyticsReturn {
  analytics: Analytics | null
  loading: boolean
  error: string | null
  // Actions
  fetchAnalytics: (params?: {
    project_id?: string
    equipe_id?: string
    colaborador_id?: string
    period?: string
  }) => Promise<void>
  refreshAnalytics: () => Promise<void>
  // Computed stats
  getOverviewStats: () => {
    totalProjects: number
    activeProjects: number
    totalTasks: number
    completedTasks: number
    completionRate: number
    totalCollaborators: number
  }
  getProjectStatusDistribution: () => Array<{
    status: string
    count: number
    percentage: number
  }>
  getTaskPriorityDistribution: () => Array<{
    priority: string
    count: number
    percentage: number
  }>
  getTopPerformers: (limit?: number) => Array<{
    id: string
    name: string
    completedTasks: number
    efficiency: number
  }>
}

export function useAnalytics(): UseAnalyticsReturn {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async (params?: {
    project_id?: string
    equipe_id?: string
    colaborador_id?: string
    period?: string
  }) => {
    setLoading(true)
    setError(null)

    try {
      const queryParams = new URLSearchParams()
      
      if (params?.project_id) queryParams.set('project_id', params.project_id)
      if (params?.equipe_id) queryParams.set('equipe_id', params.equipe_id)
      if (params?.colaborador_id) queryParams.set('colaborador_id', params.colaborador_id)
      if (params?.period) queryParams.set('period', params.period)

      const response = await fetch(`/api/supabase/analytics?${queryParams.toString()}`)
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar analytics: ${response.statusText}`)
      }

      const result = await response.json()
      setAnalytics(result.data)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao buscar analytics:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshAnalytics = useCallback(async () => {
    await fetchAnalytics()
  }, [fetchAnalytics])

  const getOverviewStats = useCallback(() => {
    if (!analytics) {
      return {
        totalProjects: 0,
        activeProjects: 0,
        totalTasks: 0,
        completedTasks: 0,
        completionRate: 0,
        totalCollaborators: 0,
      }
    }

    return {
      totalProjects: analytics.overview.total_projects,
      activeProjects: analytics.overview.active_projects,
      totalTasks: analytics.overview.total_tasks,
      completedTasks: analytics.overview.completed_tasks,
      completionRate: analytics.overview.completion_rate,
      totalCollaborators: analytics.overview.total_colaboradores,
    }
  }, [analytics])

  const getProjectStatusDistribution = useCallback(() => {
    if (!analytics) return []

    const total = Object.values(analytics.projects_by_status).reduce((sum, count) => sum + count, 0)
    
    return Object.entries(analytics.projects_by_status).map(([status, count]) => ({
      status,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
  }, [analytics])

  const getTaskPriorityDistribution = useCallback(() => {
    if (!analytics) return []

    const total = Object.values(analytics.tasks_by_priority).reduce((sum, count) => sum + count, 0)
    
    return Object.entries(analytics.tasks_by_priority).map(([priority, count]) => ({
      priority,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
  }, [analytics])

  const getTopPerformers = useCallback((limit = 5) => {
    if (!analytics) return []

    return analytics.team_performance
      .sort((a, b) => {
        // Ordenar por tarefas concluídas e eficiência
        const scoreA = a.completed_tasks * 0.7 + a.efficiency * 0.3
        const scoreB = b.completed_tasks * 0.7 + b.efficiency * 0.3
        return scoreB - scoreA
      })
      .slice(0, limit)
      .map(member => ({
        id: member.id,
        name: member.name,
        completedTasks: member.completed_tasks,
        efficiency: member.efficiency,
      }))
  }, [analytics])

  // Carregar analytics na inicialização
  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  return {
    analytics,
    loading,
    error,
    fetchAnalytics,
    refreshAnalytics,
    getOverviewStats,
    getProjectStatusDistribution,
    getTaskPriorityDistribution,
    getTopPerformers,
  }
}
