"use client";

import { FaCheck } from "react-icons/fa";

export function Advantages() {
  return (
    <div className="hidden md:flex flex-col justify-start w-full p-8 text-white">
      <h2 className="text-2xl font-bold text-white text-left mb-4">
        Vantagens ao usar <span className="text-yellow-400">Tibia Lobby</span>
      </h2>
      <ul className="space-y-4 text-gray-300 text-base">
        <li className="flex items-center gap-3">
          <FaCheck className="text-green-400 text-lg" />
          <span>Encontre jogadores para suas hunts</span>
        </li>
        <li className="flex items-center gap-3">
          <FaCheck className="text-green-400 text-lg" />
          <span>Participe ou crie lobbys personalizados</span>
        </li>
        <li className="flex items-center gap-3">
          <FaCheck className="text-green-400 text-lg" />
          <span>Conecte-se com jogadores de OTServers e Global</span>
        </li>
        <li className="flex items-center gap-3">
          <FaCheck className="text-green-400 text-lg" />
          <span>Gerencie seu time e organize quests</span>
        </li>
        <li className="flex items-center gap-3">
          <FaCheck className="text-green-400 text-lg" />
          <span>Conheça novas pessoas com seu estilo de jogo</span>
        </li>
      </ul>
    </div>
  );
}
