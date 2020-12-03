import { PhaseConfig } from 'boardgame.io';
import { IGameState } from './types';

interface IGamePhases {
  [phaseName: string]: PhaseConfig;
}

const phases: IGamePhases = {
  main: {
    endIf: (G: IGameState) => Object.keys(G.players).length === 2,
    next: 'suddenDeath',
    start: true,
  },
  suddenDeath: {},
};

export default phases;
