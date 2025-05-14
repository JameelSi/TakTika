import React, { useState } from 'react';
import { useDiscord } from '../discord/DiscordProvider';
import { useGameStore } from '../game/state/gameStore';
import FactionSelector from './FactionSelector';

const Lobby = ({ onStartGame }) => {
  const { voiceParticipants, currentUser } = useDiscord();
  const { selectFaction, players, setMapId } = useGameStore();
  const [selectedMap, setSelectedMap] = useState('standard');
  const [isReady, setIsReady] = useState(false);
  
  const maps = [
    { id: 'standard', name: 'Standard Map', description: 'Balanced map with varied terrain' },
    { id: 'forest', name: 'Forest Map', description: 'Dense vegetation favors stealth tactics' },
    { id: 'desert', name: 'Desert Map', description: 'Open terrain with limited resources' },
  ];
  
  const handleMapChange = (e) => {
    setSelectedMap(e.target.value);
    setMapId(e.target.value);
  };
  
  const handleFactionSelect = (factionId) => {
    selectFaction(currentUser.id, factionId);
    setIsReady(true);
  };
  
  const readyPlayerCount = Object.values(players).filter(player => player.faction).length;
  const allPlayersReady = readyPlayerCount === voiceParticipants.length && readyPlayerCount >= 2;
  
  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-xl p-6">
        <h1 className="text-4xl font-bold mb-6 text-center text-[#8B4513]">
          Tak<span className="text-[#3A5311]">Tika</span>
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-[#2C1810]">Players</h2>
              <div className="bg-[#FFF8E1] rounded-lg p-4 min-h-[200px]">
              {voiceParticipants.length === 0 ? (
                <p className="text-gray-500 italic">No players in voice channel</p>
              ) : (
                <ul className="space-y-3">
                  {voiceParticipants.map((participant) => {
                    const playerData = players[participant.id];
                    return (
                      <li 
                        key={participant.id} 
                        className="flex items-center justify-between p-2 bg-white rounded-md shadow-sm"
                      >
                        <div className="flex items-center">
                                                    <img
                            src={
                              currentUser.avatar
                                ? `https://cdn.discordapp.com/avatars/${participant.id}/${participant.avatar}.png`
                                : `https://cdn.discordapp.com/embed/avatars/${parseInt(participant.discriminator) % 5}.png`
                            }
                            alt="Avatar"
                            className="w-8 h-8 rounded-full mr-3"
                          />
                          <span>{participant.global_name}</span>
                        </div>
                        
                        
                        {playerData?.faction ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Ready
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            Selecting...
                          </span>
                          )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4 text-[#2C1810]">Select Map</h2>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedMap}
                onChange={handleMapChange}
              >
                {maps.map((map) => (
                  <option key={map.id} value={map.id}>
                    {map.name}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-sm text-gray-600">
                {maps.find(m => m.id === selectedMap)?.description}
              </p>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4 text-[#2C1810]">Select Your Faction</h2>
            <FactionSelector onSelect={handleFactionSelect} />
            
            <div className="mt-8 text-center">
              <button
                onClick={onStartGame}
                disabled={allPlayersReady}
                className={`btn ${allPlayersReady ? 'btn-accent' : 'btn-disabled'} w-full py-3 text-lg`}
              >
                {allPlayersReady 
                  ? 'Start Game' 
                  : `Waiting for players (${readyPlayerCount}/1)`}
              </button>
              
              <p className="mt-2 text-sm text-gray-600">
                {!isReady 
                  ? 'Select a faction to ready up' 
                  : readyPlayerCount < 2 
                    ? 'Need at least 2 players to start' 
                    : 'Waiting for other players to ready up'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lobby;