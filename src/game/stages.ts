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
      drawToReact: moves.drawToReact,
      barrelResult: moves.barrelResult,
      clearCardsInPlay: moves.clearCardsInPlay,
    },
  },
  reactToIndians: {
    moves: {
      playCardToReact: moves.playCardToReact,
      takeDamage: moves.takeDamage,
      clearCardsInPlay: moves.clearCardsInPlay,
    },
  },
  reactToBang: {
    moves: {
      playCardToReact: moves.playCardToReact,
      drawToReact: moves.drawToReact,
      barrelResult: moves.barrelResult,
      takeDamage: moves.takeDamage,
      clearCardsInPlay: moves.clearCardsInPlay,
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
  clearCardsInPlay: {
    moves: {
      clearCardsInPlay: moves.clearCardsInPlay,
    },
  },
};

export default stages;
