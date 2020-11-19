import { Ctx, Game } from 'boardgame.io';
import { TurnOrder } from 'boardgame.io/core';
import { gameNames } from './constants';
import moves from './moves';
import phases from './phases';
import setup from './setup';
import stages from './stages';
import { ICard, IGameState } from './types';

const game: Game<IGameState> = {
  name: gameNames.bang,
  setup,
  moves,
  phases,
  turn: {
    order: {
      ...TurnOrder.DEFAULT,
      first: (G: IGameState, ctx: Ctx) => {
        const allPlayerIds = Object.keys(G.players);
        const sheriffId = allPlayerIds.find(id => G.players[id].role === 'sheriff');
        return Number(sheriffId) ?? 0;
      },
    },
    stages,
    onBegin: (G: IGameState, ctx: Ctx) => {
      if (G.deck.length <= 10) {
        while (G.discarded.length > 2) {
          G.deck.push(G.discarded.pop() as ICard);
        }
        G.deck = ctx.random ? ctx.random?.Shuffle(G.deck) : G.deck;
      }
      for (const playerId in G.players) {
        const player = G.players[playerId];
        const hasVolcanic = player.equipments.some(card => card.name === 'volcanic');
        if (player.character.name !== 'willy the kid' && !hasVolcanic) {
          player.numBangsLeft = 1;
        }
      }
    },
  },
};

export default game;
