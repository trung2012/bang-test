import { PhaseConfig } from 'boardgame.io/src/types';
import { IGameState } from './types';

interface IGamePhases {
  [phaseName: string]: PhaseConfig;
}

const phases: IGamePhases = {
  main: {
    endIf: (G: IGameState) => {},
  },
  suddenDeath: {},
};

export default phases;
