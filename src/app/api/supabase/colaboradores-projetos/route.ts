import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/supabase/colaboradores-projetos - Listar colaboradores disponíveis para projetos
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const projectId = searchParams.get('project_id')
    const equipeId = searchParams.get('equipe_id')
    const search = searchParams.get('search')
    const nivelAcesso = searchParams.get('nivel_acesso')
    const podeGerenciarTarefas = searchParams.get('pode_gerenciar_tarefas') === 'true'
    const ativo = searchParams.get('ativo') !== 'false' // default true
    
    let query = supabase
      .from('colaborador')
      .select('*')
      .eq('ativo', ativo)
      .order('id', { ascending: false })

    // Filtros básicos apenas
    if (search) {
      query = query.ilike('funcao', `%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Erro ao buscar colaboradores:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar colaboradores', details: error.message },
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

// PUT /api/supabase/colaboradores-projetos - Atualizar configurações de projeto do colaborador
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { colaborador_id, ...updateData } = body

    if (!colaborador_id) {
      return NextResponse.json(
        { error: 'colaborador_id é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se colaborador existe
    const { data: colaborador } = await supabase
      .from('colaborador')
      .select('id')
      .eq('id', colaborador_id)
      .single()

    if (!colaborador) {
      return NextResponse.json(
        { error: 'Colaborador não encontrado' },
        { status: 404 }
      )
    }

    // Atualizar apenas campos relacionados a projetos
    const allowedFields = [
      'nivel_acesso_projetos',
      'pode_criar_projetos', 
      'pode_gerenciar_tarefas',
      'notificacoes_projetos'
    ]

    const filteredData = Object.keys(updateData)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateData[key]
        return obj
      }, {} as Record<string, unknown>)

    if (Object.keys(filteredData).length === 0) {
      return NextResponse.json(
        { error: 'Nenhum campo válido para atualização' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('colaborador')
      .update({
        ...filteredData,
        data_atualizacao: new Date().toISOString()
      })
      .eq('id', colaborador_id)
      .select(`
        *,
        profile:profiles(id, name, email)
      `)
      .single()

    if (error) {
      console.error('Erro ao atualizar colaborador:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar colaborador', details: error.message },
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
