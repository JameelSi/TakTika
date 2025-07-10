# TakTika - Discord Voice Activity Strategy Game

TakTik is a turn-based multiplayer strategy game designed to be played as a Discord Voice Activity. Players control ant colonies battling for territorial dominance on a fictional map made of custom regions.

## Game Features

- **Penguin Colony Theme**: Each player controls a different ant clan with unique traits and abilities
- **Territory Control**: Deploy ant units across territories to expand your colony's influence
- **Combat System**: Uses a coin-flip mechanic (three coins with custom values) to resolve combat
- **Random Events**: A spin-the-wheel system triggers random events each turn
- **Day/Night Cycle**: Globally affects clan abilities and gameplay
- **Multiplayer**: Real-time synchronization using Socket.IO
- **Discord Integration**: Playable as a Discord Voice Activity

## Technical Stack

### Client
- React.js
- Vite
- PixiJS for rendering
- Zustand for state management
- Socket.IO for real-time communication
- Discord Embedded App SDK

### Server
- Node.js
- Express
- Socket.IO
- UUID for game session management

## Project Structure

```
taktik-discord-game/
├── client/                  # Frontend React application
│   ├── public/              # Static assets
│   └── src/
│       ├── components/      # React components
│       ├── game/            # Game logic
│       │   ├── data/        # JSON data files
│       │   ├── state/       # Zustand state management
│       │   └── utils/       # Utility functions
│       ├── providers/       # Discord SDK integration & Socket.IO client setup,game manager
├── server/                  # Backend Node.js + Express application
│   └── src/
│       └── index.js         # Server entry point with Socket.IO handlers
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm run install:all
   ```
3. Create `.env` files based on the provided examples
4. Start the development servers:
   ```
   npm run dev
   ```

## Game Rules

- **Objective**: Control the most territories by the end of the game
- **Turns**: Players take turns to perform actions like claiming territories or attacking
- **Combat**: When attacking a territory, three coins are flipped. The attacker wins with 2+ heads
- **Resources**: Each territory provides resources (food, workers) based on its type
- **Day/Night Cycle**: Different clans gain bonuses or penalties based on the time of day
- **Events**: Random events can help or hinder players throughout the game

## Extending the Game

The game is designed to be modular and extensible:
- Add new clans in `client/src/game/data/clans.js`
- Create new maps in `client/src/game/data/maps.js`
- Add event types in `client/src/game/data/events.js`

## Discord Integration

TakTik is designed as a Discord Voice Activity, allowing players to join and play directly within Discord voice channels.