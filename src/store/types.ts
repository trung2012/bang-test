import { ThunkAction, Action } from '@reduxjs/toolkit';
import { store } from './store';

export type IAppState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  IAppState,
  unknown,
  Action<string>
>;
