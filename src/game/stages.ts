import { StageMap } from 'boardgame.io/dist/types/src/types';
import moves from './moves';
import { IGameState } from './types';

const stages: StageMap<IGameState> = {
  drawToReact: {
    moves: {},
  },
  pickFromGeneralStore: {
    moves: {
      pickCardFromGeneralStore: moves.pickCardFromGeneralStore,
    },
  },
  duel: {
    moves: {
      duel: moves.duel,
      takeDamage: moves.takeDamage,
    },
  },
  reactToGatling: {
    moves: {
      takeDamage: moves.takeDamage,
    },
  },
  reactToIndians: {
    moves: {
      takeDamage: moves.takeDamage,
    },
  },
  reactToBang: {
    moves: {
      playCardToReact: moves.playCardToReact,
      drawToReact: moves.drawToReact,
    },
  },
};

export default stages;
