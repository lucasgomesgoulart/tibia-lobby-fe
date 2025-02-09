'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import API_BASE_URL from "@/apiConfig.js";
import { ImSpinner2 } from 'react-icons/im';

interface Vocation {
  name: 'SORCERER' | 'DRUID' | 'PALADIN' | 'KNIGHT';
  image: string;
}

interface World {
  id: string;
  name: string;
}

interface OtServer {
  id: string;
  name: string;
  worlds: World[];
}

interface CharacterRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const vocations: Vocation[] = [
  { name: 'SORCERER', image: '/images/outfits/mage.png' },
  { name: 'DRUID', image: '/images/outfits/druid.png' },
  { name: 'PALADIN', image: '/images/outfits/hunter.png' },
  { name: 'KNIGHT', image: '/images/outfits/knight.png' },
];

export default function CharacterRegistrationModal({ isOpen, onClose }: CharacterRegistrationModalProps) {
  const [name, setName] = useState<string>('');
  const [serverType, setServerType] = useState<'GLOBAL' | 'OTSERVER'>('GLOBAL');
  const [selectedVocation, setSelectedVocation] = useState<string>('');
  const [worlds, setWorlds] = useState<World[]>([]);
  const [otServers, setOtServers] = useState<OtServer[]>([]);
  const [selectedWorld, setSelectedWorld] = useState<string>('');
  const [selectedWorldId, setSelectedWorldId] = useState<string>('');
  const [selectedOtServer, setSelectedOtServer] = useState<string>('');
  const [selectedOtServerWorld, setSelectedOtServerWorld] = useState<string>('');
  const [otServerWorlds, setOtServerWorlds] = useState<World[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [level, setLevel] = useState<number>(0);

  useEffect(() => {
    const fetchWorldsAndOtServers = async () => {
      try {
        const worldsResponse = await fetch(`${API_BASE_URL}/worlds/global`);
        const otServersResponse = await fetch(`${API_BASE_URL}/otservers`);

        const worldsData = await worldsResponse.json();
        const otServersData = await otServersResponse.json();

        setWorlds(worldsData.data || []);
        setOtServers(otServersData.data || []);
      } catch (error) {
        console.error("Erro ao buscar mundos ou OTServers:", error);
        setWorlds([]);
        setOtServers([]);
      }
    };

    fetchWorldsAndOtServers();
  }, []);

  const handleOtServerChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedServerId = e.target.value;
    setSelectedOtServer(selectedServerId);
    const selectedServer = otServers.find(server => server.id === selectedServerId);
    setOtServerWorlds(selectedServer ? selectedServer.worlds : []);
  };

  const handleWorldChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const worldId = e.target.value;
    setSelectedWorldId(worldId);
    const world = worlds.find(w => w.id === worldId);
    setSelectedWorld(world ? world.name : '');
  };

  const handleOtServerWorldChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOtServerWorld(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Você precisa estar logado para cadastrar um personagem.');
      window.location.href = '/auth/login';
      return;
    }

    setIsLoading(true);

    const payload = {
      name,
      serverType,
      vocation: selectedVocation,
      level,
      worldId: serverType === 'GLOBAL' ? selectedWorldId : undefined,
      otServerId: serverType === 'OTSERVER' ? selectedOtServer : undefined,
      otServerWorldId: serverType === 'OTSERVER' ? selectedOtServerWorld : undefined,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/characters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('Personagem cadastrado com sucesso.');
        onClose();
      } else {
        alert('Erro ao cadastrar o personagem.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro na requisição para cadastrar o personagem.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          exit={{ opacity: 0, scaleY: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <motion.div
            className="bg-white bg-opacity-80 dark:bg-gray-800 dark:bg-opacity-80 backdrop-blur-md p-6 rounded-xl shadow-lg w-full max-w-md"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <h2 className="text-2xl font-bold mb-4 text-center">Cadastro de Personagem</h2>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <ImSpinner2 className="animate-spin text-white text-4xl" />
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Nome do Personagem"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white text-black"
                required
              />

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={serverType === 'GLOBAL'}
                    onCheckedChange={() => setServerType('GLOBAL')}
                  />
                  <span>GLOBAL</span>
                </label>
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={serverType === 'OTSERVER'}
                    onCheckedChange={() => setServerType('OTSERVER')}
                  />
                  <span>OTSERVER</span>
                </label>
              </div>

              {serverType === 'GLOBAL' && (
                <select
                  value={selectedWorldId}
                  onChange={handleWorldChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700"
                >
                  <option value="">Selecione um Mundo</option>
                  {worlds.map((world) => (
                    <option key={world.id} value={world.id}>{world.name}</option>
                  ))}
                </select>
              )}

              {serverType === 'OTSERVER' && (
                <>
                  <select
                    value={selectedOtServer}
                    onChange={handleOtServerChange}
                    className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700"
                  >
                    <option value="">Selecione um OTServer</option>
                    {otServers.map((server) => (
                      <option key={server.id} value={server.id}>{server.name}</option>
                    ))}
                  </select>

                  {selectedOtServer && (
                    <select
                      value={selectedOtServerWorld}
                      onChange={handleOtServerWorldChange}
                      className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 mt-2"
                    >
                      <option value="">Selecione um Mundo do OTServer</option>
                      {otServerWorlds.map((world) => (
                        <option key={world.id} value={world.id}>{world.name}</option>
                      ))}
                    </select>
                  )}
                </>
              )}

              <div className="grid grid-cols-2 gap-4">
                {vocations.map((vocation) => (
                  <label
                    key={vocation.name}
                    className={`cursor-pointer border p-2 rounded-lg text-center ${selectedVocation === vocation.name ? 'border-blue-500' : 'border-gray-300'}`}
                  >
                    <img src={vocation.image} alt={vocation.name} className="w-16 h-16 mx-auto mb-2" />
                    <Checkbox
                      checked={selectedVocation === vocation.name}
                      onCheckedChange={() => setSelectedVocation(vocation.name)}
                    />
                    <span>{vocation.name}</span>
                  </label>
                ))}
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit">Cadastrar</Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
