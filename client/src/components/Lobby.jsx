import React, { useState } from 'react';
import { useDiscord } from '../discord/DiscordProvider';
import { useGameStore } from '../game/state/gameStore';
import FactionSelector from './FactionSelector';
import penguin from '../game/assets/penguin.jpg';
import penguin2 from '../game/assets/penguin2.jpg';


const Lobby = ({ onStartGame }) => {
  const { voiceParticipants, currentUser } = useDiscord();
  const { selectFaction, players, setMapId } = useGameStore();
  const [selectedMap, setSelectedMap] = useState('standard');
  const [isReady, setIsReady] = useState(false);
  
  const maps = [
    { id: 'standard', name: 'Standard Map', description: 'Balanced map with varied terrain', imageUrl: penguin },
    { id: 'forest', name: 'Forest Map', description: 'Dense vegetation favors stealth tactics', imageUrl: penguin2 },
    { id: 'desert', name: 'Desert Map', description: 'Open terrain with limited resources', imageUrl: penguin },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMap = maps[currentIndex];
  
  const handleMapChange = (e) => {
    setSelectedMap(currentMap);
    setMapId(currentMap.id);
  };
  
  const handleFactionSelect = (factionId) => {
    selectFaction(currentUser.id, factionId);
    setIsReady(true);
  };
    const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + maps.length) % maps.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % maps.length);
  };
  const readyPlayerCount = Object.values(players).filter(player => player.faction).length;
  const allPlayersReady = readyPlayerCount === voiceParticipants.length && readyPlayerCount >= 2;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#87ceeb] to-[#e4f1fe] flex items-center justify-center p-4">

      <div className="max-w-7xl w-full bg-[#5C4033]/10 backdrop-blur-3xl rounded-2xl shadow-xl border border-white/10 p-8">
        <div className="text-center mb-10">
        <h1 className="text-6xl font-bold mb-1 text-[#5C4033]">
            TakTika
          </h1>
          <h2 className="text-white">Strategic Conquest Awaits</h2>
        </div>
        
        <div className="grid lg:grid-cols-2  gap-6">
          {/* Left Column - Players & Map Selection */}
          <div className="grid grid-cols-subgrid gap-6">
            <div className="bg-[#32333a] rounded-xl p-6 shadow-inner">
              <h2 className="text-2xl font-bold mb-4 text-white flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Players Online
              </h2>
              
              <div>
                {voiceParticipants.length === 0 ? (
                  <p className="text-gray-400 italic">Waiting for players to join...</p>
                ) : (
                  voiceParticipants.map((participant) => {
                    const playerData = players[participant.id];
                    return (
                      <div 
                        key={participant.id}
                        className="flex items-center justify-between p-4 bg-[#3a3b44] rounded-lg border border-white/5 transition-all hover:border-white/20"
                      >
                        <div className="flex items-center space-x-3">
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
                          <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full border border-green-500/30">
                            Ready
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full border border-yellow-500/30">
                            Selecting...
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            
            <div className=" bg-[#32333a] p-6 rounded-xl shadow-inner">
              <h2 className="text-2xl font-bold mb-4 text-white">Select Battlefield</h2>

              {/* Gallery Content */}
              <div className="flex items-center justify-between space-x-4">
                {/* Left Arrow */}
                <button
                  onClick={handlePrev}
                  className="text-7xl hover:text-orange-400 transition text-white"
                  aria-label="Previous"
                >
                  {'<'}
                </button>

                {/* Map Display */}
                <div className="flex-1 text-center">
                  {/* Replace src with your map image URL */}
                  <img 
                    src={currentMap.imageUrl} 
                    alt={currentMap.name} 
                    className="w-full max-h-64 object-contain mx-auto mb-4 rounded-lg"
                  />
                  <h3 className="text-white text-xl font-bold">{currentMap.name}</h3>
                  <p className="text-gray-400 text-sm">{currentMap.description}</p>
                </div>

                {/* Right Arrow */}
              <button
                onClick={handleNext}
                className="text-7xl hover:text-orange-400 transition text-white"
                aria-label="Next"
              > 
                {'>'}
              </button>
              </div>
            </div>
          </div>
          
          {/* Right Column - Faction Selection */}
          <div className="bg-[#32333a] rounded-xl p-6 shadow-inner">
            <h2 className="text-2xl font-bold mb-4 text-white">Choose Your Faction</h2>
            <FactionSelector onSelect={handleFactionSelect} />
            
            <div className="mt-8">
              <button
                onClick={onStartGame}
                disabled={allPlayersReady}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                  allPlayersReady
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 transform hover:scale-[1.02]'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {allPlayersReady 
                  ? 'Start Game' 
                  : `Waiting for players (${readyPlayerCount}/${voiceParticipants.length})`}
              </button>
              
              <p className="mt-3 text-sm text-center text-gray-400">
                {!isReady 
                  ? 'Select a faction to ready up' 
                  : voiceParticipants.length < 2 
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