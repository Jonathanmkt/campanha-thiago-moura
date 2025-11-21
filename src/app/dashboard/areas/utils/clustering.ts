import { Area } from '../hooks/useAreas';

export interface ClusteredArea {
  id: string;
  latitude: number;
  longitude: number;
  areas: Area[];
  totalLiderancas: number;
  isCluster: boolean;
  clusterSize: number;
}

// Função para calcular distância entre dois pontos (fórmula de Haversine)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000; // Raio da Terra em metros
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distância em metros
}

// Função para determinar distância de clustering baseada no zoom
function getClusterDistance(zoomLevel: number): number {
  if (zoomLevel <= 12) return 1000; // 1km para vista regional
  if (zoomLevel <= 16) return 500;  // 500m para vista de bairro
  return 100; // 100m para vista detalhada
}

// Função principal de clustering
export function clusterAreas(areas: Area[], zoomLevel: number): ClusteredArea[] {
  if (!areas || areas.length === 0) return [];

  const clusters: ClusteredArea[] = [];
  const processed = new Set<string>();
  const clusterDistance = getClusterDistance(zoomLevel);

  // Debug: Iniciando clustering com ${areas.length} áreas, distância: ${clusterDistance}m, zoom: ${zoomLevel}

  areas.forEach(area => {
    if (processed.has(area.id)) return;

    const lat = parseFloat(area.latitude?.toString() || '0');
    const lng = parseFloat(area.longitude?.toString() || '0');

    if (isNaN(lat) || isNaN(lng)) return;

    // Criar cluster inicial com a área atual
    const cluster: ClusteredArea = {
      id: `cluster_${area.id}`,
      latitude: lat,
      longitude: lng,
      areas: [area],
      totalLiderancas: area.liderancas_count || 0,
      isCluster: false,
      clusterSize: 1
    };

    // Encontrar áreas próximas para agrupar
    areas.forEach(otherArea => {
      if (otherArea.id !== area.id && !processed.has(otherArea.id)) {
        const otherLat = parseFloat(otherArea.latitude?.toString() || '0');
        const otherLng = parseFloat(otherArea.longitude?.toString() || '0');

        if (isNaN(otherLat) || isNaN(otherLng)) return;

        const distance = calculateDistance(lat, lng, otherLat, otherLng);

        if (distance <= clusterDistance) {
          cluster.areas.push(otherArea);
          cluster.totalLiderancas += (otherArea.liderancas_count || 0);
          processed.add(otherArea.id);
        }
      }
    });

    // Marcar área principal como processada
    processed.add(area.id);

    // Atualizar propriedades do cluster
    cluster.isCluster = cluster.areas.length > 1;
    cluster.clusterSize = cluster.areas.length;

    // Se é um cluster, calcular posição média ponderada por número de lideranças
    if (cluster.isCluster) {
      let totalWeight = 0;
      let weightedLat = 0;
      let weightedLng = 0;

      cluster.areas.forEach(a => {
        const weight = (a.liderancas_count || 1); // Usar 1 como peso mínimo
        const aLat = parseFloat(a.latitude?.toString() || '0');
        const aLng = parseFloat(a.longitude?.toString() || '0');
        
        weightedLat += aLat * weight;
        weightedLng += aLng * weight;
        totalWeight += weight;
      });

      if (totalWeight > 0) {
        cluster.latitude = weightedLat / totalWeight;
        cluster.longitude = weightedLng / totalWeight;
      }
    }

    clusters.push(cluster);
  });

  // Debug: Clustering concluído

  return clusters;
}

// Função para obter cor do cluster baseada no tamanho
export function getClusterColor(clusterSize: number): string {
  if (clusterSize >= 10) return '#ef4444'; // Vermelho para clusters grandes
  if (clusterSize >= 5) return '#f59e0b';  // Laranja para clusters médios
  if (clusterSize >= 2) return '#3b82f6';  // Azul para clusters pequenos
  return '#10b981'; // Verde para áreas individuais
}

// Função para obter tamanho do marcador baseado no cluster
export function getClusterScale(clusterSize: number, zoomLevel: number): number {
  const baseScale = zoomLevel <= 12 ? 6 : zoomLevel <= 16 ? 8 : 10;
  
  if (clusterSize >= 20) return baseScale + 12;
  if (clusterSize >= 10) return baseScale + 8;
  if (clusterSize >= 5) return baseScale + 4;
  if (clusterSize >= 2) return baseScale + 2;
  return baseScale;
}

// Função para gerar conteúdo do InfoWindow
export function generateInfoWindowContent(cluster: ClusteredArea): string {
  if (cluster.isCluster) {
    // Conteúdo para clusters múltiplos
    const areasList = cluster.areas
      .slice(0, 10) // Limitar a 10 áreas para não sobrecarregar
      .map(area => `
        <div class="border-b border-gray-200 py-1 last:border-b-0">
          <span class="font-medium">${area.nome}</span>
          ${area.liderancas_count ? `<span class="text-sm text-gray-600 ml-2">(${area.liderancas_count} lideranças)</span>` : ''}
        </div>
      `).join('');

    const remainingCount = cluster.areas.length - 10;
    const remainingText = remainingCount > 0 ? 
      `<div class="text-sm text-gray-500 mt-2">+ ${remainingCount} áreas adicionais</div>` : '';

    return `
      <div class="p-3 max-w-sm max-h-64 overflow-y-auto">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-3 h-3 rounded-full bg-blue-500"></div>
          <h3 class="font-semibold text-lg">${cluster.areas.length} Áreas Agrupadas</h3>
        </div>
        <p class="text-sm text-gray-600 mb-3">
          <strong>Total de Lideranças:</strong> ${cluster.totalLiderancas}
        </p>
        <div class="space-y-1">
          ${areasList}
          ${remainingText}
        </div>
      </div>
    `;
  } else {
    // Conteúdo para área individual
    const area = cluster.areas[0];
    return `
      <div class="p-3 max-w-sm">
        <h3 class="font-semibold text-lg mb-2">${area.nome}</h3>
        <div class="space-y-1 text-sm">
          <p><strong>Endereço:</strong> ${area.endereco || area.descricao}</p>
          ${area.tipo ? `<p><strong>Tipo:</strong> ${area.tipo}</p>` : ''}
          ${area.cep ? `<p><strong>CEP:</strong> ${area.cep}</p>` : ''}
          ${area.liderancas_count ? `<p><strong>Lideranças:</strong> ${area.liderancas_count}</p>` : ''}
          ${area.populacao_estimada ? `<p><strong>População:</strong> ${area.populacao_estimada}</p>` : ''}
        </div>
      </div>
    `;
  }
}
