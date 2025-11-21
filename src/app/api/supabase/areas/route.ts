import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { Tables, TablesInsert } from '@/types';

type Area = Tables<'area'>;
type AreaInsert = TablesInsert<'area'>;

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

// GET /api/supabase/areas - Listar áreas com paginação e filtros
export async function GET(request: NextRequest): Promise<NextResponse<PaginatedResponse<Area>>> {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    // Parâmetros de paginação
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;
    
    // Parâmetros de filtro
    const search = searchParams.get('search');
    const municipioId = searchParams.get('municipio_id');
    const tipo = searchParams.get('tipo');
    const ativo = searchParams.get('ativo');
    
    // Parâmetros de ordenação
    const sortBy = searchParams.get('sort_by') || 'nome';
    const sortOrder = searchParams.get('sort_order') || 'asc';
    
    // Usar função RPC para buscar áreas com contagem de lideranças
    // Para simplificar, vamos buscar todas as áreas e aplicar filtros/paginação no JS
    const { data: allAreas, error: areasError } = await supabase
      .from('area')
      .select('*')
      .eq('ativo', true);

    if (areasError) {
      throw areasError;
    }

    // Buscar contagem de lideranças para cada área
    const areasWithCount = await Promise.all(
      (allAreas || []).map(async (area) => {
        const { data: liderancasCount } = await supabase
          .from('lideranca_area')
          .select('id', { count: 'exact' })
          .eq('area_id', area.id)
          .eq('ativo', true);
        
        return {
          ...area,
          liderancas_count: liderancasCount?.length || 0
        };
      })
    );

    // Aplicar filtros
    let filteredAreas = areasWithCount;
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredAreas = filteredAreas.filter(area => 
        area.nome?.toLowerCase().includes(searchLower) ||
        area.codigo?.toLowerCase().includes(searchLower) ||
        area.descricao?.toLowerCase().includes(searchLower)
      );
    }
    
    if (municipioId) {
      filteredAreas = filteredAreas.filter(area => area.municipio_id === municipioId);
    }
    
    if (tipo) {
      filteredAreas = filteredAreas.filter(area => area.tipo === tipo);
    }
    
    // Aplicar ordenação
    filteredAreas.sort((a, b) => {
      const aVal = (a as any)[sortBy] || '';
      const bVal = (b as any)[sortBy] || '';
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    
    // Aplicar paginação
    const count = filteredAreas.length;
    const data = filteredAreas.slice(offset, offset + limit);
    
    const totalPages = Math.ceil(count / limit);
    
    return NextResponse.json({
      data: data as Area[],
      error: null,
      success: true,
      count,
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

// POST /api/supabase/areas - Criar nova área
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Area>>> {
  try {
    const supabase = await createClient();
    const body: AreaInsert = await request.json();
    
    const { data, error } = await supabase
      .from('area')
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
      data: data as Area,
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
