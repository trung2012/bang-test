import { Ctx, FilteredMetadata } from 'boardgame.io';
import { EventsAPI } from 'boardgame.io/dist/types/src/plugins/events/events';
import React, { useContext } from 'react';
import { IGameMoves } from '../../game/moves';
import { IGameState } from '../../game/types';

export interface IGameContext {
  G: IGameState;
  ctx: Ctx;
  moves: IGameMoves;
  events: EventsAPI;
  playerID: string | null;
  isActive: boolean;
  matchData: FilteredMetadata | undefined;
}

export const GameContext = React.createContext<IGameContext>({} as IGameContext);

export const useGameContext = () => useContext(GameContext);
