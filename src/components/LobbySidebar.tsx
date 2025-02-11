"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import API_BASE_URL from "@/apiConfig";

export default function CreateLobbyModal({ onLobbyCreated }: { onLobbyCreated: (lobby: any) => void }) {
  const [formData, setFormData] = useState({
    title: "",
    minPlayers: 1,
    maxPlayers: 4,
    minLevel: 0,
    maxLevel: 0,
    activityType: "",
  });

  const [activityTypes, setActivityTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchActivityTypes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/activeType`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSliderChange = (value: number[], field: "minPlayers" | "maxPlayers") => {
    setFormData({ ...formData, [field]: value[0] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/lobbies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      onLobbyCreated(data); // Callback para atualizar a lista de lobbies
    } catch (error) {
      console.error("Erro ao criar lobby:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-800">Criar Lobby</Button>
      </DialogTrigger>
      <DialogContent className="bg-white text-white p-6 rounded-md shadow-lg">
        <DialogHeader >
          <DialogTitle className="text-center text-2xl text-black font-bold mb-4">Criar Nova Lobby</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="title" placeholder="Título da Lobby" onChange={handleChange} required className="bg-gray-700 text-white" />

          <div>
            <label className="text-gray-300">Tipo de Atividade</label>
            <select name="activityType" onChange={handleChange} required className="w-full bg-gray-700 text-white p-2 rounded-md">
              <option value="">Selecione um tipo de atividade</option>
              {activityTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-wh-300">Mínimo de Jogadores: {formData.minPlayers}</label>
            <Slider defaultValue={[1]} max={20} step={1} 
             onValueChange={(value) => handleSliderChange(value, "minPlayers")} />
          </div>

          <div>
            <label className="block text-gray-300">Máximo de Jogadores: {formData.maxPlayers}</label>
            <Slider defaultValue={[4]} max={35} step={1} onValueChange={(value) => handleSliderChange(value, "maxPlayers")} />
          </div>

          <Input type="number" name="minLevel" placeholder="Nível Mínimo (opcional)" onChange={handleChange} className="bg-gray-700 text-white" />
          <Input type="number" name="maxLevel" placeholder="Nível Máximo (opcional)" onChange={handleChange} className="bg-gray-700 text-white" />

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-800">
            Criar Lobby
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
