import React, { createContext, useContext, useState, useEffect } from 'react';
import { DiscordSDK } from '@discord/embedded-app-sdk';
import { assignColor,isColorAvailable  } from '../game/utils/colorManager';



const DiscordContext = createContext({
  discord: null,
  isReady: false,
  currentUser: null,
  voiceParticipants: [],
});

export function useDiscord() {
  return useContext(DiscordContext);
}

export function DiscordProvider({ children }) {
  
  const [discord, setDiscord] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [voiceParticipants, setVoiceParticipants] = useState([]);

  function addVoiceParticipant(participant) {
    setVoiceParticipants(prev => {
      const colorInfo = assignColor(prev);
      return [...prev, { ...participant, color: colorInfo }];
    });
  }

  function changeUserColor(newColor) {
  if (!isColorAvailable(voiceParticipants, newColor.color, currentUser.id)) {
    console.warn("Color taken");
    return;
  }
  setVoiceParticipants(prev =>
    prev.map(p => (p.id === currentUser.id ? { ...p, color: newColor } : p))
  );

  setCurrentUser(prev => ({ ...prev, color: newColor }));
}

  useEffect(() => {
    async function initializeDiscord() {
      try {

        // Check if we are in a local environment (localhost)
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

        if (isLocal) {
          // Set mock user data when running locally
          const participants = voiceParticipants; // get existing mock participants
          const colorInfo = assignColor(participants);
          const mockUser = {
              id: 'localuser',
              username: 'localuser',
              global_name: "Jimmy-Local",
              discriminator: '0001',
              avatar: null,
              color:colorInfo,
              isBot: false
            };
          setCurrentUser(mockUser);
          setVoiceParticipants([...participants, mockUser]);
          setIsReady(true);
          return;
        }

        const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);
        await discordSdk.ready();

        const { code } = await discordSdk.commands.authorize({
          client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
          response_type: "code",
          state: "",
          prompt: "none",
          scope: ["identify", "guilds", "applications.commands"],
        });
        
        
        const response = await fetch("/.proxy/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        const { access_token } = await response.json();

        const auth = await discordSdk.commands.authenticate({
          access_token,
        });

        if (!auth) throw new Error("Authentication failed");

        const userId = auth.user.id;
        const user = await discordSdk.commands.getUser({ id: userId });
        const { participants } = await discordSdk.commands.getInstanceConnectedParticipants();
        const colorInfo = assignColor(participants);
        const newRealUser = {
          ...user,
          ...colorInfo,
          isBot: false,
        };

        setCurrentUser(newRealUser);
        setVoiceParticipants([...participants, newRealUser]);

        setIsReady(true);
        setDiscord(discordSdk);
      } catch (error) {
        console.error('Failed to initialize Discord SDK:', error);
      }
    }
    
    initializeDiscord();
    
    return () => {
      // Cleanup if needed
    };
  }, []);

  const value = {
    discord,
    isReady,
    currentUser,
    voiceParticipants,
    addVoiceParticipant,
    changeUserColor,
  };

  return (
    <DiscordContext.Provider value={value}>
      {children}
    </DiscordContext.Provider>
  );
}