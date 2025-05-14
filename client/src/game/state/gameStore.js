import { create } from 'zustand';
import { factionsData } from '../data/factions';
import { eventsData } from '../data/events';
import { createInitialTerritories } from '../utils/mapUtils';
import geoMap from '../assets/standard-map.json';

export const useGameStore = create((set, get) => ({
  // Game state
  initialized: false,
  gameId: null,
  socket: null,
  currentUser: null,
  
  // Game settings
  mapId: 'geojson', // This can be updated to a dynamic value later
  map: geoMap, // Load the custom map (GeoJSON)
  factions: factionsData,
  eventTypes: eventsData,
  
  // Game progress
  currentTurn: 1,
  currentPlayerId: null,
  timeOfDay: 'day',
  players: {},
  territories: [],
  resources: {},
  
  // Initialize the game
  initialize: (socket, user) => {
    if (get().initialized) return;
    
    const map = geoMap; // Load the custom map directly for now
    const territories = createInitialTerritories(map);
    
    set({
      initialized: true,
      socket,
      currentUser: user,
      map,
      territories,
      currentPlayerId: user.id, // For testing, in reality this would be set by the server
    });
    
    // Set up socket listeners
    socket.on('game:update', (gameData) => {
      set(gameData);
    });
    
    socket.on('game:turn', (turnData) => {
      set({
        currentTurn: turnData.turn,
        currentPlayerId: turnData.playerId,
      });
    });
    
    // Emit join game event
    socket.emit('game:join', { userId: user.id, username: user.username });
  },
  
  // Player actions
  selectFaction: (playerId, factionId) => {
    const faction = get().factions.find(f => f.id === factionId);
    if (!faction) return;
    
    const updatedPlayers = {
      ...get().players,
      [playerId]: {
        id: playerId,
        name: get().currentUser?.username || 'Player',
        faction: factionId,
        color: faction.color,
      }
    };
    
    // Initialize resources for this player
    const updatedResources = {
      ...get().resources,
      [playerId]: {
        food: 10,
        workers: 5,
      }
    };
    
    set({ players: updatedPlayers, resources: updatedResources });
    
    // Notify server
    get().socket?.emit('game:selectFaction', { 
      playerId, 
      factionId 
    });
  },
  
  // Map actions
  setMapId: (mapId) => {
    const map = geoMap; // Use geoMap directly since you're not using dynamic map imports
    set({ mapId, map });
    
    // Reload territories for the new map
    const territories = createInitialTerritories(map);
    set({ territories });
  },
  
  // Game flow actions
  endTurn: () => {
    const { currentTurn, players, currentPlayerId } = get();
    
    // Find next player
    const playerIds = Object.keys(players);
    const currentPlayerIndex = playerIds.indexOf(currentPlayerId);
    const nextPlayerIndex = (currentPlayerIndex + 1) % playerIds.length;
    const nextPlayerId = playerIds[nextPlayerIndex];
    
    // If we've gone through all players, advance the turn
    const newTurn = nextPlayerIndex === 0 ? currentTurn + 1 : currentTurn;
    
    set({
      currentTurn: newTurn,
      currentPlayerId: nextPlayerId,
    });
    
    // Notify server
    get().socket?.emit('game:endTurn', { 
      nextPlayerId, 
      newTurn 
    });
  },
  
  toggleTimeOfDay: () => {
    const newTimeOfDay = get().timeOfDay === 'day' ? 'night' : 'day';
    set({ timeOfDay: newTimeOfDay });
    
    // Notify server
    get().socket?.emit('game:toggleTime', { 
      timeOfDay: newTimeOfDay 
    });
  },
  
  // Territory actions
  claimTerritory: (territoryId, playerId) => {
    const territories = get().territories.map(t => 
      t.id === territoryId ? { ...t, ownerId: playerId } : t
    );
    
    set({ territories });
    
    // Notify server
    get().socket?.emit('game:claimTerritory', { 
      territoryId, 
      playerId 
    });
  },
  
  resolveTerritoryCombat: (territoryId, winnerId) => {
    const territories = get().territories.map(t => 
      t.id === territoryId ? { ...t, ownerId: winnerId } : t
    );
    
    set({ territories });
    
    // Notify server
    get().socket?.emit('game:resolveTerritoryCombat', { 
      territoryId, 
      winnerId 
    });
  },
  
  // Resource actions
  updateResources: (playerId, resourceUpdates) => {
    const currentResources = get().resources[playerId] || { food: 0, workers: 0 };
    const updatedResources = {
      ...get().resources,
      [playerId]: {
        ...currentResources,
        ...resourceUpdates,
      }
    };
    
    set({ resources: updatedResources });
    
    // Notify server
    get().socket?.emit('game:updateResources', { 
      playerId, 
      resources: updatedResources[playerId] 
    });
  },
}));
