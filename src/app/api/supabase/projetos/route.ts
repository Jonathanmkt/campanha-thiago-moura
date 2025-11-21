import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/supabase/projetos - Listar todos os projetos
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    // Parâmetros de query
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const archived = searchParams.get('archived') === 'true'
    const equipeId = searchParams.get('equipe_id')
    
    let query = supabase
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
        )
      `)
      .eq('archived', archived)
      .order('created_at', { ascending: false })

    // Filtros
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }
    
    if (status) {
      query = query.eq('status', status)
    }
    
    if (priority) {
      query = query.eq('priority', priority)
    }

    if (equipeId) {
      query = query.eq('projeto_equipe.equipe_id', equipeId)
    }

    // Paginação
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('Erro ao buscar projetos:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar projetos', details: error.message },
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

// POST /api/supabase/projetos - Criar novo projeto
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    const { equipes, ...projectData }: { equipes?: string[], [key: string]: unknown } = body

    // Validações básicas
    if (!projectData.name || !projectData.slug) {
      return NextResponse.json(
        { error: 'Nome e slug são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se o slug já existe
    const { data: existingProject } = await supabase
      .from('projects')
      .select('id')
      .eq('slug', projectData.slug)
      .single()

    if (existingProject) {
      return NextResponse.json(
        { error: 'Slug já existe' },
        { status: 409 }
      )
    }

    // Criar projeto
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert([{
        ...projectData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (projectError) {
      console.error('Erro ao criar projeto:', projectError)
      return NextResponse.json(
        { error: 'Erro ao criar projeto', details: projectError.message },
        { status: 500 }
      )
    }

    // Se foram especificadas equipes, criar os relacionamentos
    if (equipes && equipes.length > 0) {
      const projetoEquipeData = equipes.map(equipeId => ({
        projeto_id: project.id,
        equipe_id: equipeId,
        papel: 'colaboradora',
        data_inicio: new Date().toISOString().split('T')[0]
      }))

      const { error: equipeError } = await supabase
        .from('projeto_equipe')
        .insert(projetoEquipeData)

      if (equipeError) {
        console.error('Erro ao vincular equipes:', equipeError)
        // Não falha a criação do projeto, apenas loga o erro
      }
    }

    // Buscar projeto completo com relacionamentos
    const { data: fullProject } = await supabase
      .from('projects')
      .select(`
        *,
        projeto_equipe(
          id,
          papel,
          equipe:equipe(id, nome, tipo_equipe)
        )
      `)
      .eq('id', project.id)
      .single()

    return NextResponse.json(fullProject || project, { status: 201 })

  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
