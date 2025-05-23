import React, { createContext, useContext, useState, useEffect } from 'react';
import { DiscordSDK } from '@discord/embedded-app-sdk';



const DiscordContext = createContext({
  discord: null,
  discordReady: false,
  currentUser: null,
  channelID: null,
});

export function useDiscord() {
  return useContext(DiscordContext);
}

export function DiscordProvider({ children }) {
  
  const [discord, setDiscord] = useState(null);
  const [discordReady, setDiscordReady] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [channelID, setChannelID] = useState(null);

  useEffect(() => {
    async function initializeDiscord() {
      try {

        // Check if we are in a local environment (localhost)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          // Set mock user data when running locally
          const mockUser = {
              id: 'localuser',
              username: 'localuser',
              discriminator: '0001',
              avatar: 'assets/default_avatar.png',
              global_name: 'Jimmy-Local',
              bot: false,
              isBot: false,
              isReady: false,
              isHost: false,
              color: null,
              socketId: null,
            };
          setCurrentUser(mockUser);
          setChannelID("localChannel")
          setDiscordReady(true);
          return;
        }

        const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);
        try{
          await discordSdk.ready();
        }catch(e){
          console.error("Discord SDK failed to initialize",e);
          setError("Failed to connect to Discord")
        }
        

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

        const auth = await discordSdk.commands.authenticate({ access_token, });

        if (!auth) throw new Error("Authentication failed");

        const userId = auth.user.id;
        const user = await discordSdk.commands.getUser({ id: userId });
        const avatarURL = user.avatar 
              ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
              : 'assets/default_avatar.png'
        
        setChannelID(discordSdk.channelId);
        setCurrentUser({
            id: user.id,
            username: user.username,
            discriminator: user.discriminator,
            avatar: avatarURL,
            global_name: user.global_name,
            bot: user.bot,
            isBot: false,
            isReady: false,
            isHost: false,
            color: null,
            socketId: null,
          });

        setDiscord(discordSdk);
        setDiscordReady(true);
      } catch (error) {
        console.error('Failed to initialize Discord SDK:', error);
      }
    }
    
    initializeDiscord();
    
    return () => {};
  }, []);

  const value = {
    discord,
    discordReady,
    currentUser,
    channelID,
  };

  return (
    <DiscordContext.Provider value={value}>
      {children}
    </DiscordContext.Provider>
  );
}