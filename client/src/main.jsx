import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import AppRouter from './AppRouter.jsx';
import './index.css';
import { DiscordProvider } from './providers/DiscordProvider';
import { SessionProvider } from './providers/SessionProvider';
import { DiscordProxy} from '@robojs/patch';

DiscordProxy.patch() // every request is automatically prefixed with "/.proxy/" in discord canvas

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DiscordProvider>
      <SessionProvider>
        <App>
          <AppRouter />
        </App>
      </SessionProvider>
    </DiscordProvider>
  </React.StrictMode>
);