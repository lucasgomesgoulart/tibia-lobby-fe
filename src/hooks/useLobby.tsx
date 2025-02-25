import { useState, useEffect } from "react";
import API_BASE_URL from "@/apiConfig";

interface Player {
  isLeader: any;
  character: {
    id: string;
    name: string;
    vocation: string;
    level: string;
    isLeader: boolean;
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
  userId: string;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}


export function useLobby(): UseLobbyReturn {
  const [userLobby, setUserLobby] = useState<UserLobbyData | null>(null);
  const [allLobbies, setAllLobbies] = useState<Lobby[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<any>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Busca se o usuário já está em uma lobby ativa
  const fetchUserLobby = async (token: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/lobby-players/check`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        console.log("Nenhuma lobby ativa encontrada (check).");
        setUserLobby(null);
        return;
      }
      const result = await res.json();
      console.log("Resposta de /lobby-players/check:", result);
      // Se result.data.lobby existir, assume que o usuário está participando de uma lobby
      if (result && result.data && result.data.lobby) {
        setUserLobby({ lobby: result.data.lobby, myCharacterId: result.data.myCharacterId });
      } else {
        setUserLobby(null);
      }
    } catch (err: any) {
      console.error("Erro em /lobby-players/check:", err);
      setError(err.message);
      setUserLobby(null);
    }
  };

  // Busca a lista de todas as lobbies
  const fetchAllLobbies = async (token: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/lobby`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao buscar lobbies.");
      const result = await res.json();
      if (Array.isArray(result.data)) {
        setAllLobbies(result.data);
      } else {
        throw new Error("Formato de resposta inesperado em /lobby.");
      }
    } catch (err: any) {
      console.error("Erro em /lobby:", err);
      setError(err.message);
    }
  };

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
    const storedUserId = localStorage.getItem('user');
    setUserId(storedUserId);

    await Promise.all([fetchUserLobby(token), fetchAllLobbies(token)]);
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
    userId,
    loading,
    error,
    refresh,
  };
}
