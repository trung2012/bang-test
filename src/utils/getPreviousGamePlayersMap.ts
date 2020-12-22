import { FilteredMetadata } from 'boardgame.io';
import { IPreviousGamePlayers } from '../game';

export const getPreviousGamePlayersMap = (
  previousGamePlayersInfo: FilteredMetadata
): IPreviousGamePlayers => {
  return previousGamePlayersInfo.reduce((playersInfoMap, player) => {
    return {
      ...playersInfoMap,
      [player.id]: player.name,
    };
  }, {});
};
