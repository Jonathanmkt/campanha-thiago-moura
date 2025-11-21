import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface LiderancaComRelacao {
  id: string;
  nome_completo: string;
  nome_popular: string | null;
  foto_url: string | null;
  tipo_lideranca: string;
  nivel_influencia: number;
  tipo_atuacao: string;
  nivel_influencia_area: number;
}

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// GET /api/supabase/areas/[id]/liderancas - Buscar lideranças de uma área
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<LiderancaComRelacao[]>>> {
  try {
    const supabase = await createClient();
    const areaId = params.id;

    if (!areaId) {
      return NextResponse.json({
        data: null,
        error: 'ID da área é obrigatório',
        success: false
      }, { status: 400 });
    }

    // Buscar lideranças relacionadas à área usando função RPC
    const { data, error } = await supabase
      .rpc('get_liderancas_by_area', { area_uuid: areaId });

    if (error) {
      return NextResponse.json({
        data: null,
        error: error.message,
        success: false
      }, { status: 400 });
    }

    // Os dados já vêm formatados da função RPC
    const liderancasComRelacao = data || [];

    return NextResponse.json({
      data: liderancasComRelacao,
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
