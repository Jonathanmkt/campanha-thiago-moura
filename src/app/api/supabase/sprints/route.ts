import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/supabase/sprints - Listar sprints
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const projectId = searchParams.get('project_id')
    const status = searchParams.get('status')
    const archived = searchParams.get('archived') === 'true'
    
    let query = supabase
      .from('sprints')
      .select(`
        *,
        projects(id, name, slug),
        tasks(
          id,
          title,
          status_id,
          priority,
          story_points
        )
      `)
      .eq('archived', archived)
      .order('created_at', { ascending: false })

    if (projectId) {
      query = query.eq('project_id', projectId)
    }
    
    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Erro ao buscar sprints:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar sprints', details: error.message },
        { status: 500 }
      )
    }

    // Processar dados para incluir estatísticas
    const processedData = data?.map((sprint: Record<string, unknown>) => {
      const tasks = sprint.tasks as Array<Record<string, unknown>> || []
      
      const totalTasks = tasks.length
      const completedTasks = tasks.filter((task: Record<string, unknown>) => {
        const taskStatus = task.task_statuses as Record<string, unknown>
        return taskStatus?.category === 'DONE'
      }).length
      
      const totalStoryPoints = tasks.reduce((acc: number, task: Record<string, unknown>) => 
        acc + (Number(task.story_points) || 0), 0
      )
      
      const completedStoryPoints = tasks
        .filter((task: Record<string, unknown>) => {
          const taskStatus = task.task_statuses as Record<string, unknown>
          return taskStatus?.category === 'DONE'
        })
        .reduce((acc: number, task: Record<string, unknown>) => 
          acc + (Number(task.story_points) || 0), 0
        )

      return {
        ...sprint,
        estatisticas: {
          total_tasks: totalTasks,
          completed_tasks: completedTasks,
          total_story_points: totalStoryPoints,
          completed_story_points: completedStoryPoints,
          progress_percentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
          velocity: completedStoryPoints
        }
      }
    })

    return NextResponse.json({ data: processedData })

  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/supabase/sprints - Criar novo sprint
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Validações básicas
    if (!body.name || !body.project_id) {
      return NextResponse.json(
        { error: 'Nome e project_id são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se já existe um sprint ativo no projeto
    if (body.status === 'ACTIVE') {
      const { data: activeSprint } = await supabase
        .from('sprints')
        .select('id')
        .eq('project_id', body.project_id)
        .eq('status', 'ACTIVE')
        .single()

      if (activeSprint) {
        return NextResponse.json(
          { error: 'Já existe um sprint ativo neste projeto' },
          { status: 409 }
        )
      }
    }

    const { data, error } = await supabase
      .from('sprints')
      .insert([{
        ...body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select(`
        *,
        projects(id, name, slug)
      `)
      .single()

    if (error) {
      console.error('Erro ao criar sprint:', error)
      return NextResponse.json(
        { error: 'Erro ao criar sprint', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 201 })

  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
