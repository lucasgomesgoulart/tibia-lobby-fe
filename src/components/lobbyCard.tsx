"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Users, Activity } from "lucide-react";
import OutfitDruid from '../../public/images/outfits/druid.png';
import OutfitHunter from '../../public/images/outfits/hunter.png';
import OutfitKnight from '../../public/images/outfits/knight.png';
import OutfitMage from '../../public/images/outfits/mage.png';
import cardDourado from '../../public/images/cards/mistico2.png';
import { Button } from "./ui/button";
import { FiArrowRight } from "react-icons/fi";

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
    <Card className="relative p-4 shadow-xl rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 text-white border border-gray-700 overflow-hidden h-[350px] flex flex-col justify-between">

      <div className="relative z-10 flex flex-col justify-start h-full">
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

        <div className="flex justify-around items-center bg-gray-700 p-1 rounded-md mx-2">
          <div className="text-center">
            <p className="text-xs">Nível Mínimo</p>
            <p className="font-bold text-sm">{lobby.minLevel}</p>
          </div>
          <div className="text-center">
            <p className="text-xs">Nível Máximo</p>
            <p className="font-bold text-sm">{lobby.maxLevel}</p>
          </div>
        </div>

        {/* 📋 Lista de Jogadores com Scroll */}

        <div className="flex flex-col gap-1 mt-2 px-2 overflow-auto">
          {lobby.players.map((player, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-800 p-1 rounded-md">
              <div className="flex items-center gap-2">
                <img
                  src={getOutfitImage(player.character.vocation).src}
                  alt={player.character.vocation}
                  className="h-8 w-8"
                />
                <span className="blurred-name">******</span>
              </div>
              <span className="text-xs text-gray-400">{player.character.vocation}</span>
            </div>
          ))}
        </div>

        {/* 🔗 Link do Discord sempre fixo no final */}
        <div className="flex justify-center mt-auto">
          <Button
            className="text-blue-400 hover:text-white transition-colors mt-2 text-lg"
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

  );
}
