"use client";
import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../apiConfig';
import { useCharacters } from '../hooks/useCharacters';

interface CreateLobbyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLobbyCreated: (title: string) => void;
}

interface ActivityTypeOption {
  id: string;
  name: string;
}

interface FormState {
  title: string;
  minPlayers: number;
  maxPlayers: number;
  minLevel: number;
  maxLevel: number;
  activityTypeId: string;
  characterId: string;
  discordChannelLink: string;
}

const initialForm: FormState = {
  title: '',
  minPlayers: 2,
  maxPlayers: 4,
  minLevel: 1,
  maxLevel: 0,
  activityTypeId: '',
  characterId: '',
  discordChannelLink: 'https://discord.gg/fakelobby',
};

export const CreateLobbyModal: React.FC<CreateLobbyModalProps> = ({ isOpen, onClose, onLobbyCreated }) => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activityTypes, setActivityTypes] = useState<ActivityTypeOption[]>([]);

  const { characters, loading: charactersLoading, error: charactersError } = useCharacters();

  useEffect(() => {
    if (!isOpen) return;
    const loadActivityTypes = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/activeType`);
        const data = await res.json();
        const list: ActivityTypeOption[] = Array.isArray(data) ? data.filter((d: any) => d && d.id && d.name) : [];
        setActivityTypes(list);
      } catch (err) {
        console.error('Falha ao buscar activity types', err);
        setActivityTypes([]);
      }
    };
    loadActivityTypes();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setForm(initialForm); // reset ao abrir
      setErrorMsg(null);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name.includes('Players') || name.includes('Level') ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!form.activityTypeId) {
      setErrorMsg('Selecione um tipo de atividade.');
      return;
    }
    if (!form.characterId) {
      setErrorMsg('Selecione um personagem.');
      return;
    }
    if (form.minPlayers > form.maxPlayers) {
      setErrorMsg('Min jogadores não pode exceder Max jogadores.');
      return;
    }
    if (form.minLevel > form.maxLevel && form.maxLevel !== 0) {
      setErrorMsg('Min level não pode exceder Max level.');
      return;
    }

    const payload = {
      title: form.title.trim(),
      minPlayers: form.minPlayers,
      maxPlayers: form.maxPlayers,
      minLevel: form.minLevel,
      maxLevel: form.maxLevel,
      discordChannelLink: form.discordChannelLink,
      characterId: form.characterId,
      activityTypeId: form.activityTypeId,
    };

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/lobby`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Erro desconhecido ao criar lobby');
      }
      onLobbyCreated(payload.title);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Fechar modal"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Criar Lobby</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Título</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full text-black p-2 rounded-md border border-gray-300"
              placeholder="Nome do lobby"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Min Jogadores</label>
              <input
                type="number"
                name="minPlayers"
                min={1}
                value={form.minPlayers}
                onChange={handleChange}
                className="w-full text-black p-2 rounded-md border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Jogadores</label>
              <input
                type="number"
                name="maxPlayers"
                min={form.minPlayers}
                value={form.maxPlayers}
                onChange={handleChange}
                className="w-full text-black p-2 rounded-md border border-gray-300"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Min Level</label>
              <input
                type="number"
                name="minLevel"
                min={1}
                value={form.minLevel}
                onChange={handleChange}
                className="w-full text-black p-2 rounded-md border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Level (0 = sem limite)</label>
              <input
                type="number"
                name="maxLevel"
                min={0}
                value={form.maxLevel}
                onChange={handleChange}
                className="w-full text-black p-2 rounded-md border border-gray-300"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo de Atividade</label>
            <select
              name="activityTypeId"
              value={form.activityTypeId}
              onChange={handleChange}
              required
              className="w-full text-black p-2 rounded-md border border-gray-300"
            >
              <option value="">Selecione...</option>
              {activityTypes.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Personagem</label>
            <select
              name="characterId"
              value={form.characterId}
              onChange={handleChange}
              required
              className="w-full text-black p-2 rounded-md border border-gray-300"
            >
              <option value="">Selecione...</option>
              {charactersLoading ? (
                <option>Carregando...</option>
              ) : charactersError ? (
                <option>Erro ao carregar</option>
              ) : (
                characters.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Link Discord</label>
            <input
              name="discordChannelLink"
              value={form.discordChannelLink}
              onChange={handleChange}
              className="w-full text-black p-2 rounded-md border border-gray-300"
            />
          </div>
          {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border text-gray-700 bg-gray-100 hover:bg-gray-200"
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? 'Criando...' : 'Criar Lobby'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLobbyModal;
