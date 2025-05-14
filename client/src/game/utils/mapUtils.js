// Utility functions for map handling

export const createInitialTerritories = (map) => {
  if (!map) return [];
  
  // For the MVP, we'll create a simplified grid of territories
  const territories = [];
  const spacing = 120;
  const offsetX = 50;
  const offsetY = 50;
  
  // Create a grid pattern
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      const regionTypes = map.regions.map(r => r.id);
      const regionIndex = Math.floor(Math.random() * regionTypes.length);
      const region = regionTypes[regionIndex];
      
      territories.push({
        id: `territory_${i}_${j}`,
        name: `Territory ${i}-${j}`,
        region,
        x: offsetX + i * spacing,
        y: offsetY + j * spacing,
        width: 100,
        height: 100,
        resource: Math.random() > 0.7 ? 'food' : 'workers',
        ownerId: null // Initially unowned
      });
    }
  }
  
  // Assign starting territories to players if needed
  // This would happen when actually joining the game
  
  return territories;
};

export const getAdjacentTerritories = (territoryId, allTerritories) => {
  // In a real implementation, this would use the territory adjacency data
  // For this MVP, we'll simulate adjacency based on positions
  
  const territory = allTerritories.find(t => t.id === territoryId);
  if (!territory) return [];
  
  // Consider territories adjacent if they're within a certain distance
  const adjacentDistance = 150;
  
  return allTerritories.filter(t => {
    if (t.id === territoryId) return false;
    
    const distance = Math.sqrt(
      Math.pow(t.x - territory.x, 2) + Math.pow(t.y - territory.y, 2)
    );
    
    return distance < adjacentDistance;
  });
};

export const getTerritoriesByRegion = (regionId, allTerritories) => {
  return allTerritories.filter(t => t.region === regionId);
};

export const getTerritoriesByOwner = (ownerId, allTerritories) => {
  return allTerritories.filter(t => t.ownerId === ownerId);
};