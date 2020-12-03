import { Ctx, FilteredMetadata } from 'boardgame.io';
import { EventsAPI } from 'boardgame.io/dist/types/src/plugins/events/events';
import React, { useContext } from 'react';
import { IGameState } from '../../game';

export interface IGameContext {
  G: IGameState;
  ctx: Ctx;
  moves: Record<string, (...args: any[]) => void>;
  events: EventsAPI;
  playerID: string | null;
  isActive: boolean;
  playersInfo: FilteredMetadata | undefined;
}

export const GameContext = React.createContext<IGameContext | null>(null);

export const useGameContext = () => {
  const ctx = useContext(GameContext);

  if (!ctx) {
    throw new Error('useGameContext must be inside a GameContext Provider with value');
  }
  return ctx;
};
