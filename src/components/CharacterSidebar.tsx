"use client";

import { useState, useEffect } from "react";
import CharacterRegistrationModal from "@/components/CharacterRegistrationModal";
import { Button } from "@/components/ui/button";
import { FaCheckCircle } from "react-icons/fa";
import * as Tooltip from "@radix-ui/react-tooltip";
import { IUser } from "@/hooks/useUser";
import { useCharacters } from "@/hooks/useCharacters";

interface CharacterSidebarProps {
  user: IUser | null;
  loading: boolean;
  error: string;
}

interface VocationIcons {
  [key: string]: string;
}

export default function CharacterSidebar({ user, loading, error }: CharacterSidebarProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { characters, loading: charactersLoading, error: charactersError, fetchCharacters } = useCharacters();

  useEffect(() => {
    fetchCharacters();
  }, [isModalOpen, fetchCharacters]);

  if (loading) return <p>Carregando characters...</p>;
  if (error) return <p>{error}</p>;
  if (!user) return <p>Nenhum usuário logado.</p>;

  const vocationIcons: VocationIcons = {
    KNIGHT: "/images/voc-icons/Grand_Sanguine_Blade.gif",
    PALADIN: "/images/voc-icons/Grand_Sanguine_Crossbow.gif",
    DRUID: "/images/voc-icons/Hailstorm_Rod.gif",
    SORCERER: "/images/voc-icons/Wand_of_Inferno.gif",
  };

  return (
    <div className="flex flex-col h-full p-3 relative rounded-xl shadow-md border border-white/5 bg-gray-900">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.08em] text-white/60">Meus personagens</p>
          <h2 className="text-white text-xl font-bold">Selecione para entrar</h2>
        </div>
        <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => setIsModalOpen(true)}>
          Cadastrar
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {charactersLoading ? (
          <p className="text-gray-300 text-center">Carregando personagens...</p>
        ) : charactersError ? (
          <p className="text-red-500 text-center">{charactersError}</p>
        ) : characters.length === 0 ? (
          <p className="text-gray-300 text-center">Nenhum personagem cadastrado.</p>
        ) : (
          characters.map((char) => (
            <div
              key={char.id}
              className={`bg-gray-800 text-white p-3 rounded-lg shadow-sm flex justify-between items-center relative border border-white/5 ${
                char.serverType === "GLOBAL" ? "border border-yellow-400" : ""
              }`}
            >
              <div className="flex items-center space-x-2">
                {vocationIcons[char.vocation] && (
                  <img src={vocationIcons[char.vocation]} alt={char.vocation} className="w-8 h-8" />
                )}
                <div>
                  <h3 className="font-bold text-sm">{char.name}</h3>
                  <p className="text-xs text-gray-400">{char.vocation}</p>
                  <p className="text-xs text-gray-400">{char.world?.name || char.otServer?.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {char.level != null && Number(char.level) > 0 && (
                  <span className="text-blue-400 font-medium text-sm">Level: {char.level}</span>
                )}
                {char.serverType === "GLOBAL" && (
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <FaCheckCircle className="text-green-400 cursor-pointer ml-1 hover:scale-110 transition-transform duration-200" />
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      className="bg-black text-white text-xs p-2 rounded shadow-md"
                      side="top"
                      align="end"
                    >
                      Tibia Global Confirmado
                      <Tooltip.Arrow className="fill-black" />
                    </Tooltip.Content>
                  </Tooltip.Root>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 mt-4" onClick={() => setIsModalOpen(true)}>
        Cadastrar Personagem
      </Button>

      <CharacterRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCharacterCreated={() => {
          setIsModalOpen(false);
          fetchCharacters();
        }}
      />
    </div>
  );
}
