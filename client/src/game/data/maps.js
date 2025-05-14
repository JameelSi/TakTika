export const mapsData = [
  {
    id: 'standard',
    name: 'Standard Map',
    description: 'A balanced map with varied terrain',
    width: 1200,
    height: 800,
    regions: [
      { id: 'forest', name: 'Forest', resourceBonus: 'food', terrainEffect: 'cover' },
      { id: 'grassland', name: 'Grassland', resourceBonus: 'movement', terrainEffect: 'none' },
      { id: 'hills', name: 'Hills', resourceBonus: 'defense', terrainEffect: 'elevation' },
      { id: 'rocky', name: 'Rocky Land', resourceBonus: 'attack', terrainEffect: 'rough' },
      { id: 'wetland', name: 'Wetland', resourceBonus: 'food', terrainEffect: 'slow' }
    ],
    territories: [
      // These would contain actual territory data with coordinates, adjacencies, etc.
      // For the example, we'll populate with dummy data in the utility function
      { id: 't1', name: 'Northern Forest', region: 'forest', x: 100, y: 100, resource: 'food' },
      { id: 't2', name: 'Eastern Plains', region: 'grassland', x: 300, y: 100, resource: 'movement' },
      { id: 't3', name: 'Southern Hills', region: 'hills', x: 100, y: 300, resource: 'defense' },
      { id: 't4', name: 'Western Rocks', region: 'rocky', x: 300, y: 300, resource: 'attack' },
      { id: 't5', name: 'Central Wetland', region: 'wetland', x: 200, y: 200, resource: 'food' }
    ],
    startingPositions: [
      { id: 'p1', territoryId: 't1' },
      { id: 'p2', territoryId: 't4' },
      { id: 'p3', territoryId: 't3' },
      { id: 'p4', territoryId: 't2' }
    ]
  },
  {
    id: 'forest',
    name: 'Forest Map',
    description: 'Dense vegetation favors stealth tactics',
    width: 1000,
    height: 1000,
    regions: [
      { id: 'dense_forest', name: 'Dense Forest', resourceBonus: 'food', terrainEffect: 'cover' },
      { id: 'clearing', name: 'Clearing', resourceBonus: 'movement', terrainEffect: 'none' },
      { id: 'underbrush', name: 'Underbrush', resourceBonus: 'defense', terrainEffect: 'slow' }
    ],
    territories: [
      // Dummy data for example
      { id: 'f1', name: 'Tall Trees', region: 'dense_forest', x: 150, y: 150, resource: 'food' },
      { id: 'f2', name: 'Mushroom Grove', region: 'dense_forest', x: 350, y: 150, resource: 'food' },
      { id: 'f3', name: 'Sunlit Clearing', region: 'clearing', x: 150, y: 350, resource: 'movement' },
      { id: 'f4', name: 'Mossy Rocks', region: 'underbrush', x: 350, y: 350, resource: 'defense' }
    ],
    startingPositions: [
      { id: 'p1', territoryId: 'f1' },
      { id: 'p2', territoryId: 'f4' },
      { id: 'p3', territoryId: 'f2' },
      { id: 'p4', territoryId: 'f3' }
    ]
  },
  {
    id: 'desert',
    name: 'Desert Map',
    description: 'Open terrain with limited resources',
    width: 1400,
    height: 800,
    regions: [
      { id: 'dunes', name: 'Sand Dunes', resourceBonus: 'movement', terrainEffect: 'slow' },
      { id: 'oasis', name: 'Oasis', resourceBonus: 'food', terrainEffect: 'none' },
      { id: 'rocky_desert', name: 'Rocky Desert', resourceBonus: 'defense', terrainEffect: 'cover' }
    ],
    territories: [
      // Dummy data for example
      { id: 'd1', name: 'Shifting Sands', region: 'dunes', x: 200, y: 200, resource: 'movement' },
      { id: 'd2', name: 'Palm Haven', region: 'oasis', x: 400, y: 200, resource: 'food' },
      { id: 'd3', name: 'Cracked Earth', region: 'rocky_desert', x: 200, y: 400, resource: 'defense' },
      { id: 'd4', name: 'Hidden Spring', region: 'oasis', x: 400, y: 400, resource: 'food' }
    ],
    startingPositions: [
      { id: 'p1', territoryId: 'd1' },
      { id: 'p2', territoryId: 'd4' },
      { id: 'p3', territoryId: 'd2' },
      { id: 'p4', territoryId: 'd3' }
    ]
  }
];