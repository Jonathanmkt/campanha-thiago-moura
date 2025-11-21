import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/supabase/task-comments - Listar comentários
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const taskId = searchParams.get('task_id')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    let query = supabase
      .from('task_comments')
      .select(`
        *,
        tasks(id, title)
      `)
      .order('created_at', { ascending: true })

    if (taskId) {
      query = query.eq('task_id', taskId)
    }

    // Paginação
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('Erro ao buscar comentários:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar comentários', details: error.message },
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

// POST /api/supabase/task-comments - Criar novo comentário
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Validações básicas
    if (!body.content || !body.task_id || !body.author_id) {
      return NextResponse.json(
        { error: 'Conteúdo, task_id e author_id são obrigatórios' },
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

    // Se é uma resposta, verificar se o comentário pai existe
    if (body.parent_comment_id) {
      const { data: parentComment } = await supabase
        .from('task_comments')
        .select('id')
        .eq('id', body.parent_comment_id)
        .single()

      if (!parentComment) {
        return NextResponse.json(
          { error: 'Comentário pai não encontrado' },
          { status: 404 }
        )
      }
    }

    const { data, error } = await supabase
      .from('task_comments')
      .insert([{
        ...body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select(`
        *,
        author:colaborador!author_id(
          id,
          funcao,
          profiles(id, name, email)
        ),
        tasks(id, title)
      `)
      .single()

    if (error) {
      console.error('Erro ao criar comentário:', error)
      return NextResponse.json(
        { error: 'Erro ao criar comentário', details: error.message },
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
