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

export interface ILobbyPlayer {
  id: string;
  left_at: string | null;
  isLeader?: boolean;
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

export interface ILobby {
  id: string;
  title: string;
  minLevel: number;
  maxLevel: number;
  maxPlayers: number;
  minPlayers: number;
  activityType: { id: string; name: string };
  owner: {
    id: string;
    username: string;
  };
  players: ILobbyPlayer[];
  discordChannelLink: string;
  isDeleted: boolean;
  created_at: string;
  updated_at: string;
}

export default function LobbySidebar({ user, loading, error }: LobbySidebarProps) {
  const { userLobby, isLoggedIn, refresh } = useLobby();
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const socket = useSocket();

  useEffect(() => {
    if (socket && userLobby?.lobby?.id) {
      socket.emit("joinLobbyRoom", userLobby.lobby.id);
    }
  }, [socket, userLobby]);

  useEffect(() => {
    if (!socket) return;

    const handlers: Record<string, (...args: any[]) => void> = {
      lobbyDeleted: () => refresh(),
      lobbyUpdated: () => refresh(),
      playerJoined: () => refresh(),
      playerLeft: () => refresh(),
      kickExpired: () => refresh(),
    };

    Object.entries(handlers).forEach(([event, handler]) => socket.on(event, handler));
    return () => Object.entries(handlers).forEach(([event, handler]) => socket.off(event, handler));
  }, [socket, refresh]);

  const handleLeaveOrDeleteLobby = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/lobby-players/my-lobby`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erro ao atualizar a lobby");

      alert(data.message);

      if (socket && userLobby?.lobby?.id) {
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
      if (!response.ok) throw new Error(data.message || "Erro ao expulsar jogador");
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
        <CreateLobbyModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onLobbyCreated={() => {
            setShowCreateModal(false);
            refresh();
          }}
        />
      </div>
    );
  }

  const { lobby } = userLobby;
  const activePlayers = (lobby.players || []).filter((player) => !player.left_at) as ILobbyPlayer[];
  const isOwner = user?.id === lobby.owner.id;
  const occupancy = Math.min(1, activePlayers.length / (lobby.maxPlayers || 1));

  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-sm text-white space-y-4 border border-white/5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.08em] text-white/60">Minha Lobby</p>
          <h3 className="text-2xl font-bold">{lobby.title}</h3>
          <div className="flex items-center gap-2 text-xs text-white/60 mt-1">
            <Gamepad className="w-4 h-4" />
            <span>{lobby.activityType?.name}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/60">Players</p>
          <p className="text-lg font-semibold">{activePlayers.length}/{lobby.maxPlayers}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-white/70">
          <span>Ocupação</span>
          <span>{Math.round(occupancy * 100)}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
            style={{ width: `${occupancy * 100}%` }}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-white/70">
          <div className="rounded-lg border border-white/10 px-3 py-2">
            <p className="text-white/50">Nível</p>
            <p className="font-semibold text-white">{lobby.minLevel} - {lobby.maxLevel || '∞'}</p>
          </div>
          <div className="rounded-lg border border-white/10 px-3 py-2">
            <p className="text-white/50">Máx. jogadores</p>
            <p className="font-semibold text-white">{lobby.maxPlayers}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
        {activePlayers.map((player: ILobbyPlayer) => {
          const isLeaderPlayer = player.isLeader || player.character?.id === lobby.owner.id;
          return (
            <div
              key={player.id}
              className={`flex items-center p-2 rounded-lg border border-white/10 bg-white/5 ${
                isLeaderPlayer ? "ring-1 ring-yellow-400/60" : ""
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-[140px]">
                {isLeaderPlayer ? (
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
                <div>
                  <p className="font-semibold">{player.character.name}</p>
                  <p className="text-xs text-white/60">{player.character.vocation}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 w-20 justify-end text-sm text-white/80">
                <Image
                  src="/images/geral-icons/XP_Boost.gif"
                  alt="XP Boost"
                  width={18}
                  height={18}
                />
                <span>{player.character.level || "-"}</span>
              </div>
              <div className="w-12 flex justify-end">
                {isOwner && !isLeaderPlayer ? (
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
        {activePlayers.length === 0 && (
          <p className="text-center text-white/60 text-sm">Sem jogadores ainda.</p>
        )}
      </div>

      <div className="flex justify-between gap-3">
        {isOwner ? (
          <>
            <Button
              variant="destructive"
              className="bg-gradient-to-r from-red-500 to-pink-600 flex-1"
              onClick={handleLeaveOrDeleteLobby}
            >
              <Trash2 className="w-5 h-5 mr-2" /> Fechar Lobby
            </Button>
          </>
        ) : (
          <Button
            variant="destructive"
            className="bg-gradient-to-r from-purple-500 to-blue-600 flex-1"
            onClick={handleLeaveOrDeleteLobby}
          >
            <LogOut className="w-5 h-5 mr-2" /> Sair da Lobby
          </Button>
        )}
      </div>
    </div>
  );
}
