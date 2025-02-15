'use client';

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import API_BASE_URL from "@/apiConfig";
import OtServerSelection from "./OtServerSelection";
import VocationSelection from "./VocationSelection";

interface World {
  id: string;
  name: string;
}

interface OtServer {
  id: string;
  name: string;
  worlds: World[];
}

interface CharacterFormProps {
  onClose: () => void;
}

export default function CharacterForm({ onClose }: CharacterFormProps) {
  const [name, setName] = useState<string>('');
  const [serverType, setServerType] = useState<"GLOBAL" | "OTSERVER">("GLOBAL");
  const [selectedVocation, setSelectedVocation] = useState<string>('');
  const [otServers, setOtServers] = useState<OtServer[]>([]);
  const [selectedOtServer, setSelectedOtServer] = useState<string>('');
  const [selectedOtServerWorld, setSelectedOtServerWorld] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchOtServers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/otservers`);
        const data = await response.json();
        setOtServers(data.data || []);
      } catch (error) {
        console.error("Erro ao buscar OTServers:", error);
      }
    };
    fetchOtServers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Você precisa estar logado para cadastrar um personagem.');
      window.location.href = '/auth/login';
      return;
    }

    setIsLoading(true);

    let payload: Record<string, any> = { name, serverType };

    if (serverType === 'OTSERVER') {
      payload = {
        ...payload,
        vocation: selectedVocation,
        otServerId: selectedOtServer,
        otServerWorldId: selectedOtServerWorld,
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/characters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('Personagem cadastrado com sucesso!');
        onClose();
      } else {
        const errorData = await response.json();
        alert(`Erro ao cadastrar o personagem: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro ao cadastrar o personagem.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Nome do Personagem"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2">
          <Checkbox
            checked={serverType === 'GLOBAL'}
            onCheckedChange={() => setServerType("GLOBAL")}
          />
          <span>GLOBAL</span>
        </label>
        <label className="flex items-center space-x-2">
          <Checkbox
            checked={serverType === 'OTSERVER'}
            onCheckedChange={() => setServerType("OTSERVER")}
          />
          <span>OTSERVER</span>
        </label>
      </div>

      {serverType === 'GLOBAL' && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg text-blue-800 dark:text-blue-200">
          <p className="text-sm">Nós buscamos automaticamente as informações do seu personagem. Apenas insira o nome acima!</p>
        </div>
      )}

      {serverType === 'OTSERVER' && (
        <>
          <OtServerSelection
            otServers={otServers}
            selectedOtServer={selectedOtServer}
            setSelectedOtServer={setSelectedOtServer}
            selectedOtServerWorld={selectedOtServerWorld}
            setSelectedOtServerWorld={setSelectedOtServerWorld}
          />
          <VocationSelection selectedVocation={selectedVocation} setSelectedVocation={setSelectedVocation} />
        </>
      )}

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Cadastrando..." : "Cadastrar"}
        </Button>
      </div>
    </form>
  );
}
