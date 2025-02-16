import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, LogOut, Users, Sword, Shield, Skull, Gamepad } from "lucide-react";
import API_BASE_URL from "@/apiConfig";
import CreateLobbyModal from "./CreateLobbyModal";

interface Player {
  character: {
    id?: string;
    name: string;
    vocation: string;
    user?: { id: string }; // incluímos a propriedade user para identificar o dono do character
  };
  left_at: number | null;
}

interface Lobby {
  id: string;
  title: string;
  activityType: string;
  maxPlayers: number;
  players: Player[];
  ownerId: string;
}

export default function LobbyDisplay() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [lobby, setLobby] = useState<Lobby | null>(null);
  const [userId, setUserId] = useState("");
  const [characterId, setCharacterId] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchLobbyData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
      return;
    }
    setIsLoggedIn(true);
    try {
      const response = await fetch(`${API_BASE_URL}/lobby-players/check`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Usuário não está em nenhuma lobby.");
      const data = await response.json();
  
      if (!data.data) {
        setLobby(null);
        return;
      }
  
      const fetchedLobby: Lobby = data.data;
      setUserId(data.userId);
  
      const activePlayers = fetchedLobby.players.filter(
        (player) => player.left_at === null
      );
  
      const isOwner = fetchedLobby.ownerId === data.userId;
  
      if (!isOwner && activePlayers.length === 0) {
        setLobby(null);
      } else {
        setLobby(fetchedLobby);
      }
  
      // Tenta identificar o registro do usuário logado
      let userPlayer = fetchedLobby.players.find(
        (player) =>
          player.left_at === null &&
          player.character &&
          player.character.id &&
          player.character.user &&
          player.character.user.id === data.userId
      );
  
      // Fallback: se não encontrou e houver apenas um player ativo, usamos ele
      if (!userPlayer && activePlayers.length === 1) {
        userPlayer = activePlayers[0];
      }
  
      if (userPlayer && userPlayer.character.id) {
        setCharacterId(userPlayer.character.id);
      } else {
        console.warn("Não foi possível identificar o characterId do usuário logado.");
        setCharacterId("");
      }
    } catch (error) {
      console.error("Erro ao buscar dados do lobby:", error);
      setLobby(null);
    }
  };
  
  useEffect(() => {
    fetchLobbyData();
  }, []);

  const handleLobbyCreated = () => {
    setShowCreateModal(false);
    fetchLobbyData();
  };

  const handleDeleteLobby = async (lobbyId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/lobby-players/left-lobby/${lobbyId}/${characterId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erro ao excluir a lobby");
      alert(data.message);
      setLobby(null);
    } catch (error: any) {
      console.error("Erro ao excluir a lobby:", error);
      alert(error.message || "Erro desconhecido ao excluir a lobby");
    }
  };

  if (!isLoggedIn) {
    return (
      <p className="text-gray-400 text-sm text-center">
        Você precisa estar logado para visualizar sua lobby.
      </p>
    );
  }

  // Se não houver lobby ativa, exibe a mensagem e o botão para criar uma nova lobby
  if (!lobby) {
    return (
      <>
        <p className="text-gray-400 text-sm text-center">Nenhuma lobby encontrada.</p>
        <Button onClick={() => setShowCreateModal(true)} className="mt-4">
          Criar Lobby
        </Button>
        {showCreateModal && (
          <CreateLobbyModal
            onClose={() => setShowCreateModal(false)}
            onLobbyCreated={handleLobbyCreated}
          />
        )}
      </>
    );
  }

  // Filtra os players ativos para exibir na contagem e na lista
  const activePlayers = lobby.players.filter((player) => player.left_at === null);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 rounded-2xl shadow-2xl border border-gray-700 text-white space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          {lobby.title}
        </h3>
        <div className="flex items-center space-x-2">
          <Gamepad className="w-8 h-8 text-purple-400" />
          <span className="text-sm text-gray-300">{lobby.activityType}</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Users className="w-6 h-6 text-blue-400" />
        <p className="text-sm text-gray-300">
          Jogadores: {activePlayers.length}/{lobby.maxPlayers}
        </p>
      </div>

      <div className="space-y-3">
        {activePlayers.map((player, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              {player.character.vocation === "Guerreiro" ? (
                <Sword className="w-5 h-5 text-yellow-400" />
              ) : player.character.vocation === "Mago" ? (
                <Shield className="w-5 h-5 text-blue-400" />
              ) : (
                <Skull className="w-5 h-5 text-red-400" />
              )}
              <span className="font-medium">{player.character.name}</span>
            </div>
            <span className="text-sm text-gray-300">{player.character.vocation}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-3">
        {lobby.ownerId === userId ? (
          <Button
            variant="destructive"
            className="bg-gradient-to-r from-red-500 to-pink-600"
            onClick={() => handleDeleteLobby(lobby.id)}
          >
            <Trash2 className="w-5 h-5 mr-2" /> Excluir Lobby
          </Button>
        ) : (
          <Button
            variant="destructive"
            className="bg-gradient-to-r from-purple-500 to-blue-600"
            onClick={() => handleDeleteLobby(lobby.id)}
          >
            <LogOut className="w-5 h-5 mr-2" /> Sair da Lobby
          </Button>
        )}
      </div>
    </div>
  );
}
