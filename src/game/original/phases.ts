import { Ctx, PhaseConfig } from 'boardgame.io';
import { TurnOrder } from 'boardgame.io/core';
import moves from './moves';
import { IGameState } from './types';

interface IGamePhases {
  [phaseName: string]: PhaseConfig;
}

const phases: IGamePhases = {
  reselectCharacter: {
    moves: {
      reselectCharacter: moves.reselectCharacter,
      endTurn: moves.endTurn,
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
      moveLimit: 1,
    },
    start: true,
    next: 'main',
    endIf: (G: IGameState, ctx: Ctx) => ctx.turn > ctx.playOrder.length,
  },
  main: {
    endIf: (G: IGameState) => Object.keys(G.players).length === 2,
    next: 'suddenDeath',
  },
  suddenDeath: {},
};

export default phases;
