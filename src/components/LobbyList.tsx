"use client";

import React, { useState, useEffect } from "react";
import LobbyFilter from "./LobbyFilter";
import LobbyCard from "./lobbyCard";
import API_BASE_URL from "@/apiConfig";

export default function LobbyList() {
  const [lobbies, setLobbies] = useState<any[]>([]);
  const [userLobby, setUserLobby] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      setError("Você precisa estar logado para ver os lobbies.");
      setLoading(false);
      return;
    }

    const fetchLobbies = async () => {
      try {
        const [myLobbyRes, allLobbiesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/lobby/my-lobby`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_BASE_URL}/lobby`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const myLobbyData = await myLobbyRes.json();
        const allLobbiesData = await allLobbiesRes.json();

        if (!myLobbyRes.ok) {
          throw new Error(myLobbyData.message || "Erro ao buscar lobby do usuário.");
        }

        if (!allLobbiesRes.ok) {
          throw new Error(allLobbiesData.message || "Erro ao buscar lobbies.");
        }

        const allLobbies = allLobbiesData.data || [];
        const userLobbyData = myLobbyData.data || null;

        // Se o usuário tem uma lobby, coloca ela no topo
        if (userLobbyData) {
          setUserLobby(userLobbyData);
          setLobbies([userLobbyData, ...allLobbies.filter((lobby: any) => lobby.id !== userLobbyData.id)]);
        } else {
          setLobbies(allLobbies);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLobbies();
  }, [token]);

  const handleFilterResults = (filteredLobbies: any[]) => {
    setLobbies(filteredLobbies);
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
          {lobbies.length > 0 ? (
            lobbies.map((lobby) => (
              <LobbyCard
                key={lobby.id}
                lobby={{
                  ...lobby,
                  activePlayersCount: lobby.players.length,
                }}
              />
            ))
          ) : (
            <p className="text-white text-center col-span-full">Nenhum lobby encontrado.</p>
          )}
        </div>
      )}
    </div>
  );
}
