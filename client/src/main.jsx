import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import AppRouter from './AppRouter.jsx';
import './index.css';
import { DiscordProvider } from './discord/DiscordProvider';
import { GameProvider } from './contexts/GameContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DiscordProvider>
      <GameProvider>
        <App>
          <AppRouter />
        </App>
      </GameProvider>
    </DiscordProvider>
  </React.StrictMode>
);