import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/supabase/tarefas - Listar tarefas
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    // Parâmetros de query
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')
    const projectId = searchParams.get('project_id')
    const sprintId = searchParams.get('sprint_id')
    const statusId = searchParams.get('status_id')
    const priority = searchParams.get('priority')
    const type = searchParams.get('type')
    const colaboradorId = searchParams.get('colaborador_id')
    const equipeId = searchParams.get('equipe_id')
    const archived = searchParams.get('archived') === 'true'
    
    let query = supabase
      .from('tasks')
      .select(`
        *,
        task_statuses(id, name, category, color),
        projects(id, name, slug),
        sprints(id, name, status)
      `, { count: 'exact' })
      .eq('archived', archived)
      .order('created_at', { ascending: false })

    // Filtros
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }
    
    if (projectId) {
      query = query.eq('project_id', projectId)
    }
    
    if (sprintId) {
      query = query.eq('sprint_id', sprintId)
    }
    
    if (statusId) {
      query = query.eq('status_id', statusId)
    }
    
    if (priority) {
      query = query.eq('priority', priority)
    }
    
    if (type) {
      query = query.eq('type', type)
    }

    if (colaboradorId) {
      query = query.eq('task_assignees.colaborador_id', colaboradorId)
    }

    if (equipeId) {
      query = query.eq('equipe_responsavel_id', equipeId)
    }

    // Paginação
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('Erro ao buscar tarefas:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar tarefas', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/supabase/tarefas - Criar nova tarefa
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    const { 
      colaboradores, 
      equipe_responsavel_id,
      colaborador_responsavel_id,
      ...taskData 
    }: { 
      colaboradores?: string[], 
      equipe_responsavel_id?: string,
      colaborador_responsavel_id?: string,
      [key: string]: unknown 
    } = body

    // Validações básicas
    if (!taskData.title || !taskData.slug) {
      return NextResponse.json(
        { error: 'Título e slug são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se o slug já existe no projeto
    if (taskData.project_id) {
      const { data: existingTask } = await supabase
        .from('tasks')
        .select('id')
        .eq('slug', taskData.slug)
        .eq('project_id', taskData.project_id)
        .single()

      if (existingTask) {
        return NextResponse.json(
          { error: 'Slug já existe neste projeto' },
          { status: 409 }
        )
      }
    }

    // Gerar task_number automaticamente
    const { data: lastTask } = await supabase
      .from('tasks')
      .select('task_number')
      .eq('project_id', taskData.project_id)
      .order('task_number', { ascending: false })
      .limit(1)
      .single()

    const nextTaskNumber = (lastTask?.task_number || 0) + 1

    // Criar tarefa
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .insert([{
        ...taskData,
        task_number: nextTaskNumber,
        equipe_responsavel_id,
        colaborador_responsavel_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (taskError) {
      console.error('Erro ao criar tarefa:', taskError)
      return NextResponse.json(
        { error: 'Erro ao criar tarefa', details: taskError.message },
        { status: 500 }
      )
    }

    // Se foram especificados colaboradores, criar as atribuições
    if (colaboradores && colaboradores.length > 0) {
      const assigneeData = colaboradores.map(colaboradorId => ({
        task_id: task.id,
        colaborador_id: colaboradorId,
        papel_na_tarefa: 'executor',
        data_atribuicao: new Date().toISOString()
      }))

      const { error: assigneeError } = await supabase
        .from('task_assignees')
        .insert(assigneeData)

      if (assigneeError) {
        console.error('Erro ao atribuir colaboradores:', assigneeError)
        // Não falha a criação da tarefa, apenas loga o erro
      }
    }

    // Buscar tarefa completa com relacionamentos
    const { data: fullTask } = await supabase
      .from('tasks')
      .select(`
        *,
        task_statuses(id, name, category, color),
        projects(id, name, slug)
      `)
      .eq('id', task.id)
      .single()

    return NextResponse.json(fullTask || task, { status: 201 })

  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
