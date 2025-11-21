import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { Tables } from '@/types';

type Eleitor = Tables<'eleitor'>;

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// GET /api/supabase/liderancas/[id]/eleitores - Buscar eleitores relacionados a uma liderança
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<Eleitor[]>>> {
  try {
    const supabase = await createClient();
    const liderancaId = params.id;

    // Buscar eleitores relacionados à liderança
    const { data, error } = await supabase
      .from('lideranca_eleitor')
      .select(`
        eleitor:eleitor_id (
          id,
          nome_completo,
          nome_popular,
          cpf,
          telefone,
          email,
          foto_url,
          profissao,
          bairro,
          nivel_apoio,
          intencao_voto
        ),
        tipo_relacao,
        nivel_proximidade
      `)
      .eq('lideranca_id', liderancaId)
      .eq('ativo', true)
      .order('nivel_proximidade', { ascending: false });

    if (error) {
      return NextResponse.json({
        data: null,
        error: error.message,
        success: false
      }, { status: 400 });
    }

    // Transformar os dados para incluir informações da relação
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const eleitoresComRelacao = data.map((item: any) => ({
      ...item.eleitor,
      tipo_relacao: item.tipo_relacao,
      nivel_proximidade: item.nivel_proximidade
    }));

    return NextResponse.json({
      data: eleitoresComRelacao,
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
