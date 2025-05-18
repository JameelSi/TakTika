import React, { useState } from 'react';
import { useGameStore } from '../game/state/gameStore';

const ClanSelector = ({ onSelect }) => {
  const { clans } = useGameStore();
  const [selectedClan, setSelectedClan] = useState(null);
  
  const handleSelect = (clan) => {
    setSelectedClan(clan.id);
    onSelect(clan.id);
  };
  
  return (
    <div className="space-y-3">
      {clans.map((clan) => (
        <label
          key={clan.id}
          className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
            selectedClan === clan.id
              ? 'border-orange-500 bg-orange-500/10' 
              : 'border rounded hover:border-white/30'
          }`}
        >
          <input
            type="radio"
            name="clan"
            value={clan.id}
            checked={selectedClan === clan.id}
            onChange={() => handleSelect(clan)}
            className="hidden"
          />

          <div className="flex justify-between items-center">

            <div className="flex-1">
              <h3 className="text-white font-semibold">{clan.name}</h3>
              <p className="text-sm text-gray-400">{clan.description}</p>
              <div className="mt-2">
                <h4 className="text-sm font-semibold">Special Abilities:</h4>
                <ul className="text-xs text-gray-700 mt-1 ml-4 list-disc">
                  {clan.abilities.map((ability, index) => (
                    <li key={index}>{ability}</li>
                  ))}
                </ul>
              </div>
            </div>

            {selectedClan === clan.id && (
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
  );
};

export default ClanSelector;