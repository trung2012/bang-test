import { Ctx, Game } from 'boardgame.io';
import { TurnOrder } from 'boardgame.io/core';
import { EffectsPlugin } from 'bgio-effects/plugin';
import { gameNames } from './constants';
import moves from './moves';
import phases from './phases';
import setup from './setup';
import stages from './stages';
import { ICard, IGameState } from './types';
// import { drawCardToReact, dynamiteResult, jailResult } from './utils';
import { config } from './effects';

declare module 'boardgame.io' {
  interface Ctx {
    effects: {
      [key: string]: any;
    };
  }
}

const game: Game<IGameState> = {
  name: gameNames.bang,
  setup,
  plugins: [EffectsPlugin(config)],
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
      next: (G: IGameState, ctx: Ctx) => {
        let nextPlayerPos = ctx.playOrderPos % ctx.playOrder.length;
        do {
          nextPlayerPos = (nextPlayerPos + 1) % ctx.playOrder.length;
        } while (G.players[nextPlayerPos.toString()].hp <= 0);
        return nextPlayerPos;
      },
    },
    stages,
    onMove: (G: IGameState, ctx: Ctx) => {
      let isSuzyLafayetteInGame = false;
      let suzyPlayerId: string | undefined = undefined;
      for (const playerId in G.players) {
        if (G.players[playerId].character.name === 'suzy lafayette') {
          isSuzyLafayetteInGame = true;
          suzyPlayerId = playerId;
          break;
        }
      }

      if (isSuzyLafayetteInGame && suzyPlayerId !== undefined) {
        const suzyPlayer = G.players[suzyPlayerId];
        if (suzyPlayer.hand.length === 0) {
          const newCard = G.deck.pop();
          if (newCard) {
            suzyPlayer.hand.push(newCard);
          }
        }
      }
    },
    onBegin: (G: IGameState, ctx: Ctx) => {
      if (G.deck.length <= 10) {
        while (G.discarded.length > 2) {
          G.deck.push(G.discarded.pop() as ICard);
        }
        G.deck = ctx.random?.Shuffle ? ctx.random?.Shuffle(G.deck) : G.deck;
      }
    },
    onEnd: (G: IGameState, ctx: Ctx) => {
      for (const playerId in G.players) {
        const player = G.players[playerId];
        const hasVolcanic = player.equipments.find(card => card.name === 'volcanic');
        if (player.character.name !== 'willy the kid' && !hasVolcanic) {
          player.numBangsLeft = 1;
        }

        player.cardDiscardedThisTurn = 0;
        player.cardDrawnAtStartLeft =
          player.character.name === 'black jack' || player.character.name === 'kit carlson' ? 3 : 2;
        player.barrelUseLeft = 1;
      }
    },
  },
};

export default game;
