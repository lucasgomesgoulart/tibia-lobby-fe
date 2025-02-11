"use client";

import React, { useState, useEffect } from "react";
import { mockLobbies } from "@/mocks/mockLobbies";
import LobbyFilter from "./LobbyFilter";
import LobbyCard from "./lobbyCard";

export default function LobbyList() {
  const [lobbies, setLobbies] = useState(mockLobbies);

  const handleFilterResults = (filteredLobbies: any[]) => {
    setLobbies(filteredLobbies);
  };

  return (
    <div className="space-y-4">
      <LobbyFilter onFilter={handleFilterResults} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
        {lobbies.map((lobby) => (
          <LobbyCard
            key={lobby.id}
            lobby={{
              ...lobby,
              activePlayersCount: lobby.players.length,
            }}
          />
        ))}
      </div>
    </div>
  );
}
