import React, { useState } from 'react';
import { useDiscord } from '../discord/DiscordProvider';
import { useGameStore } from '../game/state/gameStore';
import ClanSelector from './ClanSelector';
import { PlusCircle,Crown,Bug } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import maps from '../game/data/maps-data.json'
import Carousel from 'react-bootstrap/Carousel';


const Lobby = () => {
  
  const navigate = useNavigate();
  const { voiceParticipants, currentUser } = useDiscord();
  const { selectClan, players } = useGameStore();
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
  const colorsMap = ['bg-orange-500', 'bg-red-700', 'bg-yellow-400','bg-green-500','bg-lime-200','bg-cyan-400','bg-blue-700','bg-rose-400'];
  const currentMap = maps[currentIndex];

  const handleSelect = (selectedIndex) => {
    setCurrentIndex(selectedIndex);
  };

  const handleClanSelect = (clanId) => {
    selectClan(currentUser.id, clanId);
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
  

  const readyPlayerCount = Object.values(players).filter(player => player.clan).length;
  const allPlayersReady = readyPlayerCount === voiceParticipants.length && readyPlayerCount >= 2;
  
  return (


    <div className="min-h-screen bg-day-theme grid grid-rows-[auto_auto_auto] md:grid-cols-4 gap-4 p-4 pb-0 ">      

      {/* Players Section */}
      <aside className="bg-gray-900 rounded-2xl shadow p-8 flex flex-col min-h-0 md:row-span-2 md:col-span-1 overflow-auto  custom-scrollbar">
        <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
          Players Online
        </h2>
              
        <div className="flex-1 overflow-y-auto space-y-2">
          {voiceParticipants.length === 1 ? (
            <p> Waiting for players to join .... </p>
          ) : (
            voiceParticipants.map((participant, i) => {
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
                  <div className="relative w-10 h-10">
                    <img
                      src={
                        participant.avatar
                          ? `https://cdn.discordapp.com/avatars/${participant.id}/${participant.avatar}.png`
                          : 'assets/default_avatar.png'
                      }
                      alt="Avatar"
                      className="w-10 h-10 rounded-full"
                    />
                    {isHost &&<Crown size={18} className="absolute -top-1 -right-1 text-yellow-400 drop-shadow"/>}
                  </div>
                    {/* Name + status */}
                    <div className="flex flex-col ">
                      <span className="text-white truncate max-w-48 font-bold">{participant.global_name}</span>
                      <span
                        className={`text-xs mt-1 px-2 py-0.5 rounded-full w-fit  ${
                          isReady
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-400/30 text-yellow-400 '
                        }`}
                      >
                        {isReady ? 'Ready!' : 'Selecting...'}
                      </span>
                    </div>
                  </div>
                  {isHost && <div className="px-2 bg-ice text-xs text-yellow-600 rounded-full font-semibold">Host</div>}
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
      <section className="bg-gray-900 rounded-2xl shadow p-4 flex flex-col lg:flex-row overflow-auto space-y-4 lg:space-y-0 lg:space-x-4 min-h-0 md:col-span-3 overflow-auto max-h-screen custom-scrollbar">

        {/* Map gallery */}
        <div className="flex-1 flex flex-col items-center justify-between ">
          <h2 className="text-2xl font-bold mb-4 text-white">Select Battlefield</h2>
            <div className="w-full max-w-xl relative">
          <Carousel activeIndex={currentIndex} onSelect={handleSelect} interval={null}>
            {maps.map((map, index) => (
              <Carousel.Item key={index} >
                <img
                  className="w-full max-h-96 object-contain mx-auto mb-4 rounded-lg"
                  src={map.imageUrl}
                  alt={map.name}
                />
              </Carousel.Item>
            ))}
          </Carousel>
          </div>
          <h3 className="text-white text-xl font-bold">{currentMap.name}</h3>
          <p className="text-gray-400 text-sm max-w-sm">{currentMap.description}</p>

        </div>
      

        {/* Game mode & Class */}
      <div className="w-full lg:w-1/3 bg-gray-600 rounded-lg p-4 flex flex-col space-y-4">
          <div>
            <h3 className="mb-2 text-2xl font-boldtext-white">Game mode</h3>
            <div className="max-h-24 overflow-y-auto space-y-1">
                <button className="block w-full text-left p-2 border rounded">Solo Slide</button>
                <button className="block w-full text-left p-2 border rounded"> Twin Slides </button>
            </div>
          </div>

          <div className="flex-1">
            <h3 className="mb-2 text-2xl font-boldtext-white">Select Your Clan</h3>
            <div className="max-h-24 space-y-1">
                  <ClanSelector onSelect={handleClanSelect} />
            </div>
          </div>
        </div>
      </section>

      {/* Chat & Start */}
      <div className="bg-gray-900 p-4 flex flex-col space-y-4 shadow-inner min-h-0 md:col-start-2 md:col-span-3 rounded-2xl">
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 flex-1 min-h-0">

          {/* Chat box */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* <div ref={chatRef} className="flex-1 bg-gray-50 rounded-lg p-2 overflow-y-auto">
              {messages.map((m, i) => (
                <div key={i} className="text-sm mb-1">
                  <span className="font-semibold">{m.user}: </span>{m.text}
                </div>
              ))}
            </div>
            <div className="mt-2 flex space-x-2">
              {chatButtons.map((btn) => (
                <button key={btn} onClick={() => handleChat(btn)} className="px-3 py-1 bg-blue-500 text-white rounded">
                  {btn}
                </button>
              ))}
            </div> */}
          </div>

          {/* Waiting status */}
          <div className="w-full md:w-1/4 bg-gray-50 rounded-lg flex items-center justify-center">

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
                  ? 'Select a clan to ready up' 
                  : voiceParticipants.length < 2 
                    ? 'Need at least 2 players to start' 
                    : 'Waiting for other players to ready up'}
              </p>
          </div>
        </div>
      </div>

         {/* Anchor nav */}
      <footer className="absolute bottom-0 text-xs text-gray-900 mt-4 w-full z-10 bg-[#e4f1fe] px-4 pb-2 border-t border-black ">
 
        <div className="flex flex-col md:flex-row justify-between items-center pt-2 px-4 space-y-2 md:space-y-0 ">
          <div className="text-left w-full md:w-1/3">made with ❤️ by Jimmy</div>
          <div className="flex justify-center w-full md:w-1/3 space-x-4">
            {["FAQ", "Privacy", "About","Report a 🪲"].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:text-white transition duration-200"
              >
                {item}
              </a>
            ))}
          </div>
          {/* Right */}
          <div className="text-right w-full md:w-1/3 text-gray-500">V1.0</div>
        </div>
      </footer>
          
    </div>
  );
};

export default Lobby;