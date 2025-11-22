// Exemplo do hook useCharacters.ts
import { useState, useEffect } from "react";
import { charactersApi } from '@/lib/api/characters';
import { Character } from '@/types/character';

export function useCharacters() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCharacters = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await charactersApi.list();
      setCharacters(res.data || []);
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
