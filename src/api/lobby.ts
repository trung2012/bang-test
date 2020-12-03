import axios from 'axios';
import { SERVER_URL } from '../config';
import { ISetupData } from '../game/config';
import { IPlayerJoinData, IRoomData } from './types';

const gameName = 'bang';
axios.defaults.baseURL = `${SERVER_URL}/games/${gameName}`;

const createGame = async (numPlayers: number, setupData?: ISetupData) => {
  try {
    const requestBody: { numPlayers: number; setupData?: ISetupData } = {
      numPlayers,
    };

    if (setupData) {
      requestBody.setupData = setupData;
    }

    const { data } = await axios.post('/create', requestBody);

    return data.matchID;
  } catch (err) {
    console.log(err);
  }
};

const joinGame = async (roomId: string, playerData: IPlayerJoinData): Promise<string> => {
  const { data } = await axios.post(`/${roomId}/join`, {
    ...playerData,
  });

  return data.playerCredentials;
};

const getGameData = async (roomId: string): Promise<IRoomData> => {
  const { data } = await axios.get(`/${roomId}`);
  return data;
};

const leaveRoom = async (roomId: string, playerId: string, credentials: string): Promise<void> => {
  try {
    await axios.post(`/${roomId}/leave`, { playerID: playerId, credentials });
  } catch (err) {
    console.log(err.response.data);
  }
};

export const lobbyService = {
  createGame,
  joinGame,
  getGameData,
  leaveRoom,
};
