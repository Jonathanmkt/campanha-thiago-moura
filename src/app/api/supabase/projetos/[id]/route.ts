import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/supabase/projetos/[id] - Buscar projeto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        projeto_equipe(
          id,
          papel,
          data_inicio,
          data_fim,
          ativo,
          equipe:equipe(id, nome, tipo_equipe)
        ),
        tasks(
          id,
          title,
          status_id,
          priority,
          type,
          story_points,
          due_date,
          completed_at
        ),
        sprints(
          id,
          name,
          status,
          start_date,
          end_date,
          goal
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Projeto não encontrado' },
          { status: 404 }
        )
      }
      console.error('Erro ao buscar projeto:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar projeto', details: error.message },
        { status: 500 }
      )
    }

    // Processar estatísticas do projeto
    const tasks = data.tasks as Array<Record<string, unknown>> || []
    const sprints = data.sprints as Array<Record<string, unknown>> || []
    
    const totalTasks = tasks.length
    const completedTasks = tasks.filter((task: Record<string, unknown>) => {
      const taskStatus = task.task_statuses as Record<string, unknown>
      return taskStatus?.category === 'DONE'
    }).length
    
    const totalStoryPoints = tasks.reduce((acc: number, task: Record<string, unknown>) => 
      acc + (Number(task.story_points) || 0), 0
    )
    
    const activeSprints = sprints.filter((sprint: Record<string, unknown>) => 
      sprint.status === 'ACTIVE'
    ).length

    const projectWithStats = {
      ...data,
      estatisticas: {
        total_tasks: totalTasks,
        completed_tasks: completedTasks,
        progress_percentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        total_story_points: totalStoryPoints,
        total_sprints: sprints.length,
        active_sprints: activeSprints,
        team_size: data.projeto_equipe?.reduce((acc: number, pe: Record<string, unknown>) => {
          const equipe = pe.equipe as Record<string, unknown>
          const colaboradorEquipe = equipe?.colaborador_equipe as Array<Record<string, unknown>> || []
          return acc + colaboradorEquipe.length
        }, 0) || 0
      }
    }

    return NextResponse.json(projectWithStats)

  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/supabase/projetos/[id] - Atualizar projeto
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params
    const body = await request.json()

    // Verificar se o projeto existe
    const { data: existingProject } = await supabase
      .from('projects')
      .select('id')
      .eq('id', id)
      .single()

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Projeto não encontrado' },
        { status: 404 }
      )
    }

    // Se está atualizando o slug, verificar se não existe outro projeto com o mesmo slug
    if (body.slug) {
      const { data: slugExists } = await supabase
        .from('projects')
        .select('id')
        .eq('slug', body.slug)
        .neq('id', id)
        .single()

      if (slugExists) {
        return NextResponse.json(
          { error: 'Slug já existe em outro projeto' },
          { status: 409 }
        )
      }
    }

    const { data, error } = await supabase
      .from('projects')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar projeto:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar projeto', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data)

  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/supabase/projetos/[id] - Arquivar projeto
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    // Verificar se o projeto existe
    const { data: existingProject } = await supabase
      .from('projects')
      .select('id')
      .eq('id', id)
      .single()

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Projeto não encontrado' },
        { status: 404 }
      )
    }

    // Soft delete - marcar como arquivado
    const { data, error } = await supabase
      .from('projects')
      .update({
        archived: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao arquivar projeto:', error)
      return NextResponse.json(
        { error: 'Erro ao arquivar projeto', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Projeto arquivado com sucesso', data })

  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
