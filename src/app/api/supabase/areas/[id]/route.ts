import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { Tables, TablesUpdate } from '@/types';

type Area = Tables<'area'>;
type AreaUpdate = TablesUpdate<'area'>;

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/supabase/areas/[id] - Buscar área por ID
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<Area>>> {
  try {
    const supabase = await createClient();
    const { id } = params;
    
    const { data, error } = await supabase
      .from('area')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          data: null,
          error: 'Área não encontrada',
          success: false
        }, { status: 404 });
      }
      
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
    });
    
  } catch (error) {
    return NextResponse.json({
      data: null,
      error: error instanceof Error ? error.message : 'Erro interno do servidor',
      success: false
    }, { status: 500 });
  }
}

// PUT /api/supabase/areas/[id] - Atualizar área
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<Area>>> {
  try {
    const supabase = await createClient();
    const { id } = params;
    const body: AreaUpdate = await request.json();
    
    const { data, error } = await supabase
      .from('area')
      .update(body)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          data: null,
          error: 'Área não encontrada',
          success: false
        }, { status: 404 });
      }
      
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
    });
    
  } catch (error) {
    return NextResponse.json({
      data: null,
      error: error instanceof Error ? error.message : 'Erro interno do servidor',
      success: false
    }, { status: 500 });
  }
}

// DELETE /api/supabase/areas/[id] - Deletar área
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<boolean>>> {
  try {
    const supabase = await createClient();
    const { id } = params;
    
    const { error } = await supabase
      .from('area')
      .delete()
      .eq('id', id);
    
    if (error) {
      return NextResponse.json({
        data: null,
        error: error.message,
        success: false
      }, { status: 400 });
    }
    
    return NextResponse.json({
      data: true,
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
