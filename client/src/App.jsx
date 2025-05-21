import React, { useEffect, useState } from 'react';
import { useDiscord } from './discord/DiscordProvider';
import LoadingScreen from './components/LoadingScreen';
import { useGameStore } from './game/state/gameStore';
import { initSocket } from './socket';
import 'bootstrap/dist/css/bootstrap.min.css';


function App({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const { isReady, currentUser } = useDiscord();
  const { initialize } = useGameStore();
  
  useEffect(() => {
    if (!isReady) return;

    const socket = initSocket();

    const loadGameData = async () => {
      try {
        await initialize(socket, currentUser); // Ensure this is async-compatible
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load game data:', error);
      }
    };

    loadGameData();

    return () => socket.disconnect();
  }, [isReady, currentUser, initialize]);

  if (!isReady || isLoading) return <LoadingScreen />;

  return children;
}

export default App;