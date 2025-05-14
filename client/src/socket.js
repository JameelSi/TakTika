import { io } from 'socket.io-client';

let socket;

export const initSocket = () => {
  if (socket) {
    return socket;
  }
  
  // In development, connect to localhost
  // In production, this would be the deployed server URL
  const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
  
  socket = io(serverUrl, {
    transports: ['websocket'],
    autoConnect: true,
  });
  
  socket.on('connect', () => {
    console.log('Connected to server with ID:', socket.id);
  });
  
  socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
  });
  
  socket.on('disconnect', (reason) => {
    console.log('Disconnected:', reason);
  });
  
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

export const emitEvent = (event, data) => {
  const socketInstance = getSocket();
  socketInstance.emit(event, data);
};

export const subscribeToEvent = (event, callback) => {
  const socketInstance = getSocket();
  socketInstance.on(event, callback);
  
  return () => {
    socketInstance.off(event, callback);
  };
};