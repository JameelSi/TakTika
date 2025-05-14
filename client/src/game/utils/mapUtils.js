const CONTINENT_COLORS = {
  northAmerica: 0x9B4F96,
  southAmerica: 0x00A651,
  europe: 0x0072BC,
  africa: 0xF7941D,
  asia: 0xED1C24,
  australia: 0x8DC63F
};

export const createInitialTerritories = (map) => {
  // Check if map and map.continents are properly defined
  if (!map || !map.continents || !Array.isArray(map.continents)) {
    console.error("Map or map.continents is not properly defined.", map);
    return []; // Return an empty array if there's an issue with the map data
  }

  const territories = [];
  map.continents.forEach(continent => {
    // Check if each continent has territories defined
    if (continent.territories && Array.isArray(continent.territories)) {
      continent.territories.forEach(territory => {
        territories.push({
          ...territory,
          continent: continent.id,
          value: Math.floor(Math.random() * 6) + 1,
          ownerId: null,
          color: CONTINENT_COLORS[continent.id]
        });
      });
    } else {
      console.warn(`Continent ${continent.id} has no territories or territories is not an array.`);
    }
  });

  return territories;
};

export const getAdjacentTerritories = (territoryId, allTerritories) => {
  const t = allTerritories.find(t => t.id === territoryId);
  if (!t) return [];
  return allTerritories.filter(n => t.connections.includes(n.id));
};

export const getTerritoriesByContinent = (continentId, allTerritories) =>
  allTerritories.filter(t => t.continent === continentId);

export const getTerritoriesByOwner = (ownerId, allTerritories) =>
  allTerritories.filter(t => t.ownerId === ownerId);
