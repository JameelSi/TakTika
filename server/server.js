const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');


// Load environment variables
dotenv.config({ path: "../.env" });

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST'],
  },
});

// Game state
const activeGames = new Map();
const playersGamesMap = new Map();
const MAX_PLAYERS = 6

// Helper function to create a new game
const createGame = (hostId, channelID) => ({
  id: uuidv4(),
  host: hostId,
  channelID: channelID,
  players: new Map(),
  createdAt: Date.now(),
  currentTurn: 1,
  currentPlayerId: null,
  timeOfDay: 'day',
  startedAt: null,
})

// Helper function to find available game
const findAvailableGame = (channelID) => {
  for (const [gameId, game] of activeGames.entries()) {
    if (game.channelID === channelID && game.players.size < MAX_PLAYERS) {
      return game
    }
  }
  return null
}

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  // Join game
  socket.on('game:join', ({ player,channelID }) => {
    
    // find or create a game for the player
    let game = findAvailableGame(channelID)
    if (!game) {
      game = createGame(socket.id, channelID)
      player.isHost = true
      activeGames.set(game.id, game)
    }

    // Add player to game
    player.socketId = socket.id;
    game.players.set(socket.id, player)
    playersGamesMap.set(socket.id,game.id)
    socket.join(game.id)
    
    // Notify other players
    io.to(game.id).emit('game:playerJoined', {newPlayer: player, players: Array.from(game.players.values())} )

    console.log(`Player ${player.username} (${player.id}) joined game ${game.id}`);
  });

  // Player status update
  socket.on('player:updateStatus', ({player}) => {
    const playerCurrentGame = activeGames.get(playersGamesMap.get(socket.id))
    if (!playerCurrentGame) return;
    playerCurrentGame.players.set(socket.id, player)
    
    // Broadcast to all players
    io.to(playerCurrentGame.id).emit('player:statusChanged', Array.from(playerCurrentGame.players.values()));
  });
  
  /* GAME LOGIC
  // End turn
  socket.on('game:endTurn', ({ nextPlayerId, newTurn }) => {
    const player = Object.values(players).find(p => p.socketId === socket.id);
    if (!player) return;
    
    const gameId = player.gameId;
    if (!gameId || !games[gameId]) return;
    
    // Update game state
    games[gameId].currentPlayerId = nextPlayerId;
    games[gameId].currentTurn = newTurn;
    
    // Broadcast to all players
    io.to(gameId).emit('game:turn', {
      turn: newTurn,
      playerId: nextPlayerId,
    });
  });
  
  // Toggle time of day
  socket.on('game:toggleTime', ({ timeOfDay }) => {
    const player = Object.values(players).find(p => p.socketId === socket.id);
    if (!player) return;
    
    const gameId = player.gameId;
    if (!gameId || !games[gameId]) return;
    
    // Update game state
    games[gameId].timeOfDay = timeOfDay;
    
    // Broadcast to all players
    io.to(gameId).emit('game:timeUpdate', {
      timeOfDay,
    });
  });
  
  // Claim territory
  socket.on('game:claimTerritory', ({ territoryId, playerId }) => {
    const player = players[playerId];
    if (!player) return;
    
    const gameId = player.gameId;
    if (!gameId || !games[gameId]) return;
    
    // Broadcast to all players
    io.to(gameId).emit('game:territoryUpdate', {
      territoryId,
      ownerId: playerId,
    });
  });
  
  // Resolve territory combat
  socket.on('game:resolveTerritoryCombat', ({ territoryId, winnerId }) => {
    const player = Object.values(players).find(p => p.socketId === socket.id);
    if (!player) return;
    
    const gameId = player.gameId;
    if (!gameId || !games[gameId]) return;
    
    // Broadcast to all players
    io.to(gameId).emit('game:territoryUpdate', {
      territoryId,
      ownerId: winnerId,
    });
  });
  
  // Update resources
  socket.on('game:updateResources', ({ playerId, resources }) => {
    const player = players[playerId];
    if (!player) return;
    
    const gameId = player.gameId;
    if (!gameId || !games[gameId]) return;
    
    // Broadcast to all players
    io.to(gameId).emit('game:resourceUpdate', {
      playerId,
      resources,
    });
  });

  */
 
  // Disconnect handler
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    let playerGameId = playersGamesMap.get(socket.id)
    let playerCurrentGame = activeGames.get(playerGameId)
    if(!playerCurrentGame) return
    // Remove player from game
    const player = playerCurrentGame.players.get(socket.id)
    if(!player) return
    // If player was host, reassign host
    if (player.isHost) {
      const [newHostId] = playerCurrentGame.players.keys();
      if (playerCurrentGame.players.size === 0)
        activeGames.delete(playerGameId)
      else{
        playerCurrentGame.host = newHostId || null;
        const newHost = playerCurrentGame.players.get(newHostId);
        newHost.isHost=true
      }
    }
    playerCurrentGame.players.delete(socket.id)
    playersGamesMap.delete(socket.id);

    io.to(playerGameId).emit('game:playerLeft', Array.from(playerCurrentGame.players.values()))
  });
});

// API endpoints
app.get('/api/health', (req, res) => {
  console.log('New request health:');
  res.status(200).json({ status: 'ok' });
});

app.post("/api/token", async (req, res) => {
  // Exchange the code for an access_token
  const response = await fetch(`https://discord.com/api/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.VITE_DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code: req.body.code,
    }),
  });
  const { access_token } = await response.json();
  res.send({access_token});
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});