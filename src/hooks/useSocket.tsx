// hooks/useSocket.js
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export const useSocket = () => {
  const [socketInstance, setSocketInstance] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:3000', {
      query: { token: localStorage.getItem('token') },
    });

    socket.on('connect', () => {
      console.log('Conectado ao Socket.IO:', socket.id);
      // Emite o evento joinLobbyList quando a conexão for estabelecida
      socket.emit("joinLobbyList");
    });

    setSocketInstance(socket);

    return () => {
      socket.disconnect();
    };
  }, []);
  return socketInstance;
};