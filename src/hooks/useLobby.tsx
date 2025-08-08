import { useState, useEffect } from "react";
import API_BASE_URL from "@/apiConfig";

interface Player {
  id: string;
  isLeader: boolean;
  character: {
    id: string;
    name: string;
    vocation: string;
    level: string;
  };
  left_at: number | null;
}

interface Owner {
  id: string;
  username: string;
}

export interface Lobby {
  id: string;
  title: string;
  activityType: string;
  maxPlayers: number;
  players: Player[];
  owner: Owner;
  // Outros campos, se necessário
}

export interface UserLobbyData {
  lobby: Lobby;
  myCharacterId: string;
}

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
      const res = await fetch(`${API_BASE_URL}/lobbies/overview`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao buscar o overview.");
      const result = await res.json();
      if (result?.data) {
        setAllLobbies(result.data.allLobbies || []);
        setUserLobby(result.data.userLobby || null);
      } else {
        setUserLobby(null);
        setAllLobbies([]);
      }
    } catch (err: any) {
      console.error("Erro em /lobbies/overview:", err);
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
