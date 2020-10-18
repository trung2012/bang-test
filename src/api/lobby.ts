import axios from 'axios';
import { serverUrl } from '../config';
import { IPlayerJoinData, IRoomData } from './types';

const gameName = 'bang';
axios.defaults.baseURL = `${serverUrl}/games/${gameName}`;

const createGame = async (numPlayers: number) => {
  const { data } = await axios.post('/create', { numPlayers });
  return data.matchID;
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
  console.log({ playerID: playerId, credentials });
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
