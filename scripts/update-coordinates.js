/**
 * Script para atualizar coordenadas de todas as áreas usando Google Geocoding API
 * Execute com: node scripts/update-coordinates.js
 */

const SUPABASE_URL = 'https://xkqtrwbnionpbjziilgy.supabase.co';
const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/update-coordinates`;

async function updateCoordinates() {
  console.log('🚀 Iniciando atualização de coordenadas...\n');
  
  try {
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrcXRyd2JuaW9ucGJqemlpbGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5MjU1NjIsImV4cCI6MjA0NjUwMTU2Mn0.VwQJBWJEfhYKJhKnGKJvCJJvCJJvCJJvCJJvCJJvCJI'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Atualização concluída com sucesso!\n');
      
      console.log('📊 RESUMO:');
      console.log(`   Total de áreas: ${result.summary.total_areas}`);
      console.log(`   Processadas: ${result.summary.processed}`);
      console.log(`   Sucessos: ${result.summary.success}`);
      console.log(`   Erros: ${result.summary.errors}\n`);
      
      if (result.results && result.results.length > 0) {
        console.log('📋 DETALHES POR ÁREA:');
        console.log(''.padEnd(80, '-'));
        
        result.results.forEach((area, index) => {
          const status = area.status === 'SUCCESS' ? '✅' : '❌';
          console.log(`${status} ${area.area_nome}`);
          console.log(`   Endereço: ${area.endereco_usado}`);
          
          if (area.status === 'SUCCESS') {
            console.log(`   Coordenadas antigas: ${area.latitude_antiga}, ${area.longitude_antiga}`);
            console.log(`   Coordenadas novas: ${area.latitude_nova}, ${area.longitude_nova}`);
          } else {
            console.log(`   Status: ${area.status}`);
          }
          
          if (index < result.results.length - 1) {
            console.log('');
          }
        });
      }
      
    } else {
      console.error('❌ Erro na atualização:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Erro ao executar script:', error.message);
  }
}

// Executar o script
updateCoordinates();
