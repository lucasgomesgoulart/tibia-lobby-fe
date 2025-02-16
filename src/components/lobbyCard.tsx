import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Users, Activity } from "lucide-react";
import { Button } from "./ui/button";
import { FiArrowRight } from "react-icons/fi";
import API_BASE_URL from "@/apiConfig";
import { CharacterSelectionModal } from "./CharacterSelectionModal";
import { PlayerList } from "./PlayerList";
import { LevelSection } from "./LevelSection";

const activityStyles: Record<string, { border: string; bg: string; tag: string }> = {
  PVP: { border: "border-red-600", bg: "bg-red-900/50", tag: "bg-red-600 text-white" },
  HUNT: { border: "border-green-600", bg: "bg-green-900/50", tag: "bg-green-600 text-white" },
  QUEST: { border: "border-blue-600", bg: "bg-blue-900/50", tag: "bg-blue-600 text-white" },
  BOSS: { border: "border-purple-600", bg: "bg-purple-900/50", tag: "bg-purple-600 text-white" },
  WAR: { border: "border-yellow-600", bg: "bg-yellow-900/50", tag: "bg-yellow-600 text-white" },
  EVENT: { border: "border-orange-600", bg: "bg-orange-900/50", tag: "bg-orange-600 text-white" },
};

export interface Character {
  id: string;
  name: string;
  serverType: "GLOBAL" | "OTSERVER";
  vocation: "DRUID" | "SORCERER" | "KNIGHT" | "PALADIN";
  level?: number;
  world?: { id: string; name: string; isGlobal: boolean };
  otServer?: { id: string; name: string };
}

export interface Player {
  character: Character;
  left_at: number | null;
}

export interface Lobby {
  id: string;
  title: string;
  minLevel: number;
  maxLevel: number;
  maxPlayers: number;
  minPlayers: number;
  activityType: "PVP" | "HUNT" | "QUEST" | "BOSS" | "WAR" | "EVENT";
  discordChannelLink: string;
  isDeleted?: boolean;
  created_at?: Date;
  updated_at?: Date;
  ownerId: string;
  players: Player[];
}

// Adicionamos a prop onLobbyJoined para notificar o pai que houve um join
export default function LobbyCard({ lobby, onLobbyJoined }: { lobby: Lobby; onLobbyJoined: () => void }) {
  // Se a lobby não tiver dono, não renderiza nada.
  if (!lobby.ownerId) {
    return null;
  }

  const [characters, setCharacters] = useState<Character[]>([]);
  const [showModal, setShowModal] = useState(false);
  const { border, bg, tag } = activityStyles[lobby.activityType] || activityStyles.EVENT;

  // Filtra apenas os jogadores ativos (left_at === null)
  const playersInLobby = lobby.players.filter((player) => player.left_at === null);

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/characters`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setCharacters(data.data);
    } catch (error) {
      console.error("Erro ao buscar personagens:", error);
    }
  };

  const handleCharacterSelect = async (characterId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/lobby-players/join/${lobby.id}/${characterId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erro ao entrar na lobby");
      alert(data.message);
      setShowModal(false);
      // Chama o callback para atualizar a lobby após o join
      onLobbyJoined();
    } catch (error: any) {
      console.error("Erro ao entrar na lobby:", error);
      alert(error.message || "Erro desconhecido ao entrar na lobby.");
    }
    // Opcional: atualizar a lista de personagens, se necessário
    fetchCharacters();
  };

  return (
    <>
      <Card className={`relative p-4 shadow-xl rounded-xl ${bg} ${border} border-2 overflow-hidden h-[370px] flex flex-col justify-between`}>
        <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold uppercase rounded-bl-lg ${tag}`}>
          {lobby.activityType}
        </div>
        <div className="relative z-10 flex flex-col justify-start h-full text-white">
          <h2 className="font-bold mt-2 mb-2 text-center uppercase text-sm">{lobby.title}</h2>
          <div className="flex justify-between text-xs mb-2 px-2">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {lobby.players.length}/{lobby.maxPlayers} Jogadores
            </div>
            <div className="flex items-center gap-1">
              <Activity className="h-4 w-4" /> {lobby.activityType}
            </div>
          </div>
          <LevelSection minLevel={lobby.minLevel} maxLevel={lobby.maxLevel} />
          <PlayerList players={playersInLobby} bg={bg} />
          <div className="flex justify-center mt-auto">
            <Button onClick={() => setShowModal(true)} className="text-blue-400 hover:text-white transition-colors mt-2 text-lg">
              <FiArrowRight />
              Entrar
            </Button>
          </div>
        </div>
      </Card>
      {showModal && (
        <CharacterSelectionModal
          characters={characters}
          onSelect={handleCharacterSelect}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
