"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, LogOut, Users, Gamepad } from "lucide-react";
import Image from "next/image";
import API_BASE_URL from "@/apiConfig";
import CreateLobbyModal from "./CreateLobbyModal";
import { useLobby } from "@/hooks/useLobby";
import { useSocket } from "@/hooks/useSocket";
import { IUser } from "@/hooks/useUser";

// Exemplo de interface para LobbyPlayer
export interface ILobbyPlayer {
  id: string;
  left_at: number | null;
  isLeader: boolean;
  character: {
    id: string;
    name: string;
    vocation: string;
    level: number;
  };
}

interface LobbySidebarProps {
  user: IUser | null;
  loading: boolean;
  error: string;
}

// Supondo que a resposta da lobby (userLobby.lobby) agora inclui a flag isOwner
export interface ILobby {
  id: string;
  title: string;
  minLevel: number;
  maxLevel: number;
  maxPlayers: number;
  minPlayers: number;
  activityType: string;
  owner: {
    id: string;
    username: string;
  };
  players: ILobbyPlayer[];
  discordChannelLink: string;
  isDeleted: boolean;
  isOwner: boolean; // flag informada pelo backend
  created_at: string;
  updated_at: string;
}

export default function LobbySidebar({ user, loading, error }: LobbySidebarProps) {
  const { userLobby, isLoggedIn, refresh } = useLobby();
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const socket = useSocket(); // Agora tipado como Socket | null

  // Ao detectar que o usuário possui uma lobby, entra na room específica
  useEffect(() => {
    if (socket && userLobby?.lobby?.id) {
      console.log("LobbySidebar: Entrando na room da lobby:", userLobby.lobby.id);
      socket.emit("joinLobbyRoom", userLobby.lobby.id);
    }
  }, [socket, userLobby]);

  // Listeners para atualizar a sidebar em tempo real
  useEffect(() => {
    if (!socket) return;

    const handleLobbyDeleted = ({ lobbyId }: { lobbyId: string }) => {
      console.log("LobbySidebar: lobbyDeleted recebido para lobby:", lobbyId);
      refresh();
    };

    const handleLobbyUpdated = (update: any) => {
      console.log("LobbySidebar: lobbyUpdated recebido:", update);
      refresh();
    };

    const handlePlayerJoined = (newPlayer: any) => {
      console.log("LobbySidebar: playerJoined recebido:", newPlayer);
      refresh();
    };

    const handlePlayerLeft = (data: any) => {
      console.log("LobbySidebar: playerLeft recebido:", data);
      refresh();
    };

    const handleKickExpired = (data: any) => {
      console.log("LobbySidebar: kickExpired recebido:", data);
      refresh();
    };

    socket.on("lobbyDeleted", handleLobbyDeleted);
    socket.on("lobbyUpdated", handleLobbyUpdated);
    socket.on("playerJoined", handlePlayerJoined);
    socket.on("playerLeft", handlePlayerLeft);
    socket.on("kickExpired", handleKickExpired);

    return () => {
      socket.off("lobbyDeleted", handleLobbyDeleted);
      socket.off("lobbyUpdated", handleLobbyUpdated);
      socket.off("playerJoined", handlePlayerJoined);
      socket.off("playerLeft", handlePlayerLeft);
      socket.off("kickExpired", handleKickExpired);
    };
  }, [socket, refresh]);

  const handleLeaveOrDeleteLobby = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/lobby-players/my-lobby`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Erro ao atualizar a lobby");

      alert(data.message);

      if (socket && userLobby?.lobby?.id) {
        console.log("LobbySidebar: Emitindo leaveLobbyRoom para a lobby:", userLobby.lobby.id);
        socket.emit("leaveLobbyRoom", userLobby.lobby.id);
      }
      refresh();
    } catch (err: any) {
      console.error("Erro ao atualizar a lobby:", err);
      alert(err.message || "Erro desconhecido ao atualizar a lobby");
    }
  };

  const handleKickPlayer = async (targetCharacterId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/lobby-players/kick/${userLobby?.lobby.id}/${targetCharacterId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Erro ao expulsar jogador");
      alert(data.message);
      refresh();
    } catch (err: any) {
      console.error("Erro ao expulsar jogador:", err);
      alert(err.message || "Erro desconhecido ao expulsar jogador");
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
    return (
      <p className="text-gray-400 text-sm text-center">Carregando lobby...</p>
    );
  }

  if (error) {
    return <p className="text-red-500 text-sm text-center">{error}</p>;
  }

  if (!userLobby) {
    return (
      <div className="text-center">
        <p className="text-gray-400 text-md mt-4">Você não está em nenhuma lobby.</p>
        <Button onClick={() => setShowCreateModal(true)} className="mt-4 w-full">
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
      </div>
    );
  }

  const { lobby } = userLobby;
  // Usa o type assertion para garantir que players está como ILobbyPlayer[]
  const activePlayers = (lobby.players as ILobbyPlayer[]).filter(
    (player) => player.left_at === null
  );

  return (
    <div className="bg-gray-800 p-4 rounded-md shadow-sm text-white space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          {lobby.title}
        </h3>
        <div className="flex items-center space-x-2">
          <Gamepad className="text-purple-400 w-7 h-7" />
          <span className="text-sm text-gray-300">
            {lobby.activityType}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Users className="w-6 h-6 text-gray-300" />
        <p className="text-sm text-gray-300">
          {activePlayers.length}/{lobby.maxPlayers} Jogadores
        </p>
      </div>

      <div className="space-y-2 max-h-32 overflow-y-auto">
        {activePlayers.map((player: ILobbyPlayer) => {
          const isLeader = player.isLeader;
          return (
            <div
              key={player.id}
              className={`flex items-center p-2 rounded transition-all duration-200 ${
                isLeader
                  ? "bg-gray-700 border border-yellow-400"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-[140px]">
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
              <div className="w-32 text-sm text-gray-300 text-center">
                {player.character.vocation}
              </div>
              <div className="flex items-center gap-1 w-24 justify-end">
                <Image
                  src="/images/geral-icons/XP_Boost.gif"
                  alt="XP Boost"
                  width={20}
                  height={20}
                />
                <span className="text-sm text-gray-300">
                  {player.character.level || "-"}
                </span>
              </div>
              <div className="w-12 flex justify-end">
                {/* Usa a flag isOwner em vez de comparar com userId */}
                {lobby.isOwner && !isLeader ? (
                  <Button
                    variant="destructive"
                    onClick={() => handleKickPlayer(player.character.id)}
                    className="p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                ) : (
                  <div className="w-12" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end space-x-3">
        {lobby.isOwner ? (
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
