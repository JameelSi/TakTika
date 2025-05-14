import React, { useState } from 'react';
import { useGameStore } from '../game/state/gameStore';

const FactionSelector = ({ onSelect }) => {
  const { factions } = useGameStore();
  const [selectedFaction, setSelectedFaction] = useState(null);
  
  const handleSelect = (faction) => {
    setSelectedFaction(faction.id);
    onSelect(faction.id);
  };
  
  return (
    <div className="space-y-4">
      {factions.map((faction) => (
        <div 
          key={faction.id}
          className={`p-3 border rounded-lg cursor-pointer transition-all ${
            selectedFaction === faction.id 
              ? `border-[${faction.color}] bg-${faction.color}/10 shadow-md` 
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => handleSelect(faction)}
        >
          <div className="flex items-center">
            <div
              className="w-12 h-12 rounded-full mr-4 flex items-center justify-center"
              style={{ backgroundColor: faction.color }}
            >
              <span className="text-white text-xl font-bold">{faction.name.charAt(0)}</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">{faction.name}</h3>
              <p className="text-sm text-gray-600">{faction.description}</p>
            </div>
          </div>
          
          <div className="mt-2">
            <h4 className="text-sm font-semibold">Special Abilities:</h4>
            <ul className="text-xs text-gray-700 mt-1 ml-4 list-disc">
              {faction.abilities.map((ability, index) => (
                <li key={index}>{ability}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FactionSelector;