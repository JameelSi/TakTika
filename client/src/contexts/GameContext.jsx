import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDiscord } from '../discord/DiscordProvider';
import { initSocket } from '../socket';
import { clansData } from '../game/data/clans';
import { eventsData } from '../game/data/events';
import { createInitialTerritories } from '../game/utils/mapUtils';
import geoMap from '../game/data/standard-map.json';

const GameContext = createContext(null);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const { currentUser } = useDiscord();
  const [gameState, setGameState] = useState({
    initialized: false,
    gameId: null,
    socket: null,
    currentUser: null,
    mapId: 'geojson',
    map: null,
    clans: clansData,
    eventTypes: eventsData,
    currentTurn: 1,
    currentPlayerId: null,
    timeOfDay: 'day',
    players: {},
    territories: [],
    resources: {},
  });

  const parseTerritoriesFromGeoJSON = (geojson) => {
    return geojson.features.map((feature) => ({
      id: feature.properties.id,
      name: feature.properties.name,
      center: feature.properties.center,
      connections: feature.properties.connections,
      continent: feature.properties.continent,
      ownerId: null,
      value: Math.floor(Math.random() * 6) + 1,
      color: feature.properties.color || '#999999',
    }));
  };

  const initialize = (socket, user) => {
    if (gameState.initialized) return;

    const map = geoMap; // Could switch to dynamic later
    const territories = parseTerritoriesFromGeoJSON(map);

    setGameState(prev => ({
      ...prev,
      initialized: true,
      socket,
      currentUser: user,
      map,
      territories,
      currentPlayerId: user.id,
    }));

    socket.on('game:update', (gameData) => {
      setGameState(prev => ({ ...prev, ...gameData }));
    });

    socket.on('game:turn', (turnData) => {
      setGameState(prev => ({
        ...prev,
        currentTurn: turnData.turn,
        currentPlayerId: turnData.playerId,
      }));
    });

    socket.emit('game:join', { userId: user.id, username: user.username });
  };

  const setMapId = (mapId) => {
    const map = geoMap; // Hardcoded for now; expandable
    const territories = parseTerritoriesFromGeoJSON(map);
    setGameState(prev => ({ ...prev, mapId, map, territories }));
  };

  const selectClan = (playerId, clanId) => {
    const clan = gameState.clans.find(f => f.id === clanId);
    if (!clan) return;

    const updatedPlayers = {
      ...gameState.players,
      [playerId]: {
        id: playerId,
        name: currentUser?.username || 'Player',
        clan: clanId,
        color: clan.color,
      }
    };

    const updatedResources = {
      ...gameState.resources,
      [playerId]: {
        food: 10,
        workers: 5,
      }
    };

    setGameState(prev => ({
      ...prev,
      players: updatedPlayers,
      resources: updatedResources,
    }));

    gameState.socket?.emit('game:selectClan', { playerId, clanId });
  };

  const endTurn = () => {
    const { currentTurn, players, currentPlayerId } = gameState;
    const playerIds = Object.keys(players);
    const currentPlayerIndex = playerIds.indexOf(currentPlayerId);
    const nextPlayerIndex = (currentPlayerIndex + 1) % playerIds.length;
    const nextPlayerId = playerIds[nextPlayerIndex];
    const newTurn = nextPlayerIndex === 0 ? currentTurn + 1 : currentTurn;

    setGameState(prev => ({
      ...prev,
      currentTurn: newTurn,
      currentPlayerId: nextPlayerId,
    }));

    gameState.socket?.emit('game:endTurn', { nextPlayerId, newTurn });
  };

  const toggleTimeOfDay = () => {
    const newTimeOfDay = gameState.timeOfDay === 'day' ? 'night' : 'day';
    setGameState(prev => ({ ...prev, timeOfDay: newTimeOfDay }));
    gameState.socket?.emit('game:toggleTime', { timeOfDay: newTimeOfDay });
  };

  const value = {
    ...gameState,
    initialize,
    selectClan,
    setMapId,
    endTurn,
    toggleTimeOfDay,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};
