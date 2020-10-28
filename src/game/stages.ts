import { StageMap } from 'boardgame.io/dist/types/src/types';
import { IGameState } from './types';

const stages: StageMap<IGameState> = {
  drawToReact: {
    moves: {},
  },
  pickFromGeneralStore: {
    moves: {},
  },
  duel: {
    moves: {},
  },
  reactToGattling: {},
  reactToIndians: {},
};

export default stages;
