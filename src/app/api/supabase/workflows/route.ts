import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/supabase/workflows - Listar workflows
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const isDefault = searchParams.get('is_default') === 'true'
    
    let query = supabase
      .from('workflows')
      .select(`
        *,
        task_statuses(
          id,
          name,
          category,
          color,
          position
        )
      `)
      .order('created_at', { ascending: false })
    
    if (isDefault !== null) {
      query = query.eq('is_default', isDefault)
    }

    const { data, error } = await query

    if (error) {
      console.error('Erro ao buscar workflows:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar workflows', details: error.message },
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

// POST /api/supabase/workflows - Criar novo workflow
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Validações básicas
    if (!body.name) {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      )
    }

    // Se está marcando como padrão, desmarcar outros workflows padrão
    if (body.is_default) {
      await supabase
        .from('workflows')
        .update({ is_default: false })
        .eq('is_default', true)
    }

    const { data, error } = await supabase
      .from('workflows')
      .insert([{
        ...body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select('*')
      .single()

    if (error) {
      console.error('Erro ao criar workflow:', error)
      return NextResponse.json(
        { error: 'Erro ao criar workflow', details: error.message },
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
