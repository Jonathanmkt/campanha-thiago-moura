import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/supabase/analytics - Obter estatísticas e métricas
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const projectId = searchParams.get('project_id')
    const equipeId = searchParams.get('equipe_id')
    const colaboradorId = searchParams.get('colaborador_id')
    const period = searchParams.get('period') || '30' // dias
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(period))
    const startDateStr = startDate.toISOString()

    // Estatísticas gerais de projetos
    const { data: projectStats } = await supabase
      .from('projects')
      .select(`
        id,
        status,
        priority,
        created_at,
        tasks(
          id,
          status_id,
          priority,
          completed_at,
          task_statuses(category)
        ),
        projeto_equipe(
          equipe(id, nome)
        )
      `)
      .eq('archived', false)
      .gte('created_at', projectId ? undefined : startDateStr)
      .eq(projectId ? 'id' : 'archived', projectId || false)

    // Estatísticas de tarefas
    const { data: taskStats } = await supabase
      .from('tasks')
      .select(`
        id,
        priority,
        type,
        created_at,
        completed_at,
        story_points,
        task_statuses(category),
        projects(id, name),
        task_assignees(
          colaborador_id,
          tempo_estimado,
          tempo_gasto,
          colaborador(
            profiles(name)
          )
        )
      `)
      .eq('archived', false)
      .gte('created_at', startDateStr)
      .eq(projectId ? 'project_id' : 'archived', projectId || false)

    // Estatísticas de colaboradores
    let colaboradorQuery = supabase
      .from('colaborador')
      .select(`
        id,
        funcao,
        ativo,
        profiles(name, email),
        task_assignees(
          id,
          tempo_estimado,
          tempo_gasto,
          data_atribuicao,
          data_conclusao,
          task:tasks(
            id,
            priority,
            completed_at,
            task_statuses(category)
          )
        ),
        colaborador_equipe(
          papel,
          carga_horaria_semanal,
          equipe(id, nome)
        )
      `)
      .eq('ativo', true)

    if (equipeId) {
      colaboradorQuery = colaboradorQuery.eq('colaborador_equipe.equipe_id', equipeId)
    }

    if (colaboradorId) {
      colaboradorQuery = colaboradorQuery.eq('id', colaboradorId)
    }

    const { data: colaboradorStats } = await colaboradorQuery

    // Processar estatísticas
    const analytics = {
      overview: {
        total_projects: projectStats?.length || 0,
        active_projects: projectStats?.filter(p => p.status === 'ACTIVE').length || 0,
        total_tasks: taskStats?.length || 0,
        completed_tasks: taskStats?.filter(t => t.task_statuses?.category === 'DONE').length || 0,
        total_colaboradores: colaboradorStats?.length || 0,
        completion_rate: taskStats?.length ? 
          Math.round((taskStats.filter(t => t.task_statuses?.category === 'DONE').length / taskStats.length) * 100) : 0
      },

      projects_by_status: projectStats?.reduce((acc: Record<string, number>, project: Record<string, unknown>) => {
        const status = project.status as string || 'UNKNOWN'
        acc[status] = (acc[status] || 0) + 1
        return acc
      }, {}) || {},

      tasks_by_priority: taskStats?.reduce((acc: Record<string, number>, task: Record<string, unknown>) => {
        const priority = task.priority as string || 'UNKNOWN'
        acc[priority] = (acc[priority] || 0) + 1
        return acc
      }, {}) || {},

      tasks_by_type: taskStats?.reduce((acc: Record<string, number>, task: Record<string, unknown>) => {
        const type = task.type as string || 'UNKNOWN'
        acc[type] = (acc[type] || 0) + 1
        return acc
      }, {}) || {},

      productivity_metrics: {
        total_story_points: taskStats?.reduce((acc: number, task: Record<string, unknown>) => 
          acc + (Number(task.story_points) || 0), 0) || 0,
        
        completed_story_points: taskStats?.filter(t => t.task_statuses?.category === 'DONE')
          .reduce((acc: number, task: Record<string, unknown>) => 
            acc + (Number(task.story_points) || 0), 0) || 0,
        
        average_completion_time: (() => {
          const completedTasks = taskStats?.filter(t => t.completed_at && t.created_at) || []
          if (completedTasks.length === 0) return 0
          
          const totalDays = completedTasks.reduce((acc: number, task: Record<string, unknown>) => {
            const created = new Date(task.created_at as string)
            const completed = new Date(task.completed_at as string)
            return acc + Math.ceil((completed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
          }, 0)
          
          return Math.round(totalDays / completedTasks.length)
        })()
      },

      team_performance: colaboradorStats?.map((colaborador: Record<string, unknown>) => {
        const taskAssignees = colaborador.task_assignees as Array<Record<string, unknown>> || []
        const activeTasks = taskAssignees.filter((ta: Record<string, unknown>) => {
          const task = ta.task as Record<string, unknown>
          const taskStatus = task?.task_statuses as Record<string, unknown>
          return taskStatus?.category !== 'DONE'
        })
        
        const completedTasks = taskAssignees.filter((ta: Record<string, unknown>) => {
          const task = ta.task as Record<string, unknown>
          const taskStatus = task?.task_statuses as Record<string, unknown>
          return taskStatus?.category === 'DONE'
        })

        const totalEstimated = taskAssignees.reduce((acc: number, ta: Record<string, unknown>) => 
          acc + (Number(ta.tempo_estimado) || 0), 0)
        
        const totalSpent = taskAssignees.reduce((acc: number, ta: Record<string, unknown>) => 
          acc + (Number(ta.tempo_gasto) || 0), 0)

        const profile = colaborador.profiles as Record<string, unknown>
        const colaboradorEquipe = colaborador.colaborador_equipe as Array<Record<string, unknown>> || []

        return {
          id: colaborador.id,
          name: profile?.name || 'N/A',
          funcao: colaborador.funcao,
          active_tasks: activeTasks.length,
          completed_tasks: completedTasks.length,
          total_tasks: taskAssignees.length,
          estimated_hours: Math.round(totalEstimated / 60), // converter de minutos para horas
          spent_hours: Math.round(totalSpent / 60),
          efficiency: totalEstimated > 0 ? Math.round((totalEstimated / totalSpent) * 100) : 0,
          workload: colaboradorEquipe.reduce((acc: number, ce: Record<string, unknown>) => 
            acc + (Number(ce.carga_horaria_semanal) || 0), 0),
          teams: colaboradorEquipe.map((ce: Record<string, unknown>) => {
            const equipe = ce.equipe as Record<string, unknown>
            return {
              name: equipe?.nome || 'N/A',
              role: ce.papel
            }
          })
        }
      }) || [],

      timeline_data: (() => {
        const last30Days = Array.from({ length: 30 }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - (29 - i))
          return date.toISOString().split('T')[0]
        })

        return last30Days.map(date => {
          const tasksCreated = taskStats?.filter(t => 
            t.created_at && t.created_at.startsWith(date)
          ).length || 0
          
          const tasksCompleted = taskStats?.filter(t => 
            t.completed_at && t.completed_at.startsWith(date)
          ).length || 0

          return {
            date,
            tasks_created: tasksCreated,
            tasks_completed: tasksCompleted
          }
        })
      })()
    }

    return NextResponse.json({ data: analytics })

  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
