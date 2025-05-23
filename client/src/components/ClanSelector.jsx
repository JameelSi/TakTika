import React, { useState } from 'react';
import clans from '../game/data/clans.json';

const ClanSelector = ({ onSelect }) => {
  
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
            data-tooltip-id="clan-tooltip"
            data-tooltip-place="top"
            data-tooltip-html={`
              <div>
                <strong>${clan.description}</strong><br/>
                <em>Abilities:</em>
                <ul style="margin-left: 1rem; margin-top: 0.25rem;">
                  ${clan.abilities.map((a) => `<li>•&nbsp;${a}</li>`).join('')}
                </ul>
              </div>
            `}
            className={`block p-3 rounded-lg border-2 cursor-pointer transition-all relative ${
              selectedClan === clan.id
                ? 'border-orange-500 bg-orange-500/10'
                : 'border hover:border-white/30'
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
                <h3 className="text-white font-semibold">•&nbsp;&nbsp;{clan.name}</h3>
              </div>

              {selectedClan === clan.id && (
                <div className="text-orange-500">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
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