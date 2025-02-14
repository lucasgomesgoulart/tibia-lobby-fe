"use client";

import { useState, useEffect } from "react";
import CreateLobbyButton from "@/components/CreateLobbyButton";
import API_BASE_URL from "@/apiConfig";

interface Player {
  character: {
    name: string;
    vocation: string;
  };
}

interface Lobby {
  id: string;
  title: string;
  activityType: string;
  maxPlayers: number;
  players: Player[];
}

export default function LobbySidebar() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [lobby, setLobby] = useState<Lobby | null>(null);

  const fetchLobbyData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    setIsLoggedIn(true);

    try {
      const response = await fetch(`${API_BASE_URL}/lobby/my-lobby`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setLobby(data.data);
    } catch (error) {
      console.error("Erro ao buscar dados do lobby:", error);
    }
  };

  useEffect(() => {
    fetchLobbyData();
  }, []);

  return (
    <div className="flex flex-col h-full m-5 relative">
      <h2 className="text-white text-xl font-bold mb-4">Lobby</h2>

      {isLoggedIn ? (
        lobby ? (
          <div className="bg-gray-900 p-4 rounded-md text-white border border-gray-700">
            <h3 className="text-lg font-semibold">{lobby.title}</h3>
            <p className="text-sm text-gray-400">{lobby.activityType}</p>
            <p className="text-xs text-gray-400">
              Jogadores: {lobby.players.length}/{lobby.maxPlayers}
            </p>

            <div className="mt-3 space-y-2">
              {lobby.players.map((player, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-800 p-2 rounded-md"
                >
                  <span className="text-white">{player.character.name}</span>
                  <span className="text-xs text-gray-400">{player.character.vocation}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <CreateLobbyButton onLobbyCreated={fetchLobbyData} />
        )
      ) : (
        <p className="text-gray-400 text-sm text-center">
          Você precisa estar logado para criar uma lobby.
        </p>
      )}
    </div>
  );
}
