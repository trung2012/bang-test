import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { lobbyService } from '../../api/lobby';
import { IPlayerJoinData, IRoomData } from '../../api/types';
import history from '../../history';
import { IAppState } from '../types';
import { ILobbyReducerState } from './lobbyStore.types';

const initialState: ILobbyReducerState = {
  playerId: null,
  playerName: localStorage.getItem('bang-playerName') ?? '',
  playerCredentials: localStorage.getItem('bang-playerCredentials') ?? '',
  roomId: null,
  roomData: null,
};

export const lobbySlice = createSlice({
  name: 'lobby',
  initialState,
  reducers: {
    setPlayerId: (state, action: PayloadAction<string>) => {
      state.playerId = action.payload;
    },
    setPlayerName: (state, action: PayloadAction<string>) => {
      state.playerName = action.payload;
    },
    setPlayerCredentials: (state, action: PayloadAction<string>) => {
      state.playerCredentials = action.payload;
    },
    setRoomId: (state, action: PayloadAction<string>) => {
      state.roomId = action.payload;
    },
    setRoomData: (state, action: PayloadAction<IRoomData>) => {
      state.roomData = action.payload;
    },
  },
});

export const {
  setPlayerId,
  setPlayerName,
  setPlayerCredentials,
  setRoomData,
  setRoomId,
} = lobbySlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const createGameRoom = (numPlayers: number) => async (dispatch: Dispatch) => {
  const roomId = await lobbyService.createGame(numPlayers);
  dispatch(setRoomId(roomId));
  history.push(`/rooms/${roomId}`);
};

export const joinRoom = (roomId: string, playerData: IPlayerJoinData) => async (
  dispatch: Dispatch
) => {
  try {
    const playerCredentials = await lobbyService.joinGame(roomId, playerData);
    localStorage.setItem('bang-playerCredentials', playerCredentials);
    dispatch(setPlayerCredentials(playerCredentials));
  } catch (err) {
    console.log(err);
  }
};

export const getRoomData = (roomId: string) => async (dispatch: Dispatch) => {
  const roomData = await lobbyService.getGameData(roomId);
  dispatch(setRoomData(roomData));
};

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.lobby.value)`
export const selectState = (state: IAppState) => state;
export const selectPlayerId = (state: IAppState) => state.lobby.playerId;
export const selectPlayerName = (state: IAppState) => state.lobby.playerName;
export const selectPlayerCredentials = (state: IAppState) => state.lobby.playerCredentials;
export const selectRoomId = (state: IAppState) => state.lobby.roomId;
export const selectRoomData = (state: IAppState) => state.lobby.roomData;

export default lobbySlice.reducer;
