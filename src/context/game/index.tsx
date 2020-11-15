import { Ctx, FilteredMetadata } from 'boardgame.io';
import { EventsAPI } from 'boardgame.io/dist/types/src/plugins/events/events';
import React, { useContext } from 'react';
import { IGameState } from '../../game/types';

export interface IGameContext {
  G: IGameState;
  ctx: Ctx;
  moves: Record<string, (...args: any[]) => void>;
  events: EventsAPI;
  playerID: string | null;
  isActive: boolean;
  playersInfo: FilteredMetadata | undefined;
}

export const GameContext = React.createContext<IGameContext>({} as IGameContext);

export const useGameContext = () => useContext(GameContext);
