import { StageMap } from 'boardgame.io/dist/types/src/types';
import moves from './moves';
import { IGameState } from './types';

const stages: StageMap<IGameState> = {
  discardToPlayCard: {
    moves: {
      discardFromHand: moves.discardFromHand,
      resetGameStage: moves.resetGameStage,
      clearCardsInPlay: moves.clearCardsInPlay,
    },
  },
  joseDelgadoDiscard: {
    moves: {
      discardFromHand: moves.discardFromHand,
      resetGameStage: moves.resetGameStage,
      clearCardsInPlay: moves.clearCardsInPlay,
    },
  },
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
      discardFromHand: moves.discardFromHand,
    },
  },
  reactToGatling: {
    moves: {
      playCardToReact: moves.playCardToReact,
      takeDamage: moves.takeDamage,
      drawToReact: moves.drawToReact,
      barrelResult: moves.barrelResult,
      clearCardsInPlay: moves.clearCardsInPlay,
      discardFromHand: moves.discardFromHand,
    },
  },
  reactToIndians: {
    moves: {
      playCardToReact: moves.playCardToReact,
      takeDamage: moves.takeDamage,
      clearCardsInPlay: moves.clearCardsInPlay,
      discardFromHand: moves.discardFromHand,
    },
  },
  reactToBang: {
    moves: {
      playCardToReact: moves.playCardToReact,
      drawToReact: moves.drawToReact,
      barrelResult: moves.barrelResult,
      takeDamage: moves.takeDamage,
      clearCardsInPlay: moves.clearCardsInPlay,
      discardFromHand: moves.discardFromHand,
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
      endStage: moves.endStage,
    },
  },
  ragtime: {
    moves: {
      panic: moves.panic,
    },
  },
  copyCharacter: {
    moves: {
      copyCharacter: moves.copyCharacter,
    },
  },
  bandidos: {
    moves: {
      takeDamage: moves.takeDamage,
      discardFromHand: moves.discardFromHand,
      clearCardsInPlay: moves.clearCardsInPlay,
    },
  },
  fanning: {
    moves: {
      bang: moves.bang,
      endStage: moves.endStage,
    },
  },
};

export default stages;
