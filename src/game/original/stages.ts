import { StageMap } from 'boardgame.io/dist/types/src/types';
import moves from './moves';
import { IGameState } from './types';

const stages: StageMap<IGameState> = {
  pickFromGeneralStore: {
    moves: {
      pickCardFromGeneralStore: moves.pickCardFromGeneralStore,
      clearCardsInPlay: moves.clearCardsInPlay,
    },
  },
  duel: {
    moves: {
      playCardToReact: moves.playCardToReact,
      takeDamage: moves.takeDamage,
      discard: moves.discard,
    },
  },
  reactToGatling: {
    moves: {
      playCardToReact: moves.playCardToReact,
      takeDamage: moves.takeDamage,
      drawToReact: moves.drawToReact,
      barrelResult: moves.barrelResult,
      clearCardsInPlay: moves.clearCardsInPlay,
      discard: moves.discard,
    },
  },
  reactToIndians: {
    moves: {
      playCardToReact: moves.playCardToReact,
      takeDamage: moves.takeDamage,
      clearCardsInPlay: moves.clearCardsInPlay,
      discard: moves.discard,
    },
  },
  reactToBang: {
    moves: {
      playCardToReact: moves.playCardToReact,
      drawToReact: moves.drawToReact,
      barrelResult: moves.barrelResult,
      takeDamage: moves.takeDamage,
      clearCardsInPlay: moves.clearCardsInPlay,
      discard: moves.discard,
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
  clearCardsInPlay: {},
  play: {},
  discard: {
    moves: {
      discardFromHand: moves.discardFromHand,
    },
  },
};

export default stages;
