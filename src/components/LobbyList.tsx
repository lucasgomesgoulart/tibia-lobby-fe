"use client";

import React from "react";
import { mockLobbies } from "@/mocks/mockLobbies"; // Mock de lobbies atualizado
import LobbyCard from "./lobbyCard";
import Layout from './Layout'

export default function LobbyList() {
  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
        {mockLobbies.map((lobby) => (

          <LobbyCard
            key={lobby.id}
            lobby={{
              ...lobby,
              activePlayersCount: lobby.players.length,
            }}
          />
        ))}
      </div>
  );
}
