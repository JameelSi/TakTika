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
const games = {};
const players = {};

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Join game
  socket.on('game:join', ({ userId, username }) => {
    console.log(`Player ${username} (${userId}) joined`);
    
    // Add player to players list
    players[userId] = {
      id: userId,
      username,
      socketId: socket.id,
      gameId: null,
    };
    
    // Check if a game is available or create a new one
    let gameId = Object.keys(games).find(id => games[id].players.length < 4);
    
    if (!gameId) {
      // Create new game
      gameId = uuidv4();
      games[gameId] = {
        id: gameId,
        players: [],
        territories: [],
        currentTurn: 1,
        currentPlayerId: null,
        timeOfDay: 'day',
        startedAt: null,
      };
    }
    
    // Add player to game
    games[gameId].players.push(userId);
    players[userId].gameId = gameId;
    
    // Join socket room for this game
    socket.join(gameId);
    
    // Notify other players
    socket.to(gameId).emit('game:playerJoined', {
      playerId: userId,
      username,
    });
    
    console.log(`Player ${username} joined game ${gameId}`);
  });
  
  // Select faction
  socket.on('game:selectFaction', ({ playerId, factionId }) => {
    const player = players[playerId];
    if (!player) return;
    
    const gameId = player.gameId;
    if (!gameId || !games[gameId]) return;
    
    // Update game state and broadcast to all players
    io.to(gameId).emit('game:playerSelectFaction', {
      playerId,
      factionId,
    });
    
    // If this is the first player to select a faction, make them the current player
    if (!games[gameId].currentPlayerId) {
      games[gameId].currentPlayerId = playerId;
      io.to(gameId).emit('game:turn', {
        turn: games[gameId].currentTurn,
        playerId,
      });
    }
  });
  
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
  
  // Disconnect handler
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    // Find player by socket ID
    const player = Object.values(players).find(p => p.socketId === socket.id);
    if (!player) return;
    
    // Remove player from game
    const gameId = player.gameId;
    if (gameId && games[gameId]) {
      games[gameId].players = games[gameId].players.filter(id => id !== player.id);
      
      // Notify other players
      socket.to(gameId).emit('game:playerLeft', {
        playerId: player.id,
        username: player.username,
      });
      
      // If no players left, remove the game
      if (games[gameId].players.length === 0) {
        delete games[gameId];
      }
    }
    
    // Remove player from players list
    delete players[player.id];
  });
});

// API endpoints
app.get('/api/health', (req, res) => {
  console.log('New request health:');
  res.status(200).json({ status: 'ok' });
});

app.get('/api/games', (req, res) => {
  console.log('New request api/games:');
  res.status(200).json({
    games: Object.values(games).map(game => ({
      id: game.id,
      playerCount: game.players.length,
      started: !!game.startedAt,
    })),
  });
});

app.post("/api/token", async (req, res) => {
console.log('New request api/token:');
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

  // Retrieve the access_token from the response
  const { access_token } = await response.json();

  // Return the access_token to our client as { access_token: "..."}
  res.send({access_token});
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});