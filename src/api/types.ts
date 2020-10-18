export interface IPlayerData {
  playerID: string;
  playerName: string;
  data?: object;
}

export interface IServerPlayer {
  id: string;
  name?: string;
}

export interface IRoomData {
  matchId: string;
  players: IServerPlayer[];
  setupData?: object;
}
export interface IPlayerJoinData {
  playerID: string;
  playerName: string;
}
