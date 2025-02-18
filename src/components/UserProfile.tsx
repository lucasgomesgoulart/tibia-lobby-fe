'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FaUser, FaGlobe, FaServer, FaLevelUpAlt, FaHatWizard, FaTrash } from 'react-icons/fa';
import API_BASE_URL from "@/apiConfig";
import { useCharacters } from "@/hooks/useCharacters";

interface Character {
  id: string;
  name: string;
  serverType: 'GLOBAL' | 'OTSERVER';
  vocation: string;
  level: number | null;
  world?: {
    name: string;
    isGlobal: boolean;
  };
  otServer?: {
    name: string;
  };
}

interface UserProfileProps {
  user: {
    username: string;
    email: string;
    full_name?: string;
    phone?: string;
    country?: string;
    state?: string;
    city?: string;
    zip_code?: string;
    address?: string;
    address_2?: string;
  };
}

export default function UserProfile({ user }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  const [deleteCharacterId, setDeleteCharacterId] = useState<string | null>(null);

  // Utilizando o hook useCharacters para buscar os personagens
  const { characters, loading, error, fetchCharacters } = useCharacters();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await fetch(`${API_BASE_URL}/users/${formData.username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao atualizar informações do usuário:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${API_BASE_URL}/characters/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Após a exclusão, refaz a busca dos personagens
      fetchCharacters();
      setDeleteCharacterId(null);
    } catch (error) {
      console.error("Erro ao deletar personagem:", error);
    }
  };

  return (
    <div className="bg-opacity-50 backdrop-blur-md border-r border-gray-700 p-4 relative z-10 flex flex-col items-center justify-center">
      <div className="grid grid-cols-2 gap-6 w-full max-w-5xl">
        {/* Card com informações do usuário */}
        <Card className="shadow-xl border border-gray-300 dark:border-gray-700 backdrop-blur-lg bg-gray-800 p-6 rounded-2xl hover:shadow-2xl transition duration-300 ease-in-out">
          <CardHeader className="border-b border-white pb-2">
            <CardTitle className="text-center text-2xl font-bold tracking-wide">Informações do Usuário</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <div className="mt-5">
                <label className="text-white">Usuário</label>
                <Input name="username" value={formData.username} className="bg-white" onChange={handleChange} placeholder="Usuário" />
              </div>
              <div>
                <label className="text-white">Email</label>
                <Input className="bg-white" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
              </div>
              <div>
                <label className="text-white">Telefone</label>
                <Input className="bg-white" name="phone" value={formData.phone || ''} onChange={handleChange} placeholder="Telefone" />
              </div>
              <div>
                <label className="text-white">Endereço</label>
                <Input className="bg-white" name="address" value={formData.address || ''} onChange={handleChange} placeholder="Endereço" />
              </div>
              <Button type="submit" className="w-full">Salvar Alterações</Button>
            </form>
          </CardContent>
        </Card>

        {/* Card com a lista de personagens */}
        <Card className="shadow-xl border border-gray-300 dark:border-gray-700 backdrop-blur-lg bg-gray-800 p-6 rounded-2xl hover:shadow-2xl transition duration-300 ease-in-out">
          <CardHeader className="border-b border-white pb-2">
            <CardTitle className="text-center text-2xl font-bold tracking-wide">Personagens</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-300 text-center">Carregando personagens...</p>
            ) : error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : characters.length === 0 ? (
              <p className="text-gray-300 text-center">Nenhum personagem cadastrado.</p>
            ) : (
              <ul className="divide-y divide-black">
                {characters.map((char) => (
                  <li key={char.id} className="p-4 bg-gray-900 text-white hover:bg-gray-700 transition duration-300 relative">
                    <div>
                      <FaUser className="inline mr-2" /> <strong>{char.name}</strong>
                    </div>
                    <div>
                      <FaHatWizard className="inline mr-2" /> <strong>Vocação:</strong> {char.vocation}
                    </div>
                    <div>
                      <FaGlobe className="inline mr-2" /> <strong>Mundo:</strong> {char.world?.name}
                    </div>
                    {char.otServer && (
                      <div>
                        <FaServer className="inline mr-2" /> <strong>OTServer:</strong> {char.otServer.name}
                      </div>
                    )}
                    {char.level !== null && (
                      <div>
                        <FaLevelUpAlt className="inline mr-2" /> <strong>Level:</strong> {char.level}
                      </div>
                    )}
                    <button
                      onClick={() => setDeleteCharacterId(char.id)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Dialog open={!!deleteCharacterId} onOpenChange={() => setDeleteCharacterId(null)}>
          <DialogContent className="bg-gray-900 text-white border border-gray-700 rounded-xl">
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
            </DialogHeader>
            <p>Tem certeza de que deseja deletar este personagem?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setDeleteCharacterId(null)}>Cancelar</Button>
              <Button className="bg-red-500 hover:bg-red-700" onClick={() => handleDelete(deleteCharacterId!)}>
                Deletar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
