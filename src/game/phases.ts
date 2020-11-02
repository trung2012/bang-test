import { PhaseConfig } from 'boardgame.io';
import { IGameState } from './types';

interface IGamePhases {
  [phaseName: string]: PhaseConfig;
}

const phases: IGamePhases = {
  main: {
    endIf: (G: IGameState) => {},
  },
};

export default phases;
