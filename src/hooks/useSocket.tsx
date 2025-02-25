// hooks/useSocket.js
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

let socket : any;

export const useSocket = () => {
  const [socketInstance, setSocketInstance] = useState(null);

  useEffect(() => {
    // Altere a URL conforme necessário (por exemplo, 'http://localhost:3000')
    socket = io('http://localhost:3000', {
      // Se necessário, passe parâmetros, como o token
      query: { token: localStorage.getItem('token') },
    });

    socket.on('connect', () => {
      console.log('Conectado ao Socket.IO:', socket.id);
    });

    setSocketInstance(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  return socketInstance;
};
