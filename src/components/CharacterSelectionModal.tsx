import React from "react";
import { Button } from "./ui/button";
import OutfitDruid from "../../public/images/outfits/Druid_Male.gif";
import OutfitHunter from "../../public/images/outfits/Hunter_Male.gif";
import OutfitKnight from "../../public/images/outfits/Knight_Male.gif";
import OutfitMage from "../../public/images/outfits/Mage_Male.gif";
import { Character } from "./lobbyCard";

interface CharacterSelectionModalProps {
  characters: Character[];
  onSelect: (characterId: string) => void;
  onClose: () => void;
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

export const CharacterSelectionModal = ({ characters, onSelect, onClose }: CharacterSelectionModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl text-white max-w-lg w-full">
        <h3 className="text-xl font-bold mb-4">Selecione seu personagem</h3>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {characters.map((char) => (
            <CharacterCard key={char.id} character={char} onSelect={onSelect} />
          ))}
        </div>
        <Button onClick={onClose} className="mt-4 w-full bg-red-600 hover:bg-red-700">
          Cancelar
        </Button>
      </div>
    </div>
  );
};

interface CharacterCardProps {
  character: Character;
  onSelect: (characterId: string) => void;
}

const CharacterCard = ({ character, onSelect }: CharacterCardProps) => {
  return (
    <div className="flex items-center gap-4 p-3 bg-gray-800 rounded-lg shadow-md">
      <img src={getOutfitImage(character.vocation).src} alt={character.vocation} className="h-16 w-16" />
      <div>
        <p className="font-semibold text-lg">{character.name}</p>
        <p className="text-sm text-gray-400">
          {character.vocation} • {character.level ?? null} {character.world ? character.world.name : character.otServer?.name}
        </p>
      </div>
      <Button onClick={() => onSelect(character.id)} className="ml-auto bg-blue-600 hover:bg-blue-700">
        Selecionar
      </Button>
    </div>
  );
};