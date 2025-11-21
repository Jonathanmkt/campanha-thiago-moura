import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { Tables, TablesUpdate } from '@/types';

type Eleitor = Tables<'eleitor'>;
type EleitorUpdate = TablesUpdate<'eleitor'>;

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

// GET /api/supabase/eleitores/[id] - Buscar eleitor por ID
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<Eleitor>>> {
  try {
    const supabase = await createClient();
    const { id } = params;
    
    const { data, error } = await supabase
      .from('eleitor')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          data: null,
          error: 'Eleitor não encontrado',
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
      data: data as Eleitor,
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

// PUT /api/supabase/eleitores/[id] - Atualizar eleitor
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<Eleitor>>> {
  try {
    const supabase = await createClient();
    const { id } = params;
    const body: EleitorUpdate = await request.json();
    
    const { data, error } = await supabase
      .from('eleitor')
      .update(body)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          data: null,
          error: 'Eleitor não encontrado',
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
      data: data as Eleitor,
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

// DELETE /api/supabase/eleitores/[id] - Deletar eleitor
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<boolean>>> {
  try {
    const supabase = await createClient();
    const { id } = params;
    
    const { error } = await supabase
      .from('eleitor')
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
