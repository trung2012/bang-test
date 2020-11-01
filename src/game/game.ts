import { Ctx } from 'boardgame.io';
import { gameNames } from './constants';
import moves from './moves';
import phases from './phases';
import setup from './setup';
import stages from './stages';
import { ICard, IGameState } from './types';

const game = {
  name: gameNames.bang,
  setup,
  moves,
  phases,
  turn: {
    stages,
    onBegin: (G: IGameState, ctx: Ctx) => {
      if (G.deck.length <= 10) {
        while (G.discarded.length > 2) {
          G.deck.push(G.discarded.pop() as ICard);
        }
        G.deck = ctx.random ? ctx.random?.Shuffle(G.deck) : G.deck;
      }
    },
  },
};

export default game;
