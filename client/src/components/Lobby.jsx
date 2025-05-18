import React, { useState,useRef,useEffect } from 'react';
import { useDiscord } from '../discord/DiscordProvider';
import { useGameStore } from '../game/state/gameStore';
import ClanSelector from './ClanSelector';
import { PlusCircle,Crown } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import maps from '../game/data/maps-data.json'
import Carousel from 'react-bootstrap/Carousel';
import Confetti from 'react-confetti';

const Lobby = () => {
  
  const navigate = useNavigate();
  const { voiceParticipants, currentUser } = useDiscord();
  const { selectClan, players } = useGameStore();
  const [selectedMap, setSelectedMap] = useState('standard');
  const [isReady, setIsReady] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [factIndex, setFactIndex] = useState(0);
  const [localPlayers, setLocalPlayers] = useState([
        { id: 1, avatar: '',global_name: "jimmy one two three four five six seven eight nine ten",color:"" },
        { id: 2, avatar: '',global_name: "jimmy2",color:"" },
        { id: 3, avatar: '',global_name: "jimmy3",color:"" },
]);

  const addPlayer = () => {

   const newPlayer = {
    id: Date.now(),
    avatar: '',
    global_name: `Jimmy${localPlayers.length + 1}`,
    color:"",
  };

  setLocalPlayers([...localPlayers, newPlayer]);
  };

  const isMaxPlayers = () => {
    return localPlayers.length >= 6;
  }
   const [showColors, setShowColors] = useState(false);
  const colorsMap = [
    {
      color: 'orange-500',
      bg: 'bg-orange-500',
      border: 'border-orange-500',
    },
    {
      color: 'red-600',
      bg: 'bg-red-600',
      border: 'border-red-600',
    },
    {
      color: 'yellow-300',
      bg: 'bg-yellow-300',
      border: 'border-yellow-300',
    },
    {
      color: 'green-500',
      bg: 'bg-green-500',
      border: 'border-green-500',
    },
    {
      color: 'blue-500',
      bg: 'bg-blue-500',
      border: 'border-blue-500',
    },
    {
      color: 'rose-300',
      bg: 'bg-rose-300',
      border: 'border-rose-300',
    },
    {
      color: 'pink-400',
      bg: 'bg-pink-400',
      border: 'border-pink-400',
    },
    {
      color: 'purple-700',
      bg: 'bg-purple-700',
      border: 'border-purple-700',
    },
    {
      color: 'black',
      bg: 'bg-black',
      border: 'border-black',
    },
    {
      color: 'gray-500',
      bg: 'bg-gray-500',
      border: 'border-gray-500',
    },
    {
      color: 'white',
      bg: 'bg-white',
      border: 'border-white',
    },
    {
      color: 'lime-300',
      bg: 'bg-lime-300',
      border: 'border-lime-300',
    },
    {
      color: 'emerald-300',
      bg: 'bg-emerald-300',
      border: 'border-emerald-300',
    },
    {
      color: 'amber-700',
      bg: 'bg-amber-700',
      border: 'border-amber-700',
    },
    {
      color: 'violet-900',
      bg: 'bg-violet-900',
      border: 'border-violet-900',
    },
    {
      color: 'fuchsia-500',
      bg: 'bg-fuchsia-500',
      border: 'border-Ffuchsia-500',
    },
  ];
   const [currentColor, setCurrentColor] = useState(colorsMap[5].bg);

  const currentMap = maps[currentIndex];
  const toggleColors = () => setShowColors(!showColors);
  const chooseColor = (color) => {
     setShowColors(false); // close the picker after selection
    setCurrentColor(color.bg)
  };

  const handleSelect = (selectedIndex) => {
    setCurrentIndex(selectedIndex);
  };

  const handleClanSelect = (clanId) => {
    selectClan(currentUser.id, clanId);
    setIsReady(true);
  };
 

  const handleStartGame = () => {
    navigate('/game');
  };


  const penguinFacts = [
  "Penguins live almost exclusively in the Southern Hemisphere.",
  "Emperor Penguins can dive over 500 meters deep.",
  "Penguins have waterproof feathers that keep them dry and warm.",
  "Some penguins huddle together to stay warm in freezing weather.",
  "Penguins can drink seawater thanks to a special gland that removes salt.",
  "The smallest penguin species is the Little Blue Penguin, just 13 inches tall.",
  "Penguins use vocalizations to recognize their mates and chicks.",
  "Penguins shed their feathers all at once in a process called molting.",
  "The Galápagos Penguin is the only species that lives north of the equator.",
  "Penguins can swim at speeds up to 15 miles per hour.",
  "Unlike most birds, penguins have solid bones to help them dive.",
  "A penguin’s wings are adapted into flippers for swimming.",
  "Penguins eat fish, squid, and krill.",
  "Penguins can hold their breath underwater for up to 20 minutes.",
  "Male Emperor Penguins incubate eggs on their feet under a flap of skin.",
  "Penguins communicate with a variety of calls and body language.",
  "Chinstrap penguins are named for the narrow black band under their heads.",
  "Penguins can drink saltwater because of specialized glands above their eyes.",
  "Some penguins mate for life.",
  "Penguins often build nests out of stones.",
  "Penguins are excellent swimmers but cannot fly.",
  "The word “penguin” may come from the Welsh “pen gwyn” meaning “white head.”",
  "Penguins’ black and white coloring acts as camouflage in the water.",
  "Penguins use their strong legs and webbed feet to propel themselves on land.",
  "Penguins have excellent underwater vision.",
  "Penguin chicks are often covered in soft down feathers before molting.",
  "Penguins are social birds, living in colonies called rookeries.",
  "Macaroni penguins have bright orange-yellow crests.",
  "Penguins can be found on every continent in the Southern Hemisphere.",
  "Penguins preen their feathers regularly to keep them waterproof.",
  "Penguins do not have teeth; they use spines on their tongues to grip fish.",
  "The Adélie penguin is named after the wife of French explorer Dumont d’Urville.",
  "Penguins’ flippers have bones similar to human hands.",
  "Penguins molt once a year, losing all feathers at once.",
  "Penguins use their beaks to catch and hold slippery prey.",
  "Penguins have thick layers of blubber for insulation.",
  "Penguins’ feathers are densely packed — about 70 per square inch.",
  "The King Penguin is the second largest species after the Emperor.",
  "Penguins can leap out of the water onto rocks or ice, called porpoising.",
  "Penguins often slide on their bellies over ice to move faster, called tobogganing.",
  "Penguins have a third eyelid to protect their eyes underwater.",
  "Penguins use their feet and tail for steering while swimming.",
  "Penguins molt after the breeding season.",
  "Penguins in warmer climates like the Galápagos have different adaptations.",
  "Penguins can sense magnetic fields to help them navigate.",
  "Some penguin species are endangered due to climate change and fishing.",
  "Penguins have strong legs set far back on their bodies for upright posture.",
  "Penguins’ feathers have a special oil to repel water.",
  "Penguins preen with their beaks to spread oil and maintain feathers.",
  "Penguins are beloved worldwide for their charming waddle and social nature."
];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFactIndex((prevIndex) => (prevIndex + 1) % penguinFacts.length);
    }, 10000); // 10000 ms = 10 seconds

    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);
  
  const readyPlayerCount = Object.values(players).filter(player => player.clan).length;
  const allPlayersReady = readyPlayerCount === voiceParticipants.length && readyPlayerCount >= 2;
  

const [showConfetti,setShowConfetti] = useState(false);

const handleConfetti = () =>{
  setShowConfetti(true);
  setTimeout(()=> setShowConfetti(false),4000);
}


  return (

    <div className="h-screen w-screen flex items-center pt-5 bg-lobby-bg bg-center bg-cover ">

      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces="800" gravity="0.3"/>}
 
      <div className='h-[100%] w-5/6 grid grid-cols-1 gap-4 md:grid-cols-10 md:grid-rows-[auto_auto_auto]  mx-auto'>
        {/* Players Section */}
        <aside className="bg-black/50 md:col-span-3 md:row-span-2 rounded-2xl p-3 overflow-auto custom-scrollbar flex flex-col justify-between">
          <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Players Online ({localPlayers.length}/6)
          </h2>
                
          <div className="flex-1 overflow-y-auto space-y-2">
            {voiceParticipants.length === 1 ? (
              <p> Waiting for players to join .... </p>
            ) : (
              localPlayers.map((participant, i) => {
                const isHost = i === 0;
                return (
                  <div
                    key={participant.id}
                    className={`flex items-center justify-between p-3  border-3 ${colorsMap[i].border} rounded-lg `}
                  >
      
                     <div className="flex items-center space-x-4">
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
                  </div>
                );
              })
            )}

            <button className={`w-full mt-4 py-2 bg-white/50  text-white font-semibold hover:bg-gray-800 rounded-lg flex items-center gap-x-2 border-2 ${
                    isMaxPlayers() ? 'hidden' : '' }`}
                    onClick={addPlayer}
                    disabled={isMaxPlayers()}
            >
              <PlusCircle size={32}/>
              ADD BOT
              </button>
          </div>
          {showColors && (
            <div className="flex flex-wrap gap-2 p-2 justify-content rounded bg-white/10 border">
              {colorsMap.map((color) => (
                <button
                  key={color.color}
                  className={`${color.bg} w-8 h-8 rounded-full border-2 border-white`}
                  onClick={() => chooseColor(color.color)}
                />
              ))}
            </div>
          )}
          <button className={`w-full py-2 ${currentColor} rounded-lg hover:from-blue-300 hover:to-blue-300`}
                  onClick={toggleColors}
          >
            Change color 🎨
          </button>
        </aside>
              
        {/* Game Settings */}
        <section className="bg-black/50 rounded-2xl md:col-span-7 md:col-start-4 overflow-auto custom-scrollbar flex flex-row p-3">

          {/* Map gallery */}
          <div className=" flex flex-col items-center justify-between w-[60%] py-3">
            <h2 className="text-2xl font-bold mb-4 text-white">Select Battlefield</h2>
              <div className="w-full max-w-xl relative">
            <Carousel activeIndex={currentIndex} onSelect={handleSelect} interval={null}>
              {maps.map((map, index) => (
                <Carousel.Item key={index} >
                  <img
                    className="w-full  object-contain mx-auto mb-4 rounded-lg md:w-3/4 md:max-h-80 sm:w-1/2 sm:max-h-48"
                    src={map.imageUrl}
                    alt={map.name}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
            </div>
            <h3 className="text-white text-xl font-bold">{currentMap.name}</h3>
            <p className="text-gray-400 text-sm max-w-md">{currentMap.description}</p>
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
            </div>
          </div>
        </section>

        {/* Chat & Start */}
        <div className="bg-black/50 md:col-span-7 md:col-start-4 md:row-start-2 p-2 rounded-2xl flex flex-row justify-between ">

            <div className="flex-col justify-between w-2/3 rounded-lg overflow-y-auto">

              <div className=" p-2 overflow-y-auto custom-scrollbar bg-white/50 rounded-lg ">
                <h2 className="font-bold text-xlg mb-2">Fun Facts🐧</h2>
                <p>- {penguinFacts[factIndex]}</p>
              </div>

              <div className="p-2 overflow-x-auto flex flex-row custom-scrollbar justify-between">
                {["❄️" ,"🐧","❄️","🐧","❄️","🐧","❄️"].map((btn,i) => (
                  <button
                    key={i}
                    onClick={handleConfetti}
                    className="border w-20 rounded-2xl"
                  >
                    {btn}
                  </button>
                ))}
              </div>
            </div>

            {/* Waiting status */}
            <div className="rounded-lg flex flex-col items-center justify-center">

                <button
                  onClick={handleStartGame}
                  disabled={!allPlayersReady}
                  className={`h-full p-4 rounded-lg font-bold text-xl transition-all ${
                    allPlayersReady
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-green-400 hover:from-orange-600 hover:to-amber-600 transform hover:scale-[1.02]'
                      : 'border-2 text-yellow-400 cursor-not-allowed'
                  }`}
                >
                  {allPlayersReady 
                    ? 'Start Game' 
                    : `Waiting for players (${readyPlayerCount}/${voiceParticipants.length})`}
                </button>
                
                {/* <p className="mt-3 text-sm text-center ">
                  {!isReady 
                    ? 'Ready up' 
                    : voiceParticipants.length < 2 
                      ? 'Need at least 2 players to start' 
                      : 'Waiting for other players to ready up'}
                </p> */}
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