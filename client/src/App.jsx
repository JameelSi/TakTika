import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDiscord } from './discord/DiscordProvider';
import GameBoard from './components/GameBoard';
import Lobby from './components/Lobby';
import LoadingScreen from './components/LoadingScreen';
import { useGameStore } from './game/state/gameStore';
import { initSocket } from './socket';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { isReady, currentUser } = useDiscord();
  const { initialize } = useGameStore();
  
  useEffect(() => {
    if (isReady) {
      // Initialize the socket connection
      const socket = initSocket();
      
      // Load game data
      const loadGameData = async () => {
        try {
          // In a real implementation, this would load from the server
          // For now we'll use a timeout to simulate loading
          setTimeout(() => {
            initialize(socket, currentUser);
            setIsLoading(false);
          }, 2000);
        } catch (error) {
          console.error('Failed to load game data:', error);
        }
      };
      
      loadGameData();
      
      return () => {
        socket.disconnect();
      };
    }
  }, [isReady, currentUser, initialize]);
  
  if (!isReady || isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <Router>
      <Routes>
        <Route path="/lobby" element={<Lobby/>} />
        <Route path="/game" element={<GameBoard/>} />
        <Route path="/" element={<Navigate to="/lobby" replace />} />
      </Routes>
    </Router>
  );
}

export default App;