import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { lobbyService } from '../../api/lobby';
import { IPlayerJoinData, IRoomData } from '../../api/types';
import { ExpansionName, ISetupData } from '../../game';
import history from '../../history';
import { IAppState } from '../types';
import { ILobbyReducerState } from './lobbyStore.types';

const initialState: ILobbyReducerState = {
  playerId: null,
  playerName: localStorage.getItem('bang-playerName') ?? '',
  playerCredentials: '',
  roomId: null,
  roomData: null,
  setupData: undefined,
};

export const lobbySlice = createSlice({
  name: 'lobby',
  initialState,
  reducers: {
    setPlayerId: (state, action: PayloadAction<string | null>) => {
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
    setRoomData: (state, action: PayloadAction<IRoomData | null>) => {
      state.roomData = action.payload;
    },
    setSetupData: (state, action: PayloadAction<ExpansionName>) => {
      if (state.setupData) {
        if (state.setupData.expansions.includes(action.payload)) {
          state.setupData.expansions = state.setupData.expansions.filter(
            name => name !== action.payload
          );
        } else {
          state.setupData.expansions = [...state.setupData.expansions, action.payload];
        }
      } else {
        state.setupData = {
          expansions: [action.payload],
        };
      }
    },
  },
});

export const {
  setPlayerId,
  setPlayerName,
  setPlayerCredentials,
  setRoomData,
  setRoomId,
  setSetupData,
} = lobbySlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const createGameRoom = (numPlayers: number, setupData?: ISetupData) => async (
  dispatch: Dispatch
) => {
  const roomId = await lobbyService.createGame(numPlayers, setupData);
  dispatch(setRoomId(roomId));
  history.push(`/rooms/${roomId}`);
};

export const joinRoom = (roomId: string, playerData: IPlayerJoinData) => async (
  dispatch: Dispatch
) => {
  try {
    const playerCredentials = await lobbyService.joinGame(roomId, playerData);
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
export const selectSetUpData = (state: IAppState) => state.lobby.setupData;

export default lobbySlice.reducer;
