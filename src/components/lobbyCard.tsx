"use client";

import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Users, Activity, Link as LinkIcon, Sword, Shield } from "lucide-react";
import OutfitDruid from "../../public/images/outfits/Druid_Male.gif";
import OutfitHunter from "../../public/images/outfits/Hunter_Male.gif";
import OutfitKnight from "../../public/images/outfits/Knight_Male.gif";
import OutfitMage from "../../public/images/outfits/Mage_Male.gif";
import { Button } from "./ui/button";
import { FiArrowRight } from "react-icons/fi";
import { CharacterSelectionModal } from "./CharacterSelectionModal";
import API_BASE_URL from "@/apiConfig";
import { useCharacters } from "@/hooks/useCharacters";
import { useSocket } from '@/hooks/useSocket';

import { Lobby } from "@/types/lobby";

interface LobbyCardProps {
  lobby: Lobby;
  onLobbyJoined?: () => void;
}

// Cores para cada atividade
const activityStyles: Record<string, { border: string; bg: string; tag: string }> = {
  PVP: { border: "border-red-600", bg: "bg-red-900/50", tag: "bg-red-600 text-white" },
  HUNT: { border: "border-green-600", bg: "bg-green-900/50", tag: "bg-green-600 text-white" },
  QUEST: { border: "border-blue-600", bg: "bg-blue-900/50", tag: "bg-blue-600 text-white" },
  BOSS: { border: "border-purple-600", bg: "bg-purple-900/50", tag: "bg-purple-600 text-white" },
  WAR: { border: "border-yellow-600", bg: "bg-yellow-900/50", tag: "bg-yellow-600 text-white" },
  EVENT: { border: "border-orange-600", bg: "bg-orange-900/50", tag: "bg-orange-600 text-white" },
};

const getOutfitImage = (vocation: string) => {
  switch (vocation.toLowerCase()) {
    case "druid":
      return OutfitDruid;
    case "paladin":
      return OutfitHunter;
    case "knight":
      return OutfitKnight;
    case "sorcerer":
      return OutfitMage;
    default:
      return OutfitMage;
  }
};

export default function LobbyCard({ lobby, onLobbyJoined }: LobbyCardProps) {

  const socket = useSocket();
  const activePlayers = useMemo(
    () => (lobby.players || []).filter((p) => !p.left_at),
    [lobby.players]
  );
  const activePlayersCount = activePlayers.length || 0;
  const activityName = lobby.activityType?.name || "EVENT";
  const { border, bg, tag } = activityStyles[activityName] || activityStyles.EVENT;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const occupancy = Math.min(1, activePlayersCount / (lobby.maxPlayers || 1));
  const availableSlots = Math.max(0, (lobby.maxPlayers || 0) - activePlayersCount);

  // Usa o hook para obter os personagens do usuário
  const { characters, loading, error } = useCharacters();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Lógica para entrar na lobby, chamando o endpoint de joinLobby
  const handleCharacterSelect = async (characterId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/lobby-players/join/${lobby.id}/${characterId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erro ao entrar na lobby");
      }
  
      if (socket) {
        socket.emit("joinLobbyRoom", lobby.id);
      }
  
      setIsModalOpen(false);
      
      // Aumenta o delay para dar mais tempo ao backend de atualizar os dados
      setTimeout(() => {
        if (onLobbyJoined) onLobbyJoined();
      }, 2000);
    } catch (error: any) {
      console.error("Erro ao entrar na lobby:", error.message);
    }
  };
  
  return (
    <>
      <Card
        className={`relative p-4 shadow-xl rounded-xl ${bg} ${border} border-2 overflow-hidden h-[380px] flex flex-col gap-3 text-white`}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[11px] uppercase tracking-[0.08em] text-white/70">Lobby</p>
            <h2 className="font-bold text-lg leading-tight">{lobby.title}</h2>
            <div className="flex items-center gap-3 text-xs text-white/70 mt-1">
              <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {activePlayersCount}/{lobby.maxPlayers}</span>
              <span className="flex items-center gap-1"><Activity className="h-4 w-4" /> lvl {lobby.minLevel}-{lobby.maxLevel || '∞'}</span>
            </div>
          </div>
          <div className={`px-3 py-1 text-xs font-bold uppercase rounded-lg ${tag}`}>{activityName}</div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-white/70">
            <span>Ocupação</span>
            <span>{Math.round(occupancy * 100)}%</span>
          </div>
          <div className="h-2 rounded-full bg-black/30 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all"
              style={{ width: `${occupancy * 100}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-white/80">
          <div className="flex items-center gap-2 rounded-lg border border-white/10 px-2 py-1">
            <Sword className="h-4 w-4 text-emerald-300" />
            <span>Min {lobby.minPlayers} / Max {lobby.maxPlayers} players</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-white/10 px-2 py-1">
            <Shield className="h-4 w-4 text-sky-300" />
            <span>Nível {lobby.minLevel} - {lobby.maxLevel || '∞'}</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-2 overflow-hidden">
          <p className="text-[11px] uppercase tracking-[0.08em] text-white/60">Jogadores</p>
          <div className="flex-1 overflow-auto space-y-2 pr-1">
            {activePlayers.map((player, index) => {
              const isLeader = player.isLeader || player.character.id === lobby.owner?.id;
              return (
                <div
                  key={`${player.id}-${index}`}
                  className={`flex items-center justify-between p-2 rounded-lg border border-white/10 bg-white/5 ${isLeader ? "ring-1 ring-yellow-400/60" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={getOutfitImage(player.character.vocation).src}
                      alt={player.character.vocation}
                      className={`h-10 w-10 object-contain rounded-md ${isLeader ? "ring-2 ring-yellow-400" : ""}`}
                    />
                    <div>
                      <p className="font-semibold text-sm">{player.character.name}</p>
                      <p className="text-[11px] text-white/60">{player.character.vocation}</p>
                    </div>
                  </div>
                  {isLeader && <span className="text-[10px] uppercase font-semibold text-yellow-300">Líder</span>}
                </div>
              );
            })}
            {availableSlots > 0 && Array.from({ length: availableSlots }).map((_, idx) => (
              <div key={`slot-${idx}`} className="flex items-center justify-between p-2 rounded-lg border border-dashed border-white/15 text-white/50 bg-black/20">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md border border-white/10 bg-black/30" />
                  <div>
                    <p className="font-semibold text-sm">Slot livre</p>
                    <p className="text-[11px]">Aguardando jogador</p>
                  </div>
                </div>
                <span className="text-[10px] uppercase">Convidar</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 mt-auto">
          <Button
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
            onClick={handleOpenModal}
          >
            <FiArrowRight className="mr-2" />
            Entrar
          </Button>
          {lobby.discordChannelLink && (
            <a
              href={lobby.discordChannelLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-xs text-white/80 px-3 py-2 rounded-lg border border-white/10 hover:border-white/30 transition"
            >
              <LinkIcon className="h-4 w-4" /> Discord
            </a>
          )}
        </div>
      </Card>
      {isModalOpen && (
        <CharacterSelectionModal
          characters={characters}
          onSelect={handleCharacterSelect}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
