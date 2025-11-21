import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/supabase/projeto-equipes - Listar relacionamentos projeto-equipe
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const projectId = searchParams.get('projeto_id')
    const equipeId = searchParams.get('equipe_id')
    const papel = searchParams.get('papel')
    const ativo = searchParams.get('ativo') !== 'false' // default true
    
    let query = supabase
      .from('projeto_equipe')
      .select(`
        *,
        projects(id, name, slug),
        equipe(id, nome, tipo_equipe)
      `)
      .eq('ativo', ativo)
      .order('created_at', { ascending: false })

    if (projectId) {
      query = query.eq('projeto_id', projectId)
    }
    
    if (equipeId) {
      query = query.eq('equipe_id', equipeId)
    }

    if (papel) {
      query = query.eq('papel', papel)
    }

    const { data, error } = await query

    if (error) {
      console.error('Erro ao buscar projeto-equipes:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar projeto-equipes', details: error.message },
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

// POST /api/supabase/projeto-equipes - Vincular equipe ao projeto
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Validações básicas
    if (!body.projeto_id || !body.equipe_id) {
      return NextResponse.json(
        { error: 'projeto_id e equipe_id são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se o relacionamento já existe
    const { data: existing } = await supabase
      .from('projeto_equipe')
      .select('id')
      .eq('projeto_id', body.projeto_id)
      .eq('equipe_id', body.equipe_id)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Equipe já está vinculada a este projeto' },
        { status: 409 }
      )
    }

    // Verificar se projeto existe
    const { data: project } = await supabase
      .from('projects')
      .select('id')
      .eq('id', body.projeto_id)
      .single()

    if (!project) {
      return NextResponse.json(
        { error: 'Projeto não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se equipe existe
    const { data: equipe } = await supabase
      .from('equipe')
      .select('id')
      .eq('id', body.equipe_id)
      .single()

    if (!equipe) {
      return NextResponse.json(
        { error: 'Equipe não encontrada' },
        { status: 404 }
      )
    }

    const { data, error } = await supabase
      .from('projeto_equipe')
      .insert([{
        ...body,
        data_inicio: body.data_inicio || new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select(`
        *,
        projeto:projects(id, name, slug),
        equipe:equipe(id, nome, tipo_equipe, especialidade)
      `)
      .single()

    if (error) {
      console.error('Erro ao vincular equipe ao projeto:', error)
      return NextResponse.json(
        { error: 'Erro ao vincular equipe ao projeto', details: error.message },
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
