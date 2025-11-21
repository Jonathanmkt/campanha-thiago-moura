import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const areaId = searchParams.get('area_id');

    if (!areaId) {
      return NextResponse.json(
        { error: 'area_id é obrigatório' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: pesquisas, error } = await supabase
      .from('pesquisa_quantitativa')
      .select('id, data_pesquisa, percentual, metodo_coleta, fonte')
      .eq('area_id', areaId)
      .order('data_pesquisa', { ascending: true });

    if (error) {
      console.error('Erro ao buscar pesquisas:', error);
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: pesquisas || [],
      count: pesquisas?.length || 0
    });

  } catch (error) {
    console.error('Erro no endpoint de pesquisas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
