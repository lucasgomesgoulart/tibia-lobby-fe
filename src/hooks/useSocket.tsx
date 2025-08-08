// hooks/useSocket.ts
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (): Socket | null => {
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const socket: Socket = io('http://localhost:3000', {
      query: { token },
      transports: ['websocket'], // Opcional: se quiser forçar o uso de websocket
    });

    socket.on('connect', () => {
      console.log('Conectado ao Socket.IO:', socket.id);
      // Emite o evento joinLobbyList quando a conexão for estabelecida
      socket.emit('joinLobbyList');
    });

    setSocketInstance(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  return socketInstance;
};
