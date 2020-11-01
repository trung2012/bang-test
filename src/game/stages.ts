import { StageMap } from 'boardgame.io/dist/types/src/types';
import moves from './moves';
import { IGameState } from './types';

const stages: StageMap<IGameState> = {
  drawToReact: {
    moves: {},
  },
  pickFromGeneralStore: {
    moves: {},
  },
  duel: {
    moves: {
      duel: moves.duel,
      takeDamage: moves.takeDamage,
    },
  },
  reactToGattling: {},
  reactToIndians: {},
};

export default stages;
