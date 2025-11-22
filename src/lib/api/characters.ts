import { api } from './client';
import { Character } from '@/types/character';

export interface CharactersResponse {
  data: Character[];
}

export const charactersApi = {
  list: () => api.get<CharactersResponse>('/characters'),
};

export default charactersApi;
