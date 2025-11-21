import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { Tables, TablesInsert } from '@/types';

type Eleitor = Tables<'eleitor'>;
type EleitorInsert = TablesInsert<'eleitor'>;

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

// GET /api/supabase/eleitores - Listar eleitores com paginação e filtros
export async function GET(request: NextRequest): Promise<NextResponse<PaginatedResponse<Eleitor>>> {
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
    const ativo = searchParams.get('ativo');
    
    // Parâmetros de ordenação
    const sortBy = searchParams.get('sort_by') || 'nome_completo';
    const sortOrder = searchParams.get('sort_order') || 'asc';
    
    // Construir query
    let query = supabase
      .from('eleitor')
      .select('*', { count: 'exact' });
    
    // Aplicar filtros
    if (search) {
      query = query.or(`nome_completo.ilike.%${search}%,cpf.ilike.%${search}%,email.ilike.%${search}%`);
    }
    
    if (areaId) {
      query = query.eq('area_id', areaId);
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
      data: data as Eleitor[],
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

// POST /api/supabase/eleitores - Criar novo eleitor
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Eleitor>>> {
  try {
    const supabase = await createClient();
    const body: EleitorInsert = await request.json();
    
    const { data, error } = await supabase
      .from('eleitor')
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
      data: data as Eleitor,
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
