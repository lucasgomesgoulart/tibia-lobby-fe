"use client";

import React, { useEffect } from "react";
import LobbyFilter from "./LobbyFilter";
import LobbyCard from "./lobbyCard";
import { useLobby } from "@/hooks/useLobby";
import { useSocket } from "@/hooks/useSocket";

export default function LobbyList() {
  // Usa o hook useLobby que já retorna allLobbies, loading, error e refresh
  const { allLobbies, loading, error, refresh } = useLobby();
  const socket = useSocket();

  // Atualiza a lista de lobbies em tempo real
  useEffect(() => {
    if (!socket) return;

    const handleLobbyCreated = (newLobby: any) => {
      console.log("LobbyList: lobbyCreated recebido", newLobby);
      refresh();
    };

    const handleLobbyUpdated = (update: any) => {
      console.log("LobbyList: lobbyUpdated recebido", update);
      refresh();
    };

    const handleLobbyDeleted = ({ lobbyId }: { lobbyId: string }) => {
      console.log("LobbyList: lobbyDeleted recebido", lobbyId);
      refresh();
    };

    socket.on("lobbyCreated", handleLobbyCreated);
    socket.on("lobbyUpdated", handleLobbyUpdated);
    socket.on("lobbyDeleted", handleLobbyDeleted);

    return () => {
      socket.off("lobbyCreated", handleLobbyCreated);
      socket.off("lobbyUpdated", handleLobbyUpdated);
      socket.off("lobbyDeleted", handleLobbyDeleted);
    };
  }, [socket, refresh]);

  // Opcional: se o LobbyFilter for para aplicar filtros localmente,
  // você pode atualizar a lista (aqui, apenas chamamos refresh para simplificar)
  const handleFilterResults = (filteredLobbies: any[]) => {
    // Se necessário, implemente lógica de filtro local
    // Por enquanto, podemos simplesmente chamar refresh ou atualizar um estado local.
  };

  return (
    <div className="space-y-4">
      <LobbyFilter onFilter={handleFilterResults} />
      {loading ? (
        <p className="text-white text-center">Carregando lobbies...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 w-full max-w-[1440px] mx-auto">
          {allLobbies.length > 0 ? (
            allLobbies.map((lobby) => (
              <LobbyCard
                key={lobby.id}
                lobby={lobby}
                onLobbyJoined={refresh}
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
