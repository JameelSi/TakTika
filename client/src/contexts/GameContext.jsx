import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDiscord } from '../discord/DiscordProvider';
import { initSocket } from '../socket';
import { factionsData } from '../game/data/factions';
import { mapsData } from '../game/data/maps';
import { eventsData } from '../game/data/events';
import { createInitialTerritories } from '../game/utils/mapUtils';

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
    mapId: 'standard',
    map: null,
    factions: factionsData,
    eventTypes: eventsData,
    currentTurn: 1,
    currentPlayerId: null,
    timeOfDay: 'day',
    players: {},
    territories: [],
    resources: {},
  });

  const initialize = (socket, user) => {
    if (gameState.initialized) return;

    const mapId = gameState.mapId;
    const map = mapsData.find(m => m.id === mapId);
    const territories = createInitialTerritories(map);

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

  const selectFaction = (playerId, factionId) => {
    const faction = gameState.factions.find(f => f.id === factionId);
    if (!faction) return;

    const updatedPlayers = {
      ...gameState.players,
      [playerId]: {
        id: playerId,
        name: currentUser?.username || 'Player',
        faction: factionId,
        color: faction.color,
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

    gameState.socket?.emit('game:selectFaction', { playerId, factionId });
  };

  const setMapId = (mapId) => {
    const map = mapsData.find(m => m.id === mapId);
    if (!map) return;

    const territories = createInitialTerritories(map);
    setGameState(prev => ({ ...prev, mapId, map, territories }));
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
    selectFaction,
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