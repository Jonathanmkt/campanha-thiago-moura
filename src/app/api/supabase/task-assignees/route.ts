import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/supabase/task-assignees - Listar atribuições de tarefas
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const taskId = searchParams.get('task_id')
    const colaboradorId = searchParams.get('colaborador_id')
    const papel = searchParams.get('papel_na_tarefa')
    const ativo = searchParams.get('ativo') !== 'false'
    
    let query = supabase
      .from('task_assignees')
      .select(`
        *,
        tasks(id, title, priority),
        colaborador(id, funcao, ativo)
      `)
      .eq('ativo', ativo)
      .order('created_at', { ascending: false })

    if (taskId) {
      query = query.eq('task_id', taskId)
    }
    
    if (colaboradorId) {
      query = query.eq('colaborador_id', colaboradorId)
    }

    if (papel) {
      query = query.eq('papel_na_tarefa', papel)
    }

    const { data, error } = await query

    if (error) {
      console.error('Erro ao buscar atribuições:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar atribuições', details: error.message },
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

// POST /api/supabase/task-assignees - Atribuir tarefa a colaborador
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Validações básicas
    if (!body.task_id || !body.colaborador_id) {
      return NextResponse.json(
        { error: 'task_id e colaborador_id são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se a tarefa existe
    const { data: task } = await supabase
      .from('tasks')
      .select('id')
      .eq('id', body.task_id)
      .single()

    if (!task) {
      return NextResponse.json(
        { error: 'Tarefa não encontrada' },
        { status: 404 }
      )
    }

    // Verificar se o colaborador existe
    const { data: colaborador } = await supabase
      .from('colaborador')
      .select('id')
      .eq('id', body.colaborador_id)
      .single()

    if (!colaborador) {
      return NextResponse.json(
        { error: 'Colaborador não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se a atribuição já existe
    const { data: existingAssignment } = await supabase
      .from('task_assignees')
      .select('id')
      .eq('task_id', body.task_id)
      .eq('colaborador_id', body.colaborador_id)
      .single()

    if (existingAssignment) {
      return NextResponse.json(
        { error: 'Colaborador já está atribuído a esta tarefa' },
        { status: 409 }
      )
    }

    const { data, error } = await supabase
      .from('task_assignees')
      .insert([{
        ...body,
        papel_na_tarefa: body.papel_na_tarefa || 'executor',
        data_atribuicao: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select(`
        *,
        tasks(id, title, priority),
        colaborador(id, funcao)
      `)
      .single()

    if (error) {
      console.error('Erro ao atribuir tarefa:', error)
      return NextResponse.json(
        { error: 'Erro ao atribuir tarefa', details: error.message },
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

// PUT /api/supabase/task-assignees - Atualizar atribuição
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID da atribuição é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se a atribuição existe
    const { data: existingAssignment } = await supabase
      .from('task_assignees')
      .select('id')
      .eq('id', id)
      .single()

    if (!existingAssignment) {
      return NextResponse.json(
        { error: 'Atribuição não encontrada' },
        { status: 404 }
      )
    }

    const { data, error } = await supabase
      .from('task_assignees')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        tasks(id, title, priority),
        colaborador(id, funcao)
      `)
      .single()

    if (error) {
      console.error('Erro ao atualizar atribuição:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar atribuição', details: error.message },
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
