export interface PlayerInLobby {
  id: string;
  isLeader?: boolean;
  character: {
    id: string;
    name: string;
    vocation: string;
    level: number;
  };
  left_at: string | null;
}

export interface LobbyOwner {
  id: string;
  username: string;
}

export interface Lobby {
  id: string;
  title: string;
  activityType: { id: string; name: string };
  maxPlayers: number;
  minLevel: number;
  maxLevel: number;
  minPlayers: number;
  players: PlayerInLobby[];
  owner: LobbyOwner;
  discordChannelLink: string;
}

export interface UserLobbyData {
  lobby: Lobby & { isOwner?: boolean };
  myCharacterId?: string;
}

export interface PaginatedLobbies {
  items: Lobby[];
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}
