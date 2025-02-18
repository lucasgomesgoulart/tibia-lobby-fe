import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, LogOut, Users, Sword, Shield, Skull, Gamepad, Crown } from "lucide-react";
import API_BASE_URL from "@/apiConfig";
import CreateLobbyModal from "./CreateLobbyModal";
import { useLobby } from "@/hooks/useLobby";
import Image from 'next/image';

export default function LobbyDisplay() {
  const {
    lobby,
    isLoggedIn,
    userId,
    loading,
    error,
    refresh
  } = useLobby();

  const [showCreateModal, setShowCreateModal] = useState(false);

  // Função para sair ou excluir a lobby (endpoint unificado do backend)
  const handleLeaveOrDeleteLobby = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/lobby/my-lobby`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erro ao atualizar a lobby");
      alert(data.message);
      refresh();
    } catch (err: any) {
      console.error("Erro ao atualizar a lobby:", err);
      alert(err.message || "Erro desconhecido ao atualizar a lobby");
    }
  };

  if (!isLoggedIn) {
    return (
      <p className="text-gray-400 text-sm text-center">
        Você precisa estar logado para visualizar sua lobby.
      </p>
    );
  }

  if (loading) {
    return <p className="text-gray-400 text-sm text-center">Carregando lobby...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-sm text-center">{error}</p>;
  }

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
            onLobbyCreated={() => {
              setShowCreateModal(false);
              refresh();
            }}
          />
        )}
      </>
    );
  }

  // Considerando que os jogadores retornados já são ativos (left_at === null)
  const activePlayers = lobby.players.filter((player) => player.left_at === null);
  // Assume que o líder é o primeiro da lista
  const leaderIndex = 0;

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 rounded-2xl shadow-2xl border border-gray-700 text-white space-y-4">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          {lobby.title}
        </h3>
        <div className="flex items-center space-x-2">
          <Gamepad className="w-8 h-8 text-purple-400" />
          <span className="text-sm text-gray-300">{lobby.activityType}</span>
        </div>
      </div>

      {/* Contagem de Jogadores */}
      <div className="flex items-center space-x-4">
        <Users className="w-6 h-6 text-blue-400" />
        <p className="text-sm text-gray-300">
          Jogadores: {activePlayers.length}/{lobby.maxPlayers}
        </p>
      </div>

      {/* Lista de Jogadores */}
      <div className="space-y-3">
        {activePlayers.map((player, idx) => {
          const isLeader = idx === leaderIndex;
          return (
            <div
              key={idx}
              className={`flex justify-between items-center p-3 rounded-lg transition-all duration-200 ${isLeader ? "bg-gray-700 border border-yellow-400" : "bg-gray-700 hover:bg-gray-600"
                }`}
            >
              <div className="flex items-center space-x-3">
                {isLeader ? (
                  <Image
                    src="/images/geral-icons/Shared_Lider_Icon.gif"
                    alt="Líder da Party"
                    width={15}
                    height={15}
                  />
                ) : (
                  <Image
                    src="/images/geral-icons/Shared_Member_Icon.gif"
                    alt="Membro da Party"
                    width={15}
                    height={15}
                  />
                )}
                <span className="font-medium">{player.character.name}</span>
              </div>
              <span className="text-sm text-gray-300">{player.character.vocation}</span>
            </div>
          );
        })}
      </div>

      {/* Botões de Ação */}
      <div className="flex justify-end space-x-3">
        {lobby.owner.id === userId ? (
          <Button
            variant="destructive"
            className="bg-gradient-to-r from-red-500 to-pink-600"
            onClick={handleLeaveOrDeleteLobby}
          >
            <Trash2 className="w-5 h-5 mr-2" /> Excluir Lobby
          </Button>
        ) : (
          <Button
            variant="destructive"
            className="bg-gradient-to-r from-purple-500 to-blue-600"
            onClick={handleLeaveOrDeleteLobby}
          >
            <LogOut className="w-5 h-5 mr-2" /> Sair da Lobby
          </Button>
        )}
      </div>
    </div>
  );
}
