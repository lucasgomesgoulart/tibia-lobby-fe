import { useState, useEffect } from "react";
import API_BASE_URL from "@/apiConfig";

interface Player {
  character: {
    id: string;
    name: string;
    vocation: string;
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
  // Outros campos (minLevel, maxLevel, etc.) se necessário
}

interface UseLobbyReturn {
  lobby: Lobby | null;
  isLoggedIn: boolean;
  userId: string;
  myCharacterId: string;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Retorna o userId armazenado no localStorage.
 * Aqui esperamos que o localStorage possua a chave "userId" contendo o UUID do usuário.
 */
const getStoredUserId = (): string => {
  return localStorage.getItem("userId") || "";
};

/**
 * Retorna o ID do personagem selecionado a partir dos dados armazenados na chave "characters".
 * Aqui esperamos que "characters" contenha um objeto JSON com a propriedade "data", que é um array de personagens.
 * Exemplo:
 * {
 *   "data": [
 *      { "id": "23334637-8f54-48b9-abce-d6e3802f8712", ... },
 *      ...
 *   ]
 * }
 *
 * Neste exemplo, usamos o ID do primeiro personagem.
 */
const getStoredCharacterId = (): string => {
  const stored = localStorage.getItem("characters");
  if (!stored) return "";
  try {
    const parsed = JSON.parse(stored);
    // Verifica se o objeto tem uma propriedade "data" que é um array
    if (parsed && Array.isArray(parsed.data) && parsed.data.length > 0) {
      return parsed.data[0].id;
    }
  } catch (err) {
    console.error("Erro ao parsear 'characters' do localStorage:", err);
  }
  return "";
};

export function useLobby(): UseLobbyReturn {
  const [lobby, setLobby] = useState<Lobby | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [myCharacterId, setMyCharacterId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLobbyData = async () => {
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
      const response = await fetch(`${API_BASE_URL}/lobby`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Erro ao buscar lobbies.");

      const data = await response.json();
      console.log("Lobbies recebidas:", data.data);
      
      if (!Array.isArray(data.data)) {
        throw new Error("Formato de resposta inesperado.");
      }

      // Extrai o userId e o myCharacterId do localStorage
      const storedUserId = getStoredUserId();
      const storedCharacterId = getStoredCharacterId();
      console.log("storedUserId:", storedUserId, "storedCharacterId:", storedCharacterId);
      setUserId(storedUserId);
      setMyCharacterId(storedCharacterId);

      // Procura a lobby na qual o usuário esteja participando:
      // - Se o usuário for o dono (lobby.owner.id === storedUserId)
      // - OU se algum player ativo (left_at === null) tiver character.id igual ao storedCharacterId
      const userLobby = data.data.find((lobby: Lobby) => {
        const isOwner = lobby.owner && lobby.owner.id === storedUserId;
        const isParticipant = lobby.players.some(
          (player) =>
            player.left_at === null &&
            player.character &&
            player.character.id === storedCharacterId
        );
        console.log(`Lobby ${lobby.title}: isOwner=${isOwner}, isParticipant=${isParticipant}`);
        return isOwner || isParticipant;
      });

      if (!userLobby) {
        console.log("Nenhuma lobby encontrada para o usuário.");
        setLobby(null);
      } else {
        console.log("Lobby encontrada:", userLobby.title);
        setLobby(userLobby);
      }
    } catch (err: any) {
      console.error("Erro ao buscar lobbies:", err);
      setError(err.message);
      setLobby(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLobbyData();
  }, []);

  const refresh = () => {
    fetchLobbyData();
  };

  return {
    lobby,
    isLoggedIn,
    userId,
    myCharacterId,
    loading,
    error,
    refresh,
  };
}
