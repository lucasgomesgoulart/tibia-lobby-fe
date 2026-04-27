import { api } from './client';
export const charactersApi = {
  list: () => api.get('/characters'),
};

export default charactersApi;
