import { Ctx, FilteredMetadata } from 'boardgame.io';
import { EventsAPI } from 'boardgame.io/dist/types/src/plugins/events/events';
import { MoveMap } from 'boardgame.io/src/types';
import React, { useContext } from 'react';
import { IGameState } from '../../game/types';

export interface IGameContext {
  G: IGameState;
  ctx: Ctx;
  moves: MoveMap<IGameState>;
  events: EventsAPI;
  playerID: string | null;
  isActive: boolean;
  playersInfo: FilteredMetadata | undefined;
}

export const GameContext = React.createContext<IGameContext>({} as IGameContext);

export const useGameContext = () => useContext(GameContext);
