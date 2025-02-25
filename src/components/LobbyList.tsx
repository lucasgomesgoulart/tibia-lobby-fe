"use client";

import React, { useState, useEffect } from "react";
import LobbyFilter from "./LobbyFilter";
import LobbyCard from "./lobbyCard";
import API_BASE_URL from "@/apiConfig";

export default function LobbyList() {
  const [mounted, setMounted] = useState(false);
  const [lobbies, setLobbies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [token, setToken] = useState<string | null | undefined>(undefined);

 
  useEffect(() => {
    setMounted(true);
    const tokenLocal = localStorage.getItem("token");
    setToken(tokenLocal);
  }, []);

  const fetchLobbies = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/lobby`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
      });
      const data = await response.json();
      console.log(data)
      if (!response.ok) {
        throw new Error(data.message || "Erro ao buscar lobbies.");
      }
      setLobbies(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
   
    if (token === undefined) return;

    if (!token) {
      setError("Você precisa estar logado para ver os lobbies.");
      setLoading(false);
      return;
    }

   
    setError(null);
    fetchLobbies();
    const interval = setInterval(fetchLobbies, 5000);
    return () => clearInterval(interval);
  }, [token]);

  const handleFilterResults = (filteredLobbies: any[]) => {
    setLobbies(filteredLobbies);
  };

  if (!mounted) return null;

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
                lobby={{ ...lobby, ownerId: lobby.owner?.id }}
                onLobbyJoined={fetchLobbies}
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
