import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/supabase/tarefas/[id] - Buscar tarefa por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id } = params

    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        task_statuses(id, name, category, color),
        projects(
          id, 
          name, 
          slug,
          projeto_equipe(
            equipe:equipe(id, nome, tipo_equipe)
          )
        ),
        sprints(id, name, status, start_date, end_date),
        task_assignees(
          id,
          papel_na_tarefa,
          tempo_estimado,
          tempo_gasto,
          data_atribuicao,
          colaborador:colaborador(
            id,
            funcao,
            profiles(id, name, email)
          )
        ),
        task_labels(
          id,
          labels(id, name, color)
        ),
        task_comments(
          id,
          content,
          created_at,
          author:colaborador!author_id(
            profiles(id, name)
          ),
          parent_comment_id
        ),
        task_attachments(
          id,
          filename,
          file_size,
          file_type,
          url
        ),
        task_dependencies_blocking:task_dependencies!blocking_task_id(
          id,
          type,
          dependent_task:tasks!dependent_task_id(
            id, 
            title,
            task_statuses(name, category)
          )
        ),
        task_dependencies_dependent:task_dependencies!dependent_task_id(
          id,
          type,
          blocking_task:tasks!blocking_task_id(
            id, 
            title,
            task_statuses(name, category)
          )
        ),
        parent_task:tasks!parent_task_id(id, title),
        subtasks:tasks!parent_task_id(
          id, 
          title, 
          status_id,
          task_statuses(name, category)
        ),
        equipe_responsavel:equipe!equipe_responsavel_id(
          id, 
          nome, 
          tipo_equipe
        ),
        colaborador_responsavel:colaborador!colaborador_responsavel_id(
          id,
          funcao,
          profiles(id, name, email)
        ),
        created_by_colaborador:colaborador!created_by(
          id,
          funcao,
          profiles(id, name, email)
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Tarefa não encontrada' },
          { status: 404 }
        )
      }
      console.error('Erro ao buscar tarefa:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar tarefa', details: error.message },
        { status: 500 }
      )
    }

    // Processar estatísticas da tarefa
    const taskAssignees = data.task_assignees as Array<Record<string, unknown>> || []
    const taskComments = data.task_comments as Array<Record<string, unknown>> || []
    const subtasks = data.subtasks as Array<Record<string, unknown>> || []
    const dependencies = [
      ...(data.task_dependencies_blocking as Array<Record<string, unknown>> || []),
      ...(data.task_dependencies_dependent as Array<Record<string, unknown>> || [])
    ]

    const totalEstimatedTime = taskAssignees.reduce((acc: number, ta: Record<string, unknown>) => 
      acc + (Number(ta.tempo_estimado) || 0), 0
    )
    
    const totalSpentTime = taskAssignees.reduce((acc: number, ta: Record<string, unknown>) => 
      acc + (Number(ta.tempo_gasto) || 0), 0
    )

    const completedSubtasks = subtasks.filter((subtask: Record<string, unknown>) => {
      const taskStatus = subtask.task_statuses as Record<string, unknown>
      return taskStatus?.category === 'DONE'
    }).length

    const taskWithStats = {
      ...data,
      estatisticas: {
        total_assignees: taskAssignees.length,
        total_comments: taskComments.length,
        total_subtasks: subtasks.length,
        completed_subtasks: completedSubtasks,
        subtasks_progress: subtasks.length > 0 ? Math.round((completedSubtasks / subtasks.length) * 100) : 0,
        total_dependencies: dependencies.length,
        estimated_hours: Math.round(totalEstimatedTime / 60),
        spent_hours: Math.round(totalSpentTime / 60),
        time_efficiency: totalEstimatedTime > 0 ? Math.round((totalEstimatedTime / totalSpentTime) * 100) : 0
      }
    }

    return NextResponse.json(taskWithStats)

  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/supabase/tarefas/[id] - Atualizar tarefa
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id } = params
    const body = await request.json()

    // Verificar se a tarefa existe
    const { data: existingTask } = await supabase
      .from('tasks')
      .select('id, project_id, slug')
      .eq('id', id)
      .single()

    if (!existingTask) {
      return NextResponse.json(
        { error: 'Tarefa não encontrada' },
        { status: 404 }
      )
    }

    // Se está atualizando o slug, verificar se não existe outra tarefa com o mesmo slug no projeto
    if (body.slug && body.slug !== existingTask.slug) {
      const { data: slugExists } = await supabase
        .from('tasks')
        .select('id')
        .eq('slug', body.slug)
        .eq('project_id', existingTask.project_id)
        .neq('id', id)
        .single()

      if (slugExists) {
        return NextResponse.json(
          { error: 'Slug já existe neste projeto' },
          { status: 409 }
        )
      }
    }

    // Se está marcando como concluída, definir completed_at
    if (body.status_id) {
      const { data: status } = await supabase
        .from('task_statuses')
        .select('category')
        .eq('id', body.status_id)
        .single()

      if (status?.category === 'DONE' && !body.completed_at) {
        body.completed_at = new Date().toISOString()
      } else if (status?.category !== 'DONE') {
        body.completed_at = null
      }
    }

    const { data, error } = await supabase
      .from('tasks')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        task_statuses(id, name, category, color),
        projects(id, name, slug)
      `)
      .single()

    if (error) {
      console.error('Erro ao atualizar tarefa:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar tarefa', details: error.message },
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

// DELETE /api/supabase/tarefas/[id] - Arquivar tarefa
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id } = params

    // Verificar se a tarefa existe
    const { data: existingTask } = await supabase
      .from('tasks')
      .select('id')
      .eq('id', id)
      .single()

    if (!existingTask) {
      return NextResponse.json(
        { error: 'Tarefa não encontrada' },
        { status: 404 }
      )
    }

    // Soft delete - marcar como arquivada
    const { data, error } = await supabase
      .from('tasks')
      .update({
        archived: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao arquivar tarefa:', error)
      return NextResponse.json(
        { error: 'Erro ao arquivar tarefa', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Tarefa arquivada com sucesso', data })

  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
