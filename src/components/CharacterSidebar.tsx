'use client';

import { useState, useEffect } from 'react';
import CharacterRegistrationModal from "@/components/CharacterRegistrationModal";
import { Button } from "@/components/ui/button";
import API_BASE_URL from "@/apiConfig.js";
import { FaCheckCircle } from 'react-icons/fa';
import * as Tooltip from '@radix-ui/react-tooltip';

interface Character {
  id: string;
  name: string;
  vocation: 'KNIGHT' | 'PALADIN' | 'DRUID' | 'SORCERER';
  level: number;
  serverType: 'GLOBAL' | 'OTSERVER';
  world?: {
    name: string;
    isGlobal: boolean;
  };
  otServer?: {
    name: string;
  };
}

interface VocationIcons {
  [key: string]: string;
}

export default function CharacterSidebar() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [userLogged, setUserLogged] = useState<boolean>(false);

  const vocationIcons: VocationIcons = {
    KNIGHT: '/images/voc-icons/Grand_Sanguine_Blade.gif',
    PALADIN: '/images/voc-icons/Grand_Sanguine_Crossbow.gif',
    DRUID: '/images/voc-icons/Hailstorm_Rod.gif',
    SORCERER: '/images/voc-icons/Wand_of_Inferno.gif',
  };

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/characters`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setCharacters(data.data || []);
          setUserLogged(true);
        } else {
          setUserLogged(false);
        }
      } catch (error) {
        console.error('Erro ao buscar personagens:', error);
        setUserLogged(false);
      }
    };

    fetchCharacters();
  }, [isModalOpen]);

  return (
    <div className="flex flex-col h-full p-2 relative rounded-lg shadow-md">
      <h2 className="text-white text-xl font-bold mb-4">Personagens</h2>

      <div className="flex-1 overflow-y-auto space-y-2">
        {!userLogged ? (
          <p className="text-gray-300 text-center">Você precisa fazer o login para visualizar seus personagens.</p>
        ) : characters.length === 0 ? (
          <p className="text-gray-300 text-center">Nenhum personagem cadastrado.</p>
        ) : (
          characters.map((char) => (
            <div
              key={char.id}
              className={`bg-gray-800 text-white p-3 rounded-md shadow-sm flex justify-between items-center relative ${
                char.serverType === 'GLOBAL' ? 'border border-yellow-400' : ''
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
                {char.level > 0 && (
                  <span className="text-blue-400 font-medium text-sm">Level: {char.level}</span>
                )}
                {char.serverType === 'GLOBAL' && (
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

      {userLogged && (
        <Button
          className="w-full bg-blue-600 text-white hover:bg-blue-700 mt-4"
          onClick={() => setIsModalOpen(true)}
        >
          Cadastrar Personagem
        </Button>
      )}

      <CharacterRegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
