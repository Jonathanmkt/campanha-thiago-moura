import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
  try {
    // Por enquanto, retorna todas as lideranças para testes
    // Em produção, filtrar pelo coordenador logado
    const { data, error } = await supabase
      .from('lideranca')
      .select('*')
      .order('nome_completo', { ascending: true })
      .limit(100);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro ao buscar lideranças:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      nome_completo,
      nome_popular,
      telefone,
      email,
      tipo_lideranca,
      nivel_influencia,
      observacoes,
      // Campos de endereço (novos)
      endereco_formatado,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      cep,
      latitude,
      longitude,
    } = body;

    if (!nome_completo?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Nome é obrigatório' },
        { status: 400 }
      );
    }

    if (!tipo_lideranca) {
      return NextResponse.json(
        { success: false, error: 'Tipo de liderança é obrigatório' },
        { status: 400 }
      );
    }

    // Criar a liderança com todos os campos de endereço
    const { data: lideranca, error: liderancaError } = await supabase
      .from('lideranca')
      .insert({
        nome_completo: nome_completo.trim(),
        nome_popular: nome_popular?.trim() || null,
        telefone: telefone?.trim() || null,
        email: email?.trim() || null,
        tipo_lideranca,
        nivel_influencia: nivel_influencia || 3,
        observacoes: observacoes?.trim() || null,
        status: 'ativo',
        ativo: true,
        // Campos de endereço
        endereco_formatado: endereco_formatado?.trim() || null,
        logradouro: logradouro?.trim() || null,
        numero: numero?.trim() || null,
        complemento: complemento?.trim() || null,
        bairro: bairro?.trim() || null,
        cidade: cidade?.trim() || null,
        estado: estado?.trim() || null,
        cep: cep?.trim() || null,
        latitude: latitude || null,
        longitude: longitude || null,
      })
      .select()
      .single();

    if (liderancaError) {
      console.error('Erro ao criar liderança:', liderancaError);
      return NextResponse.json(
        { success: false, error: liderancaError.message },
        { status: 500 }
      );
    }

    // TODO: Em produção, vincular ao coordenador logado via coordenador_regional_id

    return NextResponse.json({ success: true, data: lideranca });
  } catch (error) {
    console.error('Erro ao criar liderança:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
