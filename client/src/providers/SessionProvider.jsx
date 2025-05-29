import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDiscord } from './DiscordProvider';
import { initSocket, emitEvent, subscribeToEvent } from '../game/utils/socket';
import { assignColor } from '../game/utils/colorManager';

const SessionContext = createContext({
  sessionReady: false,
  currentPlayer: null,
  sessionPlayers: null,
  socket: null,
  changePlayerColor: () => {},
  addBot: () => {},
  toggleReadyStatus: () => {},
});


export function useSession() {
  return useContext(SessionContext);
}


export const SessionProvider = ({ children }) => {

  const { discordReady, currentUser, channelID } = useDiscord();
  const [sessionReady, setSessionReady] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [sessionPlayers, setSessionPlayers] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    
    if (!discordReady || !currentUser || !channelID) return;
    
    const s = initSocket();
    s.connect();
    s.on('connect', () => {
       setSocket(s);
       emitEvent('game:join', {player: currentUser,channelID: channelID});
    });
  

    const unsubLeft = subscribeToEvent('game:playerLeft', ({players}) => {
      const updated = players.find(p => p.id === currentUser.id);
      if (updated) setCurrentPlayer(updated);
      setSessionPlayers(players);
    });


    const unsubJoin = subscribeToEvent('game:playerJoined', ({newPlayer, players}) => {
        if(newPlayer.id === currentUser.id){
          newPlayer.color = assignColor(players)
          s.emit('player:updateStatus', {player: newPlayer});
          setCurrentPlayer(newPlayer)
        }
      })

    const unsubStat= subscribeToEvent('player:statusChanged', ({players}) => {
      const updated = players.find(p => p.id === currentUser.id);
      if (updated) setCurrentPlayer(updated);
      setSessionPlayers(players);
    });


    const unsubAll = () => {
      unsubJoin();
      unsubStat();
      unsubLeft();
    }

    s.on('reconnect', () => {
       emitEvent('game:join', {player: currentUser,channelID: channelID});
    });

    return () => {
      unsubAll();
      s.disconnect();
    };

  }, [discordReady]);

  useEffect(() => {
    if (currentPlayer && sessionPlayers.length > 0)
      setSessionReady(true);
  }, [currentPlayer, sessionPlayers]);

  const changePlayerColor = (newColor) => {
    if (!currentPlayer) return;
    const updatedPlayer = { ...currentPlayer, color: newColor };
    setCurrentPlayer(updatedPlayer);
    socket.emit('player:updateStatus', { player: updatedPlayer });
  };

  const addBotPlayer = () => {
    if (!currentPlayer?.isHost) return;
    const playersCount = players.length + 1
    const botPlayer = {
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
    // socket?.emit('player:updateStatus', { player: botPlayer });
  };

  const toggleReadyStatus = () => {
    if (!currentPlayer) return;
    const updatedPlayer = { ...currentPlayer, isReady: !currentPlayer.isReady };
    setCurrentPlayer(updatedPlayer);
    socket.emit('player:updateStatus', { player: updatedPlayer });
  };


  const value = {
    sessionReady,
    currentPlayer,
    sessionPlayers,
    socket,
    changePlayerColor,
    addBotPlayer,
    toggleReadyStatus,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};