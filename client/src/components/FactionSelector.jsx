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
  <div className="max-h-96 overflow-y-auto pr-1 custom-scrollbar">
    <div className="space-y-4">
      {factions.map((faction) => (
        <label
          key={faction.id}
          className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
            selectedFaction === faction.id
              ? 'border-orange-500 bg-orange-500/10' 
              : 'border-white/10 hover:border-white/30 bg-[#3a3b44]'
          }`}
        >
          <input
            type="radio"
            name="faction"
            value={faction.id}
            checked={selectedFaction === faction.id}
            onChange={() => handleSelect(faction)}
            className="hidden"
          />

          <div className="flex justify-between items-center">

            <div className="flex-1">
              <h3 className="text-white font-semibold">{faction.name}</h3>
              <p className="text-sm text-gray-400">{faction.description}</p>
              <div className="mt-2">
                <h4 className="text-sm font-semibold">Special Abilities:</h4>
                <ul className="text-xs text-gray-700 mt-1 ml-4 list-disc">
                  {faction.abilities.map((ability, index) => (
                    <li key={index}>{ability}</li>
                  ))}
                </ul>
              </div>
            </div>

            {selectedFaction === faction.id && (
                <div className="text-orange-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
            )}
          </div>
        </label>
      ))}
    </div>
  </div>
  );
};

export default FactionSelector;