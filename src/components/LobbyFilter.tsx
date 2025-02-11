'use client';

import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { FaFilter, FaSearch, FaTimesCircle } from 'react-icons/fa';
import API_BASE_URL from "@/apiConfig";

interface LobbyFilters {
  title?: string;
  activityType?: string;
  minLevel?: number;
  maxLevel?: number;
  minPlayers?: number;
  maxPlayers?: number;
  ownerId?: string;
}

export default function LobbyFiltersComponent({ onFilter }: { onFilter: (filteredLobbies: any[]) => void }) {
  const [filters, setFilters] = useState<LobbyFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [activityTypes, setActivityTypes] = useState<string[]>([]);
  const [parent] = useAutoAnimate();

  useEffect(() => {
    const fetchActivityTypes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/activeType`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setActivityTypes(data);
      } catch (error) {
        console.error("Erro ao buscar tipos de atividade:", error);
      }
    };

    fetchActivityTypes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleRangeChange = (value: number[], field: 'minPlayers' | 'maxPlayers') => {
    setFilters({ ...filters, [field]: value[0] });
  };

  const handleSearch = async () => {
    try {
      const queryParams = new URLSearchParams(filters as Record<string, string>).toString();
      const response = await fetch(`${API_BASE_URL}/lobbies?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      onFilter(data);
    } catch (error) {
      console.error("Erro ao buscar lobbies:", error);
    }
  };

  const clearFilters = async () => {
    setFilters({});
    try {
      const response = await fetch(`${API_BASE_URL}/lobbies`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      onFilter(data);
    } catch (error) {
      console.error("Erro ao buscar lobbies:", error);
    }
  };

  return (
    <div ref={parent} className="p-1 bg-gray-900 text-white rounded-md shadow-lg  ml-4">
      <div className="flex gap-2">
        <Button className="bg-gray-800 text-white hover:bg-gray-600" size="icon" onClick={() => setShowFilters(!showFilters)}>
          <FaFilter />
        </Button>
        <Button className="bg-red-600 text-white hover:bg-red-800" size="icon" onClick={clearFilters}>
          <FaTimesCircle />
        </Button>
        <Button className="bg-blue-600 text-white hover:bg-blue-800" size="icon" onClick={handleSearch}>
          <FaSearch />
        </Button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-2 gap-4 bg-gray-800 p-4 rounded-md shadow-md mt-3 mb-1">
          <Input name="title" placeholder='Título da lobby' onChange={handleChange} className="w-full bg-gray-700" />

          <div>
            <select name="activityType" onChange={handleChange} className="w-full bg-gray-700 text-white p-2 rounded-md">
              <option value="">Selecione um tipo de atividade</option>
              {activityTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300">Mínimo de Jogadores: {filters.minPlayers || 0}</label>
            <Slider defaultValue={[0]} max={20} step={1} onValueChange={(value) => handleRangeChange(value, 'minPlayers')} />
          </div>

          <div>
            <label className="block text-gray-300">Máximo de Jogadores: {filters.maxPlayers || 20}</label>
            <Slider defaultValue={[20]} max={20} step={1} onValueChange={(value) => handleRangeChange(value, 'maxPlayers')} />
          </div>

          <Input type="number" name="minLevel" placeholder="Nível Mínimo" onChange={handleChange} className="w-full bg-gray-700 text-white " />
          <Input type="number" name="maxLevel" placeholder="Nível Máximo" onChange={handleChange} className="w-full bg-gray-700 text-white" />
        </div>
      )}
    </div>
  );
}
