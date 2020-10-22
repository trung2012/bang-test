import { GAME_NAME } from './constants';
import moves from './moves';
import phases from './phases';
import { setup } from './setup';
import stages from './stages';

export default {
  name: GAME_NAME,
  setup,
  moves,
  phases,
  stages,
};
