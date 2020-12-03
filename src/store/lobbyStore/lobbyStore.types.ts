import { IRoomData } from '../../api/types';
import { ISetupData } from '../../game';

export interface ILobbyReducerState {
  playerId: string | null;
  playerName: string;
  playerCredentials: string;
  roomId: string | null;
  roomData: IRoomData | null;
  setupData: ISetupData | undefined;
}
