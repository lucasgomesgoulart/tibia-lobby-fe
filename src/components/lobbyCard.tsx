"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Users, Activity } from "lucide-react";
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

interface Player {
  id: string; // ID do jogador (precisa estar presente)
  character: {
    name: string;
    vocation: string;
  };
}

interface Lobby {
  id: string;
  title: string;
  minLevel: number;
  maxLevel: number;
  maxPlayers: number;
  minPlayers: number;
  activityType: string;
  discordChannelLink: string;
  created_at: string;
  players: Player[];
  owner: {
    id: string;
    // ...outras propriedades do owner
  };
}

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
  const activePlayersCount = lobby.players.length;
  const { border, bg, tag } = activityStyles[lobby.activityType] || activityStyles.EVENT;

  // Estado para controlar a abertura do modal de seleção de personagem
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      if (onLobbyJoined) {
        onLobbyJoined();
      }
    } catch (error: any) {
      console.error("Erro ao entrar na lobby:", error.message);
    }
  };
  

  return (
    <>
      <Card
        className={`relative p-4 shadow-xl rounded-xl ${bg} ${border} border-2 overflow-hidden h-[370px] flex flex-col justify-between`}
      >
        {/* TAG do tipo de atividade */}
        <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold uppercase rounded-bl-lg ${tag}`}>
          {lobby.activityType}
        </div>

        <div className="relative z-10 flex flex-col justify-start h-full text-white">
          <h2 className="font-bold mt-2 mb-2 text-center uppercase text-sm">{lobby.title}</h2>

          <div className="flex justify-between text-xs mb-2 px-2">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {activePlayersCount}/{lobby.maxPlayers} Jogadores
            </div>
            <div className="flex items-center gap-1">
              <Activity className="h-4 w-4" /> {lobby.activityType}
            </div>
          </div>

          {/* Seção de níveis */}
          <div className="flex justify-around items-center bg-white/20 dark:bg-black/40 p-2 rounded-md mx-2">
            <div className="text-center">
              <p className="text-xs text-white/80">Nível Mínimo</p>
              <p className="font-bold text-sm">{lobby.minLevel}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-white/80">Nível Máximo</p>
              <p className="font-bold text-sm">{lobby.maxLevel}</p>
            </div>
          </div>

          {/* Lista de jogadores */}
          <div className="flex flex-col gap-2 mt-3 px-2 overflow-auto">
            {lobby.players.map((player, index) => {
              const isLeader = player.id === lobby.owner?.id;
              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-2 rounded-md border ${
                    isLeader ? "border-yellow-400 animate-pulse" : "border-red-700/50"
                  } ${bg} backdrop-blur-md shadow-md`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={getOutfitImage(player.character.vocation).src}
                      alt={player.character.vocation}
                      className={`h-12 w-12 object-contain shadow-lg ${isLeader ? "ring-4 ring-yellow-400" : ""}`}
                    />
                    <span className="blurred-name text-white/90 font-semibold">{player.character.name}</span>
                  </div>
                  <span className="text-xs font-medium text-white/80">{player.character.vocation}</span>
                </div>
              );
            })}
          </div>

          {/* Botão de entrada */}
          <div className="flex justify-center mt-auto">
            <Button
              className="text-blue-400 hover:text-white transition-colors mt-2 text-lg"
              onClick={handleOpenModal}
            >
              <FiArrowRight />
              Entrar
            </Button>
          </div>
        </div>

        <style jsx>{`
          .blurred-name {
            filter: blur(5px);
            user-select: none;
            pointer-events: none;
          }
        `}</style>
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
