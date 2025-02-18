// /src/hooks/useCharacters.ts
import { useState, useEffect } from "react";
import API_BASE_URL from "@/apiConfig";

export function useCharacters() {
  const [characters, setCharacters] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCharacters = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/characters`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setCharacters(data.data || []);
      } else {
        setError(data.message || "Erro ao buscar personagens");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  return { characters, loading, error, fetchCharacters };
}
