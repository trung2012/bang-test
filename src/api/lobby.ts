import axios from 'axios';
import { SERVER_URL } from '../config';
import { ISetupData } from '../game';
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

const joinGame = async (roomId: string, playerData: IPlayerJoinData) => {
  const { data } = await axios.post(`/${roomId}/join`, {
    ...playerData,
  });

  return data.playerCredentials;
};

const getGameData = async (roomId: string): Promise<IRoomData> => {
  const { data } = await axios.get(`/${roomId}`);
  return data;
};

const leaveRoom = async (roomId: string, playerId: string, credentials: string) => {
  try {
    await axios.post(`/${roomId}/leave`, { playerID: playerId, credentials });
  } catch (err) {
    console.log(err.response.data);
  }
};

const playAgain = async (
  roomId: string,
  playerId: string,
  credentials: string,
  setupData: ISetupData
) => {
  try {
    let requestBody = { playerID: playerId, credentials, setupData };
    if (setupData) {
      requestBody.setupData = setupData;
    }

    const { data } = await axios.post(`/${roomId}/playAgain`, requestBody);
    return data.nextMatchID;
  } catch (err) {
    console.log(err.response.data);
  }
};

export const lobbyService = {
  createGame,
  joinGame,
  getGameData,
  leaveRoom,
  playAgain,
};
