import { IRoomData } from '../../api/types';

export interface ILobbyReducerState {
  playerId: string | null;
  playerName: string;
  playerCredentials: string;
  roomId: string | null;
  roomData: IRoomData | null;
}
