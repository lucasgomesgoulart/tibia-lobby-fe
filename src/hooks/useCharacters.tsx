// Exemplo do hook useCharacters.ts
import { useState, useEffect } from "react";
import API_BASE_URL from "@/apiConfig";

export function useCharacters() {
  const [characters, setCharacters] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCharacters = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/characters`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erro ao buscar personagens");
      setCharacters(data.data || []);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  return { characters, loading, error, fetchCharacters };
}
