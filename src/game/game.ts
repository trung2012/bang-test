import { GAME_NAME } from './constants';
import moves from './moves';
import phases from './phases';
import setup from './setup';
import stages from './stages';

const game = {
  name: GAME_NAME,
  setup,
  moves,
  phases,
  turn: {
    stages,
  },
};

export default game;
