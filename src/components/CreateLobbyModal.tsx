"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import API_BASE_URL from "@/apiConfig";

export default function CreateLobbyModal({ onClose }: { onClose: () => void }) {
  const initialFormData = {
    title: "",
    minPlayers: 2,
    maxPlayers: 4,
    minLevel: 1,
    maxLevel: 0,
    activityType: "",
    characterId: "",
    discordChannelLink: "https://discord.gg/fakelobby",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [activityTypes, setActivityTypes] = useState<string[]>([]);
  const [characters, setCharacters] = useState<{ id: string; name: string }[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchActivityTypes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/activeType`);
        const data = await response.json();
        setActivityTypes(data);
      } catch (error) {
        console.error("Erro ao buscar tipos de atividade:", error);
      }
    };

    const fetchCharacters = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/characters`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setCharacters(data.data || []);
      } catch (error) {
        console.error("Erro ao buscar personagens:", error);
      }
    };

    fetchActivityTypes();
    fetchCharacters();
  }, []);

  // **🔄 Resetar o estado quando o modal for fechado**
  useEffect(() => {
    if (!onClose) return;
    setFormData(initialFormData);
    setErrorMessage(null);
  }, [onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSliderChange = (value: number[], field: "minPlayers" | "maxPlayers") => {
    setFormData({ ...formData, [field]: value[0] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/lobby`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro desconhecido ao criar lobby");
      }

      onClose(); // Fecha o modal após sucesso
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-white text-white p-6 rounded-md shadow-lg">
        <DialogHeader className="border-b border-gray-400 mb-4">
          <DialogTitle className="text-left text-lg text-black">
            Criar Nova Lobby
          </DialogTitle>
        </DialogHeader>

        {errorMessage && <p className="text-red-500 text-lg text-center">{errorMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="title"
            onChange={handleChange}
            value={formData.title}
            required
            className="border border-black placeholder-black text-black"
            placeholder="Insira o título da lobby"
          />

          <select
            name="activityType"
            onChange={handleChange}
            value={formData.activityType}
            required
            className="w-full text-black p-2 rounded-md border border-black placeholder-black"
          >
            <option value="">Selecione um tipo de atividade</option>
            {activityTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            name="characterId"
            onChange={handleChange}
            value={formData.characterId}
            required
            className="w-full text-black p-2 rounded-md border border-black placeholder-black"
          >
            <option value="">Selecione um personagem</option>
            {characters.map((char) => (
              <option key={char.id} value={char.id}>{char.name}</option>
            ))}
          </select>

          <label className="block text-black">Mínimo de Jogadores: {formData.minPlayers}</label>
          <Slider defaultValue={[formData.minPlayers]} max={20} min={2} step={1} onValueChange={(value) => handleSliderChange(value, "minPlayers")} />

          <label className="block text-black">Máximo de Jogadores: {formData.maxPlayers}</label>
          <Slider defaultValue={[formData.maxPlayers]} max={35} step={1} onValueChange={(value) => handleSliderChange(value, "maxPlayers")} />

          <Input
            type="number"
            name="minLevel"
            value={formData.minLevel}
            placeholder="Nível Mínimo (opcional)"
            onChange={handleChange}
            className="text-black placeholder-black"
          />
          <Input
            type="number"
            name="maxLevel"
            value={formData.maxLevel}
            placeholder="Nível Máximo (opcional)"
            onChange={handleChange}
            className="text-black placeholder-black"
          />

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-800">
            Criar Lobby
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
