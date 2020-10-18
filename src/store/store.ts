import { configureStore, combineReducers } from '@reduxjs/toolkit';
import lobbyStoreReducer from './lobbyStore';

export const rootReducer = combineReducers({
  lobby: lobbyStoreReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});
