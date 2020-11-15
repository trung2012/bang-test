import { FilteredMetadata } from 'boardgame.io';
import { IGamePlayerMap } from '../game/types';

export const calculateDistanceFromTarget = (
  players: IGamePlayerMap,
  playersInfo: FilteredMetadata,
  currentPlayerIndex: number,
  targetPlayerIndex: number
) => {
  let distance = Math.abs(currentPlayerIndex - targetPlayerIndex);
  const targetPlayer = players[targetPlayerIndex];

  if (targetPlayer.equipments.find(card => card.name === 'mustang')) {
    distance += 1;
  }
  return Math.min(distance, playersInfo.length - distance);
};

export const isTargetWithinReach = (reach: number, distance: number) => {
  return reach >= distance;
};
