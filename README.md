# STATUS: IN-DEV
# TakTika - Discord Voice Activity Strategy Game

TakTik is a turn-based multiplayer strategy game designed to be played as a Discord Voice Activity. Players control penguins rookeries battling for territorial dominance on a fictional map made of custom regions.

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
taktika/
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

##in-game: 
### -loading
![Screenshot 2025-07-10 121613](https://github.com/user-attachments/assets/86203f0b-4050-4420-aaa9-37dc22e994e9)
### -lobby:
![Screenshot 2025-07-10 121626](https://github.com/user-attachments/assets/c22e19c8-fecf-4ad4-ad75-f9e959b1ba93)
### -game:
![Screenshot 2025-07-10 121641](https://github.com/user-attachments/assets/94fd544b-e879-456c-a04e-a8fd8cbab70e)
