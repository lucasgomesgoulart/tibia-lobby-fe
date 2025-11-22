import { api } from './client';
import { Lobby, UserLobbyData } from '@/types/lobby';

export interface OverviewResponse {
  data: {
    allLobbies: Lobby[];
    userLobby: UserLobbyData | null;
  };
}

export const lobbiesApi = {
  overview: () => api.get<OverviewResponse>('/lobbies/overview'),
};

export default lobbiesApi;
