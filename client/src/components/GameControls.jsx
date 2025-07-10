import React from 'react';
import { useGameStore } from '../game/state/gameStore';
import { motion } from "framer-motion";

const GameControls = ({ onSpinWheel }) => {
  const { 
    currentTurn, 
    currentPlayerId, 
    endTurn, 
    timeOfDay, 
    players
  } = useGameStore();
  
  const isCurrentPlayerTurn = currentPlayerId === Object.keys(players)[0]; // Simplified for MVP
  return (
    <div className="fixed bottom-1 right-1 z-1 w-4/5 h-1/5    p-3">
      <div className=" flex flex-row  space-x-1 justify-center">

            <motion.div
              className="w-24 h-36 bg-blue-200 rounded-xl shadow-lg flex flex-col items-center justify-center p-2 border-2 border-blue-400"
              whileHover={{ scale: 1.5 }}
            >
              <img src="assets/default_avatar.png" alt="alt" className="w-12 h-12 mb-2" />
              <p className="text-xs text-center text-blue-900">"Blazzard!"</p>
            </motion.div>
             <motion.div

              className="w-24 h-36 bg-blue-200 rounded-xl shadow-lg flex flex-col items-center justify-center p-2 border-2 border-blue-400"
              whileHover={{ scale: 1.5 }}
            >
              <img src="assets/default_avatar.png" alt="alt" className="w-12 h-12 mb-2" />
              <p className="text-xs text-center text-blue-900">"Blazzard!"</p>
            </motion.div>

             <motion.div
              className="w-24 h-36 bg-blue-200 rounded-xl shadow-lg flex flex-col items-center justify-center p-2 border-2 border-blue-400"
              whileHover={{ scale: 1.5 }}
            >
              <img src="assets/default_avatar.png" alt="alt" className="w-12 h-12 mb-2" />
              <p className="text-xs text-center text-blue-900">"Blazzard!"</p>
            </motion.div>

            <motion.div
              className="w-24 h-36 bg-blue-200 rounded-xl shadow-lg flex flex-col items-center justify-center p-2 border-2 border-blue-400"
              whileHover={{ scale: 1.5 }}
            >
              <img src="assets/default_avatar.png" alt="alt" className="w-12 h-12 mb-2" />
              <p className="text-xs text-center text-blue-900">"Blazzard!"</p>
            </motion.div>

            <motion.div
              className="w-24 h-36 bg-blue-200 rounded-xl shadow-lg flex flex-col items-center justify-center p-2 border-2 border-blue-400"
              whileHover={{ scale: 1.5 }}
            >
              <img src="assets/default_avatar.png" alt="alt" className="w-12 h-12 mb-2" />
              <p className="text-xs text-center text-blue-900">"Blazzard!"</p>
            </motion.div>

            <motion.div
              className="w-24 h-36 bg-blue-200 rounded-xl shadow-lg flex flex-col items-center justify-center p-2 border-2 border-blue-400"
              whileHover={{ scale: 1.5 }}
            >
              <img src="assets/default_avatar.png" alt="alt" className="w-12 h-12 mb-2" />
              <p className="text-xs text-center text-blue-900">"Blazzard!"</p>
            </motion.div>

      </div>
    </div>
  );
};

export default GameControls;