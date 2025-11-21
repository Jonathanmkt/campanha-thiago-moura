require('dotenv').config();
const https = require('https');
const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Chave da API do Google Maps
const googleApiKey = process.env.GOOGLE_MAPS_SERVER_API_KEY;

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

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

async function getCoordinatesFromGoogle(bairro) {
  try {
    const address = `${bairro}, Araruama, RJ, Brasil`;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleApiKey}&region=br&components=administrative_area:Rio de Janeiro|country:BR`;
    
    console.log(`🔍 Buscando: ${address}`);
    
    const data = await makeRequest(url);
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const result = data.results[0];
      const location = result.geometry.location;
      
      // Verificar se realmente é em Araruama
      const isAraruama = result.formatted_address.includes('Araruama') || 
                        result.address_components.some(comp => 
                          comp.long_name === 'Araruama' && comp.types.includes('administrative_area_level_2')
                        );
      
      if (!isAraruama) {
        console.log(`⚠️  Resultado não é de Araruama: ${result.formatted_address}`);
        return { success: false, error: 'Resultado não é de Araruama' };
      }
      
      return {
        latitude: location.lat,
        longitude: location.lng,
        endereco_formatado: result.formatted_address,
        success: true
      };
    } else {
      console.error(`❌ Erro API para ${bairro}:`, data.status, data.error_message);
      return { success: false, error: data.error_message || data.status };
    }
  } catch (error) {
    console.error(`❌ Erro na requisição para ${bairro}:`, error.message);
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
      console.error(`❌ Erro ao atualizar ${bairro}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Erro ao atualizar ${bairro}:`, error.message);
    return false;
  }
}

async function fixAllCoordinates() {
  console.log('🚀 Iniciando correção das coordenadas dos bairros de Araruama-RJ...\n');
  
  if (!googleApiKey) {
    console.error('❌ GOOGLE_MAPS_SERVER_API_KEY não encontrada no .env');
    return;
  }
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variáveis do Supabase não encontradas no .env');
    return;
  }
  
  let sucessos = 0;
  let falhas = 0;
  
  for (const bairro of bairros) {
    console.log(`\n📍 Processando: ${bairro}`);
    
    const coordinates = await getCoordinatesFromGoogle(bairro);
    
    if (coordinates.success) {
      console.log(`   📌 Lat: ${coordinates.latitude}, Lng: ${coordinates.longitude}`);
      console.log(`   📍 Endereço: ${coordinates.endereco_formatado}`);
      
      const updated = await updateAreaCoordinates(bairro, coordinates);
      if (updated) {
        console.log(`   ✅ ${bairro} atualizado com sucesso`);
        sucessos++;
      } else {
        console.log(`   ❌ Falha ao atualizar ${bairro} no banco`);
        falhas++;
      }
    } else {
      console.log(`   ❌ Falha ao obter coordenadas: ${coordinates.error}`);
      falhas++;
    }
    
    // Aguardar 1 segundo entre requisições para evitar rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n🎉 Correção concluída!`);
  console.log(`✅ Sucessos: ${sucessos}`);
  console.log(`❌ Falhas: ${falhas}`);
}

// Executar o script
fixAllCoordinates().catch(console.error);
