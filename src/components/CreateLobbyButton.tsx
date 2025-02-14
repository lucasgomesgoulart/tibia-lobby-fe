"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaPlusCircle } from "react-icons/fa";
import CreateLobbyModal from "@/components/CreateLobbyModal";

export default function CreateLobbyButton({ onLobbyCreated }: { onLobbyCreated: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="relative w-full max-w-xs px-6 py-3 text-lg font-semibold text-gray-200 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-lg hover:from-gray-700 hover:to-black transition-all duration-300 ease-in-out group flex items-center justify-between"
      >
        <FaPlusCircle className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
        <span className="flex-1 text-center">Criar Lobby</span>
      </Button>

      {isOpen && <CreateLobbyModal onClose={() => setIsOpen(false)} onLobbyCreated={onLobbyCreated} />}
    </>
  );
}
