import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { Tables } from '@/types';

type Departamento = Tables<'departamento'>;

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// GET /api/supabase/departamentos - Listar departamentos
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<Departamento[]>>> {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    // Parâmetros de filtro
    const ativo = searchParams.get('ativo');
    const tipo = searchParams.get('tipo_departamento');
    const nivel = searchParams.get('nivel_hierarquico');
    
    // Construir query
    let query = supabase
      .from('departamento')
      .select('*')
      .order('nivel_hierarquico', { ascending: true })
      .order('nome', { ascending: true });
    
    // Aplicar filtros
    if (ativo !== null) {
      query = query.eq('ativo', ativo === 'true');
    }
    
    if (tipo) {
      query = query.eq('tipo_departamento', tipo);
    }
    
    if (nivel) {
      query = query.eq('nivel_hierarquico', parseInt(nivel));
    }
    
    const { data, error } = await query;
    
    if (error) {
      return NextResponse.json({
        data: null,
        error: error.message,
        success: false
      }, { status: 400 });
    }
    
    return NextResponse.json({
      data: data as Departamento[],
      error: null,
      success: true
    });
    
  } catch (error) {
    return NextResponse.json({
      data: null,
      error: error instanceof Error ? error.message : 'Erro interno do servidor',
      success: false
    }, { status: 500 });
  }
}
