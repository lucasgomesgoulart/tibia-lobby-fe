import { api } from './client';
import { Lobby, UserLobbyData, PaginatedLobbies } from '@/types/lobby';

export interface OverviewResponse {
  data: {
    allLobbies: Lobby[];
    userLobby: UserLobbyData | null;
  };
}

export const lobbiesApi = {
  list: (query: Record<string, string | number | undefined> = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && `${value}` !== '') {
        params.append(key, `${value}`);
      }
    });
    const qs = params.toString();
    return api.get<PaginatedLobbies>(qs ? `/lobby?${qs}` : '/lobby');
  },
  overview: async (): Promise<OverviewResponse> => {
    const [lobbyList, userLobby] = await Promise.all([
      lobbiesApi.list({ page: 1, limit: 50 }), // basic page to populate grid
      api.get<UserLobbyData | null>('/lobby-players/check'),
    ]);

    const allLobbies = (lobbyList as any).items ?? (lobbyList as any) ?? [];

    return {
      data: {
        allLobbies,
        userLobby,
      },
    };
  },
};

export default lobbiesApi;
