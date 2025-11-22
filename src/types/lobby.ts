export interface PlayerInLobby {
  id: string;
  isLeader: boolean;
  character: {
    id: string;
    name: string;
    vocation: string;
    level: string;
  };
  left_at: number | null;
}

export interface LobbyOwner {
  id: string;
  username: string;
}

export interface Lobby {
  id: string;
  title: string;
  activityType: string;
  maxPlayers: number;
  players: PlayerInLobby[];
  owner: LobbyOwner;
}

export interface UserLobbyData {
  lobby: Lobby;
  myCharacterId: string;
}
