import React from 'react';
import { useGameStore } from '../game/state/gameStore';

const GameControls = ({ onSpinWheel }) => {
  const { 
    currentTurn, 
    currentPlayerId, 
    endTurn, 
    timeOfDay, 
    toggleTimeOfDay,
    players
  } = useGameStore();
  
  const isCurrentPlayerTurn = currentPlayerId === Object.keys(players)[0]; // Simplified for MVP
  
  return (
    <div className="fixed bottom-4 right-4 z-10">
      <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-4 flex flex-col space-y-3">
        <div className="text-sm font-medium text-gray-600">
          <span>Turn: {currentTurn}</span>
          <span className="mx-2">•</span>
          <span className={timeOfDay === 'day' ? 'text-yellow-500' : 'text-indigo-700'}>
            {timeOfDay === 'day' ? '☀️ Day' : '🌙 Night'}
          </span>
        </div>
        
        <div className="flex space-x-2">
          <button 
            className="btn btn-primary text-sm py-1"
            onClick={toggleTimeOfDay}
          >
            Toggle Time
          </button>
          
          <button 
            className="btn btn-secondary text-sm py-1"
            onClick={onSpinWheel}
          >
            Spin Wheel
          </button>
          
          <button 
            className={`btn text-sm py-1 ${isCurrentPlayerTurn ? 'btn-accent' : 'btn-disabled'}`}
            onClick={endTurn}
            disabled={!isCurrentPlayerTurn}
          >
            End Turn
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameControls;