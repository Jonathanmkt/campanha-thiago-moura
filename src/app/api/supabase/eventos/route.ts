import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { Tables, TablesInsert } from '@/types';

type Evento = Tables<'evento'>;
type EventoInsert = TablesInsert<'evento'>;

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

// GET /api/supabase/eventos - Listar eventos com paginação e filtros
export async function GET(request: NextRequest): Promise<NextResponse<PaginatedResponse<Evento>>> {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    // Parâmetros de paginação
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;
    
    // Parâmetros de filtro
    const search = searchParams.get('search');
    const areaId = searchParams.get('area_id');
    const tipoEvento = searchParams.get('tipo_evento');
    const responsavelId = searchParams.get('responsavel_id');
    const dataInicio = searchParams.get('data_inicio');
    const dataFim = searchParams.get('data_fim');
    const ativo = searchParams.get('ativo');
    
    // Parâmetros de ordenação
    const sortBy = searchParams.get('sort_by') || 'data_inicio';
    const sortOrder = searchParams.get('sort_order') || 'desc';
    
    // Construir query
    let query = supabase
      .from('evento')
      .select('*', { count: 'exact' });
    
    // Aplicar filtros
    if (search) {
      query = query.or(`titulo.ilike.%${search}%,descricao.ilike.%${search}%,local.ilike.%${search}%`);
    }
    
    if (areaId) {
      query = query.eq('area_id', areaId);
    }
    
    if (tipoEvento) {
      query = query.eq('tipo_evento', tipoEvento);
    }
    
    if (responsavelId) {
      query = query.eq('responsavel_id', responsavelId);
    }
    
    if (dataInicio) {
      query = query.gte('data_inicio', dataInicio);
    }
    
    if (dataFim) {
      query = query.lte('data_fim', dataFim);
    }
    
    if (ativo !== null) {
      query = query.eq('ativo', ativo === 'true');
    }
    
    // Aplicar ordenação
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    
    // Aplicar paginação
    query = query.range(offset, offset + limit - 1);
    
    const { data, error, count } = await query;
    
    if (error) {
      return NextResponse.json({
        data: null,
        error: error.message,
        success: false,
        count: 0,
        page,
        limit,
        totalPages: 0
      }, { status: 400 });
    }
    
    const totalPages = Math.ceil((count || 0) / limit);
    
    return NextResponse.json({
      data: data as Evento[],
      error: null,
      success: true,
      count: count || 0,
      page,
      limit,
      totalPages
    });
    
  } catch (error) {
    return NextResponse.json({
      data: null,
      error: error instanceof Error ? error.message : 'Erro interno do servidor',
      success: false,
      count: 0,
      page: 1,
      limit: 10,
      totalPages: 0
    }, { status: 500 });
  }
}

// POST /api/supabase/eventos - Criar novo evento
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Evento>>> {
  try {
    const supabase = await createClient();
    const body: EventoInsert = await request.json();
    
    const { data, error } = await supabase
      .from('evento')
      .insert([body])
      .select()
      .single();
    
    if (error) {
      return NextResponse.json({
        data: null,
        error: error.message,
        success: false
      }, { status: 400 });
    }
    
    return NextResponse.json({
      data: data as Evento,
      error: null,
      success: true
    }, { status: 201 });
    
  } catch (error) {
    return NextResponse.json({
      data: null,
      error: error instanceof Error ? error.message : 'Erro interno do servidor',
      success: false
    }, { status: 500 });
  }
}
