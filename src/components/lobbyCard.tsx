"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Users, Activity } from "lucide-react";
import OutfitDruid from '../../public/images/outfits/druid.png';
import OutfitHunter from '../../public/images/outfits/hunter.png';
import OutfitKnight from '../../public/images/outfits/knight.png';
import OutfitMage from '../../public/images/outfits/mage.png';
import cardDourado from '../../public/images/cards/preto.png';

interface Player {
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
}

interface LobbyCardProps {
  lobby: Lobby;
}

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

export default function LobbyCard({ lobby }: LobbyCardProps) {
  const activePlayersCount = lobby.players.length;

  return (
    <Card className="relative p-4 shadow-xl rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 text-white border border-gray-700 overflow-hidden">
      <img src={cardDourado.src} alt="Moldura Dourada" className="absolute inset-0 w-full h-full object-cover z-0" />
      <div className="relative z-10">
        <h2 className="font-bold mb-2 text-center uppercase">{lobby.title}</h2>

        <div className="flex justify-between text-sm mb-4">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {activePlayersCount}/{lobby.maxPlayers} Jogadores
          </div>
          <div className="flex items-center gap-1">
            <Activity className="h-4 w-4" /> {lobby.activityType}
          </div>
        </div>

        <div className="flex justify-around items-center bg-gray-700 p-2 rounded-md">
          <div className="text-center">
            <p className="text-xs">Nível Mínimo</p>
            <p className="font-bold text-lg">{lobby.minLevel}</p>
          </div>
          <div className="text-center">
            <p className="text-xs">Nível Máximo</p>
            <p className="font-bold text-lg">{lobby.maxLevel}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          {lobby.players.map((player, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-800 p-2 rounded-md">
              <div className="flex items-center gap-2">
                <img
                  src={getOutfitImage(player.character.vocation).src}
                  alt={player.character.vocation}
                  className="h-10 w-10"
                />
                <span className="blurred-name">{player.character.name}</span>
              </div>
              <span className="text-sm text-gray-400">{player.character.vocation}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-4 text-xs">
          <a
            href={lobby.discordChannelLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-600 transition-colors"
          >
            Acessar Discord
          </a>
        </div>
      </div> {/* ✅ Fechamento da div com z-10 */}

      <style jsx>{`
        .blurred-name {
          filter: blur(5px);
          user-select: none;
          pointer-events: none;
        }
      `}</style>
    </Card>
  );
}
