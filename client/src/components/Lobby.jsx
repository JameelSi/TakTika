import React, { useState } from 'react';
import { useDiscord } from '../discord/DiscordProvider';
import { useGameStore } from '../game/state/gameStore';
import FactionSelector from './FactionSelector';
import { CaretRight, CaretLeft,PlusCircle  } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import maps from '../game/data/maps-data.json'
import { Carousel } from 'flowbite-react';


const Lobby = () => {
  
  const navigate = useNavigate();
  const { voiceParticipants, currentUser } = useDiscord();
  const { selectFaction, players } = useGameStore();
  const [selectedMap, setSelectedMap] = useState('standard');
  const [isReady, setIsReady] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const localPlayers =  [
    { id: 1, avatar: '',global_name: "jimmy one two three four five six seven eight nine ten" },
    { id: 2, avatar: '',global_name: "jimmy2" },
    { id: 3, avatar: '',global_name: "jimmy3" },
        { id: 4, avatar: '',global_name: "jimmy3" },
            { id: 5, avatar: '',global_name: "jimmy3" },


    ];
  const colorsMap = ['bg-orange-500', 'bg-red-600', 'bg-yellow-400','bg-green-500','bg-lime-200','bg-cyan-400','bg-blue-700','bg-rose-400'];
  const currentMap = maps[currentIndex];
  
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

  const handleStartGame = () => {
    navigate('/game');
  };
  

  const readyPlayerCount = Object.values(players).filter(player => player.faction).length;
  const allPlayersReady = readyPlayerCount === voiceParticipants.length && readyPlayerCount >= 2;
  
  return (


    <div className="min-h-screen bg-day-theme grid grid-rows-[auto_auto_auto] md:grid-cols-4 gap-4 p-4">      

      {/* Players Section */}
      <aside className="bg-gray-900 rounded-2xl shadow p-8 flex flex-col min-h-0 md:row-span-2 md:col-span-1 overflow-auto">
        <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
          Players Online
        </h2>
              
        <div className="flex-1 overflow-y-auto space-y-2">
          {voiceParticipants.length === 1 ? (
            <p> Waiting for players to join .... </p>
          ) : (
            localPlayers.map((participant, i) => {
              const playerData = players[participant.id];
              const isHost = i === 0;
              return (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-4 bg-gray-900  rounded-lg border border-white/2 hover:border-white/20 transition-all"
                >
                  {/* Left section: number, avatar, name + status */}
                  <div className="flex items-center space-x-4">


                    {/* Avatar */}
                    <img
                      src={
                        participant.avatar
                          ? `https://cdn.discordapp.com/avatars/${participant.id}/${participant.avatar}.png`
                          : 'assets/default_avatar.png'
                      }
                      alt="Avatar"
                      className="w-10 h-10 rounded-full"
                    />

                    {/* Name + status */}
                    <div className="flex flex-col ">
                      <span className="text-white truncate max-w-48">{participant.global_name}</span>
                      <span
                        className={`text-xs mt-1 px-2 py-0.5 rounded-full border w-fit ${
                          isReady
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                        }`}
                      >
                        {isReady ? 'Ready' : 'Selecting...'}
                      </span>
                    </div>
                  </div>
                  {isHost && <div className="text-xs text-red-400">Host</div>}
                    <div className={`w-6 h-6 flex items-center justify-center rounded-full ${colorsMap[i]} text-white text-xs font-semibold`}>
                      {i + 1}
                    </div>
                </div>
              );
            })
          )}
          <button className="w-full mt-4 py-2 bg-gray-900 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center gap-x-2">
            <PlusCircle size={32}/>
             ADD BOT
            </button>
        </div>
        <button className="mt-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">Change color</button>
      </aside>
            

      {/* Game Settings */}
      <section className="bg-gray-900 rounded-lg shadow p-4 flex flex-col lg:flex-row overflow-auto space-y-4 lg:space-y-0 lg:space-x-4 min-h-0 md:col-span-3">

        {/* Map gallery */}
        <div className="flex-1 flex flex-col justify-between">
          <h2 className="text-2xl font-bold mb-4 text-white">Select Battlefield</h2>
          <div className="flex flex-row items-center justify-between">
            <Carousel>
              <img 
                src={currentMap.imageUrl} 
                alt={currentMap.name} 
                className="w-full max-h-80 object-contain mx-auto mb-4 rounded-lg"
              />
              <h3 className="text-white text-xl font-bold">{currentMap.name}</h3>
              <p className="text-gray-400 text-sm">{currentMap.description}</p>
            </Carousel>

            {/* <button
              onClick={handlePrev}
              className="text-7xl hover:text-orange-400 transition text-white"
              aria-label="Previous"
            >
              <CaretLeft size={40} />
            </button>

            <div className="flex-1 text-center">
              <img 
                src={currentMap.imageUrl} 
                alt={currentMap.name} 
                className="w-full max-h-80 object-contain mx-auto mb-4 rounded-lg"
              />
              <h3 className="text-white text-xl font-bold">{currentMap.name}</h3>
              <p className="text-gray-400 text-sm">{currentMap.description}</p>
            </div>

            <button
              onClick={handleNext}
              className="text-7xl hover:text-orange-400 transition text-white"
              aria-label="Next"
            > 
            <CaretRight size={40} />
            </button> */}
        </div>

        </div>
      </section>

          
          
          {/* <div className="bg-[#32333a] rounded-xl p-6 shadow-inner">
            <h2 className="text-2xl font-bold mb-4 text-white">Choose Your Faction</h2>
            <FactionSelector onSelect={handleFactionSelect} />
            
            <div className="mt-8">
              <button
                onClick={handleStartGame}
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
          </div> */}
          
    </div>
  );
};

export default Lobby;