import React from "react";
import { Player } from "@/types"; // Supondo que você tenha uma tipagem para Player
import OutfitDruid from "../../public/images/outfits/Druid_Male.gif";
import OutfitHunter from "../../public/images/outfits/Hunter_Male.gif";
import OutfitKnight from "../../public/images/outfits/Knight_Male.gif";
import OutfitMage from "../../public/images/outfits/Mage_Male.gif";

interface PlayerListProps {
  players: Player[];
  bg: string;
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

export const PlayerList = ({ players, bg }: PlayerListProps) => {
  return (
    <div className="flex flex-col gap-2 mt-3 px-2 overflow-auto">
      {players.map((player, index) => (
        <div
          key={index}
          className={`flex items-center justify-between p-2 rounded-md border border-gray-700/50 ${bg} backdrop-blur-md shadow-md`}
        >
          <div className="flex items-center gap-3">
            <img
              src={getOutfitImage(player.character.vocation).src}
              alt={player.character.vocation}
              className="h-12 w-12 object-contain shadow-lg"
            />
            <span className="blurred-name text-white/90 font-semibold">{player.character.name}</span>
          </div>
          <span className="text-xs font-medium text-white/80">{player.character.vocation}</span>
        </div>
      ))}
    </div>
  );
};