import React, { useState,useEffect } from 'react';
import { useSession } from '../providers/SessionProvider';
import ClanSelector from './ClanSelector';
import { PlusCircle,Crown } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import maps from '../game/data/maps-data.json'
import Carousel from 'react-bootstrap/Carousel';
import Confetti from 'react-confetti';
import funFacts from '../game/data/funFacts.json'
import { getAvailableColors } from '../game/utils/colorManager';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';

const Lobby = () => {
  
  const navigate = useNavigate();
  const { sessionPlayers, currentPlayer,changePlayerColor,toggleReadyStatus } = useSession();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [factIndex, setFactIndex] = useState(0);
  const [showColors, setShowColors] = useState(false);
  const [showConfetti,setShowConfetti] = useState(false);
  const currentMap = maps[currentIndex];

  const readyPlayerCount = sessionPlayers.filter(p => p.isReady).length;
  const allPlayersReady = readyPlayerCount === sessionPlayers.length && readyPlayerCount >= 2;

  const toggleColors = () => setShowColors(!showColors);

  const addBot = () => {
    if (!currentPlayer?.isHost) return;
    const playersCount = sessionPlayers.length + 1
    const bot = {
      id: `bot-${Date.now()}`,
      username: `ChillBot-${Math.floor(Math.random() * 1000)}`,
      discriminator: '0000',
      avatar: 'assets/default_avatar.png',
      global_name: `ChillBot${playersCount}`,
      bot: true,
      isBot: true,
      isReady: true,
      isHost: false,
      color: assignColor(sessionPlayers),
      socketId: null,
    };
    sessionPlayers.push(bot)
  };

   const removeBot = (botId) => {
    if (!currentPlayer?.isHost) return;
    // sessionPlayers= sessionPlayers.filter(p => p.id !== botId)
  };
 
  const isMaxPlayers = () => {
    return sessionPlayers.length >= 6;
  }
 
  const changeColor = (color) => {
     changePlayerColor(color);
     setShowColors(false); // close the picker after selection
  };

  const handleSelect = (selectedIndex) => {
    setCurrentIndex(selectedIndex);
  };

  const handleClanSelect = (clanId) => {
    selectClan(currentPlayer.id, clanId);
  };

  const handleStartGame = () => {
    navigate('/game');
  };
  
  const handleConfetti = () =>{
    setShowConfetti(true);
    setTimeout(()=> setShowConfetti(false),4000);
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFactIndex((prevIndex) => (prevIndex + 1) % funFacts.length);
    }, 8000); // 10000 ms = 10 seconds

    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);


  return (

    <div className="h-screen w-screen flex items-center pt-5 bg-lobby-bg bg-center bg-cover ">

      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces="800" gravity="0.3"/>}
 
      <div className='h-[100%] w-5/6 grid grid-cols-1 gap-4 md:grid-cols-10 md:grid-rows-[auto_auto_auto] mx-auto'>
        {/* Players Section */}
        <aside className="bg-black/50 md:col-span-3 md:row-span-2 rounded-2xl p-3 overflow-auto custom-scrollbar flex flex-col justify-between">
          <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Players Online ({sessionPlayers.length}/6)
          </h2>
                
          <div className="flex-1 overflow-y-auto space-y-2">
            {sessionPlayers.length === 0 ? (
              <p> Waiting for players to join .... </p>
            ) : (
              sessionPlayers.map((participant, i) => {
                const isHost = currentPlayer.isHost;

                 return (
                  <div
                    key={participant.id}
                    className={`flex items-center justify-between p-3 border-2 ${participant.color.border} rounded-lg`}
                  >
      
                     <div className="flex items-center space-x-4">
                     <div className="relative w-10 h-10">
                      <img
                        src={ participant.avatar }
                        alt="Avatar"
                        className="w-10 h-10 rounded-full"
                      />
                      {isHost &&<Crown size={18} className="absolute -top-1 -right-1 text-yellow-400 drop-shadow"/>}
                    </div>
                       <div className="flex flex-col ">
                        <span className="text-white truncate max-w-48 font-bold">{participant.global_name}</span>
                        <span
                          className={`text-xs mt-1 px-2 py-0.5 rounded-full w-fit  ${
                            participant.isReady
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-yellow-400/30 text-yellow-400 '
                          }`}
                        >
                          {participant.isReady ? 'Ready!' : 'Selecting...'}
                        </span>
                      </div>
                    </div>
                    {isHost && <div className="px-2 bg-ice text-xs text-yellow-600 rounded-full font-semibold">Host</div>}
                  </div>
                );
              })
            )}

            <button className={`w-full mt-4 py-2 bg-white/50  text-white font-semibold hover:bg-gray-800 rounded-lg flex items-center gap-x-2 border-2 ${
                    isMaxPlayers() ? 'hidden' : '' }`}
                    onClick={addBot}
                    disabled={isMaxPlayers()}
            >
              <PlusCircle size={32}/>
              ADD BOT
              </button>
          </div>
          {showColors && (
            <div className="flex flex-wrap gap-2 p-2 shadow-inner justify-content rounded bg-white/20 border-t border-r border-l ">
              {getAvailableColors(sessionPlayers).map((color) => (
            <button
              key={color.color}
              className={`${color.bg} w-8 h-8 rounded-full shadow-md hover:shadow-lg transform hover:scale-150 transition duration-300 ease-in-out`}
              onClick={() => changeColor(color)}
            />
              ))}
            </div>
          )}
 
          <button className={`w-full py-2 font-semibold rounded-lg ${currentPlayer.color.bg} ${
                              currentPlayer.color.bg === 'bg-white' ? 'text-black' : 'text-white'
                            }`}
                  onClick={toggleColors}
          >
            Change color 🎨
          </button>
        </aside>
              
        {/* Game Settings */}
        <section className="bg-black/50 rounded-2xl md:col-span-7 md:col-start-4 overflow-auto custom-scrollbar flex flex-row p-3">

          {/* Map gallery */}
          <div className=" flex flex-col items-center justify-center  w-[60%] py-3">
            <h2 className="text-2xl font-bold mb-4 text-white">Select Battlefield</h2>
            <div className="w-full max-w-xl relative mb-2">
              <Carousel activeIndex={currentIndex} onSelect={handleSelect} interval={null}>
                {maps.map((map, index) => (
                  <Carousel.Item key={index} >
                    <img
                      className="w-full  object-contain mx-auto md:w-3/4 md:max-h-80 sm:w-1/2 sm:max-h-48"
                      src={map.imageUrl}
                      alt={map.name}
                    />
                    <Carousel.Caption >
                        
                    </Carousel.Caption>
                  </Carousel.Item>
                ))}
                
              </Carousel>
              <h3 className="text-white text-xl font-bold mt-2 text-center">{currentMap.name}</h3>
            </div>
            
          </div>
        
          {/* Game mode & Class */}
        <div className=" flex flex-1 flex-col h-full">
          
            <div className='p-2 flex flex-col max-h-40 '>
              <h3 className="mb-2 text-xl font-bold bg-black/50 p-2 rounded ">Game mode</h3>
              <div className="flex-1 overflow-auto custom-scrollbar space-y-1">

                <button className="w-full p-2 flex flex-row flex justify-between rounded-lg border-2 border-orange-500 bg-orange-500/10">
                  Solo Slide 
                  <div className="text-orange-500 text-right">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /> </svg>
                  </div>
                </button>

                <button className=" w-full text-left p-2 border rounded cursor-not-allowed" disabled> Twin Slides </button>
              </div>
            </div>

            <div className="flex flex-col flex-1 min-h-0 p-2">
              <h3 className="mb-2 text-xl font-bold bg-black/50 p-2 rounded">Select Your Clan</h3>
              <div className='overflow-auto custom-scrollbar'>
                    <ClanSelector onSelect={handleClanSelect} />
              </div>
              <Tooltip id="clan-tooltip" className="z-50 max-w-sm !bg-white !text-black !p-4 !rounded-md !shadow-xl"/>
            </div>
          </div>
        </section>

        {/* Facts & Start */}
        <div className="bg-black/50 md:col-span-7 md:col-start-4 md:row-start-2 px-3 py-2 rounded-2xl flex flex-col md:flex-row justify-between items-center md:space-x-4 overflow-y-auto custom-scrollbar">

          <div className="flex flex-col w-full md:w-2/3 rounded-lg space-y-2">
            <div className="p-2 bg-white/50 rounded-lg ">
              <h2 className="font-bold text-lg mb-2">Fun Facts  ◕‿‿◕ </h2>
              <p className='max-h-10 overflow-y-auto custom-scrollbar'>• {funFacts[factIndex]}</p>
            </div>

            <div className="p-2 flex justify-between gap-2">
              {["❄️" ,"🐧","❄️","🐧","❄️","🐧","❄️"].map((btn,i) => (
                <button
                  key={i}
                  onClick={handleConfetti}
                  className="border w-20 rounded-2xl bg-white/30 hover:bg-white/50 transition"
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>

            <div className="w-full h-full">
              {currentPlayer.isHost ? (
                    <button
                      onClick={handleStartGame}
                      disabled={allPlayersReady}
                      className={`w-full h-full min-h-20 rounded-lg font-bold text-lg transition-all text-center ${
                        allPlayersReady
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-green-400'
                          : 'border-2 text-yellow-400 cursor-not-allowed'
                      }`}
                    >
                      {allPlayersReady ? 'Start Game' : `Waiting for players (${readyPlayerCount}/${sessionPlayers.length})`}
                    </button>
                    
                  ) : (
                    <button
                      onClick={toggleReadyStatus}
                      className={`w-full h-full min-h-20 rounded-lg font-bold text-xl transition-all text-center  ${
                        isReady
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-yellow-400 text-white hover:bg-yellow-500'
                      }`}
                    >
                      {isReady ? 'Ready!' : 'Not Ready'}
                    </button>
                  )}
 
            </div>
            
        </div>

          {/* Anchor nav */}
        <footer className="md:col-span-10 md:row-start-3 border-t border-black text-xs font-semibold text-black mt-2">
  
          <div className="flex flex-col md:flex-row justify-between items-center pt-2 px-3">
            <div className="text-left">made with ❤️ by Jimmy</div>
            <div className="flex justify-evenly w-[60%]">
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
            <div className="text-right">V1.0</div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Lobby;