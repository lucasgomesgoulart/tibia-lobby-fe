"use client";

import React, { useEffect, useState } from "react";
import LobbyFilter from "./LobbyFilter";
import LobbyCard from "./lobbyCard";
import { useLobby } from "@/hooks/useLobby";
import { useSocket } from "@/hooks/useSocket";
import CreateLobbyButton from "./CreateLobbyButton";
import { Lobby } from "@/types/lobby";

export default function LobbyList() {
  const { allLobbies, loading, error, refresh } = useLobby();
  const socket = useSocket();
  const [filtered, setFiltered] = useState<Lobby[]>([]);

  useEffect(() => {
    if (!socket) return;

    const handleLobbyCreated = () => refresh();
    const handleLobbyUpdated = () => refresh();
    const handleLobbyDeleted = () => refresh();

    socket.on("lobbyCreated", handleLobbyCreated);
    socket.on("lobbyUpdated", handleLobbyUpdated);
    socket.on("lobbyDeleted", handleLobbyDeleted);

    return () => {
      socket.off("lobbyCreated", handleLobbyCreated);
      socket.off("lobbyUpdated", handleLobbyUpdated);
      socket.off("lobbyDeleted", handleLobbyDeleted);
    };
  }, [socket, refresh]);

  const handleFilterResults = (filteredLobbies: any[]) => {
    const list = (filteredLobbies as any)?.items || filteredLobbies || [];
    setFiltered(list);
  };

  const lobbiesToRender = filtered.length > 0 ? filtered : allLobbies;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <LobbyFilter onFilter={handleFilterResults} />
        <CreateLobbyButton onLobbyCreated={() => { setFiltered([]); refresh(); }} />
      </div>
      {loading ? (
        <p className="text-white text-center">Carregando lobbies...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 w-full max-w-[1440px] mx-auto">
          {lobbiesToRender.length > 0 ? (
            lobbiesToRender.map((lobby) => (
              <LobbyCard
                key={lobby.id}
                lobby={lobby}
                onLobbyJoined={() => { setFiltered([]); refresh(); }}
              />
            ))
          ) : (
            <p className="text-white text-center col-span-full">
              Nenhuma lobby encontrada.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
