import React from 'react';
import { useGameStore } from '../game/state/gameStore';
import { useDiscord } from '../discord/DiscordProvider';

const GameInfo = () => {
  const { players, currentPlayerId, resources } = useGameStore();
  const { currentUser } = useDiscord();
  
  const currentPlayer = players[currentPlayerId];
  const playerResources = resources[currentUser?.id] || { food: 0, workers: 0 };
  
  return (
    <div className="fixed top-4 left-4 z-10">
      <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-4">
        <h2 className="text-xl font-bold mb-2 flex items-center">
          <span 
            className="w-3 h-3 rounded-full mr-2" 
            style={{ backgroundColor: players[currentUser?.id]?.color || '#ccc' }}
          ></span>
          Your Colony
        </h2>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-amber-100 p-2 rounded">
            <span className="block text-xs text-gray-600">Food</span>
            <span className="font-bold">{playerResources.food}</span>
          </div>
          <div className="bg-blue-100 p-2 rounded">
            <span className="block text-xs text-gray-600">Workers</span>
            <span className="font-bold">{playerResources.workers}</span>
          </div>
        </div>
        
        {currentPlayer && (
          <div className="p-2 rounded bg-gray-100 text-sm">
            <p className="font-semibold">Current Turn</p>
            <div className="flex items-center mt-1">
              <span 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: currentPlayer.color }}
              ></span>
              <span>{currentPlayer.name}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameInfo;