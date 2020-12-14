import { Game } from 'boardgame.io';
import { TurnOrder } from 'boardgame.io/core';
import { EffectsPlugin } from 'bgio-effects/plugin';
import { gameNames, teamLookUp } from './constants';
import moves from './moves';
import phases from './phases';
import setup from './setup';
import stages from './stages';
import { ICard, IGameResult, IGameState } from './types';
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
  plugins: [EffectsPlugin(config)],
  setup,
  moves,
  phases,
  endIf: (G, ctx): IGameResult | undefined => {
    const sheriffId = ctx.playOrder.find(playerId => G.players[playerId].role === 'sheriff');
    const sheriffPlayer = G.players[sheriffId!];
    const playersAlive = ctx.playOrder.map(id => G.players[id]).filter(player => player.hp > 0);

    if (sheriffPlayer.hp <= 0) {
      if (playersAlive.length === 1 && playersAlive[0].role === 'renegade') {
        return {
          winners: playersAlive.filter(player => player.role === 'renegade'),
          team: teamLookUp.renegade,
        };
      } else {
        return {
          winners: ctx.playOrder
            .map(id => G.players[id])
            .filter(player => player.role === 'outlaw'),
          team: teamLookUp.outlaw,
        };
      }
    }

    const areOutlawsOrRenegadeAlive = playersAlive.some(
      player => player.role === 'outlaw' || player.role === 'renegade'
    );

    if (!areOutlawsOrRenegadeAlive) {
      return {
        winners: ctx.playOrder
          .map(id => G.players[id])
          .filter(player => player.role === 'sheriff' || player.role === 'deputy'),
        team: teamLookUp.sheriff,
      };
    }
  },
  turn: {
    order: {
      ...TurnOrder.DEFAULT,
      first: (G, ctx) => {
        const allPlayerIds = Object.keys(G.players);
        const sheriffId = allPlayerIds.find(id => G.players[id].role === 'sheriff');
        return Number(sheriffId) ?? 0;
      },
      next: (G, ctx) => {
        let nextPlayerPos = ctx.playOrderPos % ctx.playOrder.length;
        do {
          nextPlayerPos = (nextPlayerPos + 1) % ctx.playOrder.length;
        } while (G.players[nextPlayerPos.toString()].hp <= 0);
        return nextPlayerPos;
      },
    },
    stages,
    onMove: (G, ctx) => {
      if (G.deck.length <= 6) {
        while (G.discarded.length > 2) {
          G.deck.push(G.discarded.pop() as ICard);
        }
        G.deck = ctx.random?.Shuffle ? ctx.random?.Shuffle(G.deck) : G.deck;
      }

      let suzyPlayerId = ctx.playOrder.find(
        playerId => G.players[playerId].character.name === 'suzy lafayette'
      );
      if (suzyPlayerId !== undefined) {
        const suzyPlayer = G.players[suzyPlayerId];
        if (suzyPlayer.hp > 0 && suzyPlayer.hand.length === 0) {
          const newCard = G.deck.pop();
          if (newCard) {
            suzyPlayer.hand.push(newCard);
          }
        }
      }
    },
    onEnd: (G, ctx) => {
      for (const playerId in G.players) {
        const player = G.players[playerId];
        const hasVolcanic = player.equipments.find(card => card.name === 'volcanic');
        if (player.character.name !== 'willy the kid' && !hasVolcanic) {
          player.numBangsLeft = 1;
        }

        player.cardDiscardedThisTurn = 0;
        player.cardDrawnAtStartLeft = 2;
        player.barrelUseLeft = 1;
      }
    },
  },
};

export default game;
