import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/supabase/task-statuses - Listar status de tarefas
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const workflowId = searchParams.get('workflow_id')
    const category = searchParams.get('category')
    
    let query = supabase
      .from('task_statuses')
      .select(`
        *,
        workflows(id, name, is_default),
        tasks(count)
      `)
      .order('position', { ascending: true })

    if (workflowId) {
      query = query.eq('workflow_id', workflowId)
    }
    
    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) {
      console.error('Erro ao buscar status de tarefas:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar status de tarefas', details: error.message },
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

// POST /api/supabase/task-statuses - Criar novo status
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Validações básicas
    if (!body.name || !body.workflow_id || !body.category || !body.color) {
      return NextResponse.json(
        { error: 'Nome, workflow_id, category e color são obrigatórios' },
        { status: 400 }
      )
    }

    // Se não foi especificada uma posição, colocar no final
    if (!body.position) {
      const { data: lastStatus } = await supabase
        .from('task_statuses')
        .select('position')
        .eq('workflow_id', body.workflow_id)
        .order('position', { ascending: false })
        .limit(1)
        .single()

      body.position = (lastStatus?.position || 0) + 1
    }

    const { data, error } = await supabase
      .from('task_statuses')
      .insert([{
        ...body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select(`
        *,
        workflows(id, name, is_default)
      `)
      .single()

    if (error) {
      console.error('Erro ao criar status:', error)
      return NextResponse.json(
        { error: 'Erro ao criar status', details: error.message },
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
