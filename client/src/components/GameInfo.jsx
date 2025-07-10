import React from 'react';
import { useGameStore } from '../game/state/gameStore';
import { useDiscord } from '../providers/DiscordProvider';

const GameInfo = () => {
  const { players, currentPlayerId, resources } = useGameStore();
  const { currentUser } = useDiscord();
  
  const currentPlayer = players[currentPlayerId];
  const playerResources = resources[currentUser?.id] || { food: 0, workers: 0 };
  
  return (
    <div className="fixed top-0 flex flex-col justify-between  z-2 w-1/  h-full">

      <div className='space-y-1 '>
        <div className="flex items-center  space-x-2 bg-fuchsia-500  rounded-full pr-5 ">
            <img
              src="assets/default_avatar.png"
              alt="Avatar"
              className="w-10 h-10 rounded-full"
            />
          <div className="flex flex-col ">
          <span className="text-black truncate max-w-48 font-bold">Jimmy</span>
          🪖 1  🏝️ 2  🪵 5
          </div>
        </div>
        
            <div className="flex items-center   space-x-2 bg-red-600  rounded-full pr-5">
            <img
              src="assets/default_avatar.png"
              alt="Avatar"
              className="w-10 h-10 rounded-full"
            />
          <div className="flex flex-col ">
          <span className="text-black truncate max-w-48 font-bold">Jimmy 2</span>
          🪖 1  🏝️ 2  🪵 5
          </div>
        </div>
        <div className="flex items-center  space-x-2 bg-cyan-300 rounded-full pr-5 ">
            <img
              src="assets/default_avatar.png"
              alt="Avatar"
              className="w-10 h-10 rounded-full"
            />
          <div className="flex flex-col ">
          <span className="text-black truncate max-w-48 font-bold">Jimmy 3</span>
          🪖 1  🏝️ 2  🪵 5
          </div>
        </div>
                <div className="flex items-center   space-x-2 bg-emerald-300  rounded-full pr-5 ">
            <img
              src="assets/default_avatar.png"
              alt="Avatar"
              className="w-10 h-10 rounded-full"
            />
          <div className="flex flex-col ">
          <span className="text-black truncate max-w-48 font-bold">Jimmy 4</span>
          🪖 1  🏝️ 2  🪵 5
          </div>
        </div>
                <div className="flex items-center   space-x-2 bg-lime-300  rounded-full pr-5 ">
            <img
              src="assets/default_avatar.png"
              alt="Avatar"
              className="w-10 h-10 rounded-full"
            />
          <div className="flex flex-col ">
          <span className="text-black truncate max-w-48 font-bold">Jimmy 5</span>
          🪖 1  🏝️ 2  🪵 5
          </div>
        </div>
                <div className="flex items-center  space-x-2 bg-yellow-300  rounded-full pr-5 ">
            <img
              src="assets/default_avatar.png"
              alt="Avatar"
              className="w-10 h-10 rounded-full"
            />
          <div className="flex flex-col ">
          <span className="text-black truncate max-w-48 font-bold">Jimmy 6</span>
          🪖 1  🏝️ 2  🪵 5
          </div>
        </div>
      </div>

      <div className="flex flex-col rounded-lg space-y-2 bg-black/50 p-2 my-1">
            <div className="p-2   rounded-lg   text-black">
              <h2 className="font-bold text-lg mb-2 ">Events</h2>
              <div className='bg-white p-1 rounded-lg max-h-48 overflow-y-auto custom-scrollbar'>
                <p >Jimmy1: rolled 2 & 3</p>
                <p >Jimmy1: Attacked Jimmy2 and lost!</p>
                <p >Jimmy1: Attacked Jimmy1 and lost!</p>
                <p >Jimmy2: rolled 2 & 3</p>
                <p >Jimmy3: rolled 3 & 3</p>
                <p >Jimmy4: rolled 4 & 1</p>
                <p >Jimmy5: rolled 5 & 2</p>
                <p >Jimmy6: rolled 6 & 4</p>
                <p >Jimmy1: rolled 2 & 5</p>
                <p >Jimmy2: rolled 1 & 3</p>
              </div>
            </div>
        </div>


    </div>
  );
};

export default GameInfo;