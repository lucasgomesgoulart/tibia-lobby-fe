import { useState, useEffect } from 'react';
import { lobbiesApi } from '@/lib/api/lobbies';
import { Lobby, UserLobbyData } from '@/types/lobby';

// Tipos movidos para src/types/lobby.ts

interface UseLobbyReturn {
  userLobby: UserLobbyData | null;
  allLobbies: Lobby[];
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useLobby(): UseLobbyReturn {
  const [userLobby, setUserLobby] = useState<UserLobbyData | null>(null);
  const [allLobbies, setAllLobbies] = useState<Lobby[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar o overview (lobby do usuário e listagem de lobbies)
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }
    setIsLoggedIn(true);
    try {
      const result = await lobbiesApi.overview();
      if (result?.data) {
        setAllLobbies(result.data.allLobbies || []);
        setUserLobby(result.data.userLobby || null);
      } else {
        setUserLobby(null);
        setAllLobbies([]);
      }
    } catch (err: any) {
      console.error('Erro em lobbiesApi.overview:', err);
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refresh = () => {
    fetchData();
  };

  return {
    userLobby,
    allLobbies,
    isLoggedIn,
    loading,
    error,
    refresh,
  };
}
