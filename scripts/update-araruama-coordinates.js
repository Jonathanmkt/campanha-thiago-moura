const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://xkqtrwbnionpbjziilgy.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Lista dos bairros de Araruama-RJ
const bairros = [
  'Areal',
  'Bananeiras', 
  'Lake View',
  'Barbudo',
  'Coqueiral',
  'Boa Perna',
  'Centro',
  'Fazendinha',
  'Iguabinha',
  'Japão',
  'Jardim São Paulo',
  'Morro Grande',
  'Itatiquara',
  'Mutirão',
  'Outeiro',
  'Parque Mataruna',
  'Praça da Bandeira',
  'Praia Seca',
  'São Vicente',
  'Viaduto',
  'Vila Capri',
  'XV de Novembro'
];

async function getCoordinatesFromGoogle(bairro) {
  try {
    const address = `${bairro}, Araruama, RJ, Brasil`;
    const response = await fetch(`http://localhost:3000/api/geocode?address=${encodeURIComponent(address)}`);
    const data = await response.json();
    
    if (data.success && data.results && data.results.length > 0) {
      const result = data.results[0];
      const location = result.geometry.location;
      
      return {
        latitude: location.lat,
        longitude: location.lng,
        endereco_formatado: result.formatted_address,
        success: true
      };
    } else {
      console.error(`Erro ao buscar coordenadas para ${bairro}:`, data.error || 'Sem resultados');
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.error(`Erro na requisição para ${bairro}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function updateAreaCoordinates(bairro, coordinates) {
  try {
    const { data, error } = await supabase
      .from('area')
      .update({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        endereco_formatado: coordinates.endereco_formatado
      })
      .eq('nome', bairro)
      .eq('cidade', 'Araruama')
      .eq('tipo', 'bairro');

    if (error) {
      console.error(`Erro ao atualizar ${bairro}:`, error);
      return false;
    }
    
    console.log(`✅ ${bairro} atualizado com sucesso`);
    return true;
  } catch (error) {
    console.error(`Erro ao atualizar ${bairro}:`, error.message);
    return false;
  }
}

async function updateAllBairros() {
  console.log('🚀 Iniciando atualização das coordenadas dos bairros de Araruama-RJ...\n');
  
  for (const bairro of bairros) {
    console.log(`📍 Buscando coordenadas para: ${bairro}`);
    
    const coordinates = await getCoordinatesFromGoogle(bairro);
    
    if (coordinates.success) {
      console.log(`   Lat: ${coordinates.latitude}, Lng: ${coordinates.longitude}`);
      
      const updated = await updateAreaCoordinates(bairro, coordinates);
      if (updated) {
        console.log(`   ✅ ${bairro} atualizado com sucesso\n`);
      } else {
        console.log(`   ❌ Falha ao atualizar ${bairro}\n`);
      }
    } else {
      console.log(`   ❌ Falha ao obter coordenadas para ${bairro}: ${coordinates.error}\n`);
    }
    
    // Aguardar 1 segundo entre requisições para evitar rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('🎉 Atualização concluída!');
}

// Executar o script
updateAllBairros().catch(console.error);
