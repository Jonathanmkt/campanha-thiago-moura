import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/supabase/task-dependencies - Listar dependências de tarefas
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const taskId = searchParams.get('task_id')
    const type = searchParams.get('type')
    
    let query = supabase
      .from('task_dependencies')
      .select(`
        *,
        dependent_task:tasks!dependent_task_id(id, title, priority),
        blocking_task:tasks!blocking_task_id(id, title, priority)
      `)
      .order('created_at', { ascending: false })

    if (taskId) {
      query = query.or(`dependent_task_id.eq.${taskId},blocking_task_id.eq.${taskId}`)
    }
    
    if (type) {
      query = query.eq('type', type)
    }

    const { data, error } = await query

    if (error) {
      console.error('Erro ao buscar dependências:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar dependências', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })

  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/supabase/task-dependencies - Criar nova dependência
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Validações básicas
    if (!body.dependent_task_id || !body.blocking_task_id) {
      return NextResponse.json(
        { error: 'dependent_task_id e blocking_task_id são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se as tarefas existem
    const { data: dependentTask } = await supabase
      .from('tasks')
      .select('id')
      .eq('id', body.dependent_task_id)
      .single()

    const { data: blockingTask } = await supabase
      .from('tasks')
      .select('id')
      .eq('id', body.blocking_task_id)
      .single()

    if (!dependentTask || !blockingTask) {
      return NextResponse.json(
        { error: 'Uma ou ambas as tarefas não foram encontradas' },
        { status: 404 }
      )
    }

    // Verificar se a dependência já existe
    const { data: existingDependency } = await supabase
      .from('task_dependencies')
      .select('id')
      .eq('dependent_task_id', body.dependent_task_id)
      .eq('blocking_task_id', body.blocking_task_id)
      .single()

    if (existingDependency) {
      return NextResponse.json(
        { error: 'Dependência já existe entre essas tarefas' },
        { status: 409 }
      )
    }

    // Verificar dependência circular
    const { data: circularCheck } = await supabase
      .from('task_dependencies')
      .select('id')
      .eq('dependent_task_id', body.blocking_task_id)
      .eq('blocking_task_id', body.dependent_task_id)
      .single()

    if (circularCheck) {
      return NextResponse.json(
        { error: 'Dependência circular detectada' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('task_dependencies')
      .insert([{
        ...body,
        type: body.type || 'BLOCKS',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select(`
        *,
        dependent_task:tasks!dependent_task_id(id, title),
        blocking_task:tasks!blocking_task_id(id, title)
      `)
      .single()

    if (error) {
      console.error('Erro ao criar dependência:', error)
      return NextResponse.json(
        { error: 'Erro ao criar dependência', details: error.message },
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
