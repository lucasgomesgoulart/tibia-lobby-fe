// Exemplo do hook useCharacters.ts
import { useState, useEffect, useCallback } from "react";
import { charactersApi } from '@/lib/api/characters';
import { Character } from '@/types/character';

export function useCharacters() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCharacters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await charactersApi.list();
      setCharacters((res as any)?.data || (res as any) || []);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  return { characters, loading, error, fetchCharacters };
}
