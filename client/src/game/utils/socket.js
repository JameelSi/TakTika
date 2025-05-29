import { io } from 'socket.io-client';

let socket;

export const initSocket = () => {

  if (!socket) {
    socket = io(window.location.origin, {
      transports: ['websocket'],
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
    });
  }
  socket.on('connect', () => {
    console.log('[Socket] Connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket] Disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('[Socket] Connection error:', error);
  });


  socket.on('reconnect_attempt', (attempt) => {
    console.info(`[Socket] Attempting to reconnect (#${attempt})...`);
  });

  socket.on('reconnect_failed', () => {
    console.log('[Socket] Reconnection failed');
  });

  socket.on('reconnect', (attempt) => {
    console.log(`[Socket] Reconnected after ${attempt} attempt(s).`);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket)
    return initSocket();
  return socket;
};

export const emitEvent = (event, data, callback) => {
  const socketInstance = getSocket();
  if (!socketInstance || !socketInstance.connected)
    console.warn(`Socket not connected. Event "${event}" may not be sent.`);

  socketInstance.emit(event, data, callback);
};

export const subscribeToEvent = (event, callback) => {
  const socketInstance = getSocket();
  socketInstance.on(event, callback);
  return () => { socketInstance.off(event, callback); };
};