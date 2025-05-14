import React, { createContext, useContext, useState, useEffect } from 'react';
import { DiscordSDK } from "@discord/embedded-app-sdk";




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


  useEffect(() => {
    async function initializeDiscord() {
      try {

                // Check if we are in a local environment (localhost)
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

        if (isLocal) {
          // Set mock user data when running locally
          setCurrentUser({
            id: 'mock-user-id',
            username: 'MockUser',
            globalname: "Jimmyyyy",
            discriminator: '0000',
            avatar: null,
          });
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

        setCurrentUser(user);

        // Get voice participants
        const { participants } = await discordSdk.commands.getInstanceConnectedParticipants();
        setVoiceParticipants(participants);
        

        setIsReady(true);
        setDiscord(discordSdk);
      } catch (error) {
        console.error('Failed to initialize Discord SDK:', error);

        // For development outside Discord, set mock data
        if (import.meta.env.CURRENT_ENV === 'local') {
          setCurrentUser({
            id: 'mock-user-id',
            username: 'MockUser',
            discriminator: '0000',
            avatar: null,
          });
          setIsReady(true);
        }
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
  };

  return (
    <DiscordContext.Provider value={value}>
      {children}
    </DiscordContext.Provider>
  );
}