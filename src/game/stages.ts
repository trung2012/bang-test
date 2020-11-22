import { StageMap } from 'boardgame.io/dist/types/src/types';
import moves from './moves';
import { IGameState } from './types';

const stages: StageMap<IGameState> = {
  pickFromGeneralStore: {
    moves: {
      pickCardFromGeneralStore: moves.pickCardFromGeneralStore,
    },
  },
  duel: {
    moves: {
      playCardToReact: moves.playCardToReact,
      takeDamage: moves.takeDamage,
    },
  },
  reactToGatling: {
    moves: {
      playCardToReact: moves.playCardToReact,
      takeDamage: moves.takeDamage,
      barrel: moves.barrel,
    },
  },
  reactToIndians: {
    moves: {
      playCardToReact: moves.playCardToReact,
      takeDamage: moves.takeDamage,
    },
  },
  reactToBang: {
    moves: {
      playCardToReact: moves.playCardToReact,
      barrel: moves.barrel,
      takeDamage: moves.takeDamage,
    },
  },
  takeCardFromHand: {
    moves: {
      drawFromPlayerHand: moves.drawFromPlayerHand,
    },
  },
  kitCarlsonDiscard: {
    moves: {
      kitCarlsonDiscard: moves.kitCarlsonDiscard,
    },
  },
};

export default stages;
