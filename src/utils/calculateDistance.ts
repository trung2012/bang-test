import { IGamePlayerMap } from '../game';

export const calculateDistanceFromTarget = (
  players: IGamePlayerMap,
  playOrder: string[],
  sourcePlayerId: string,
  targetPlayerId: string
) => {
  const playersAlive = playOrder.filter(id => players[id].hp > 0);
  const currentPlayerIndex = playersAlive.findIndex(id => sourcePlayerId === id);
  const targetPlayerIndex = playersAlive.findIndex(id => targetPlayerId === id);
  let distance = Math.abs(currentPlayerIndex - targetPlayerIndex);
  const sourcePlayer = players[sourcePlayerId];
  const targetPlayer = players[targetPlayerId];
  let trueDistance = Math.min(distance, playersAlive.length - distance);

  if (targetPlayer.equipments.find(card => card.name === 'mustang')) {
    trueDistance += 1;
  }

  if (targetPlayer.equipments.find(card => card.name === 'hideout')) {
    trueDistance += 1;
  }

  if (targetPlayer.character.name === 'paul regret') {
    trueDistance += 1;
  }

  if (sourcePlayer.character.name === 'rose doolan') {
    trueDistance -= 1;
  }

  if (sourcePlayer.equipments.find(card => card.name === 'scope')) {
    trueDistance -= 1;
  }

  if (sourcePlayer.equipments.find(card => card.name === 'binocular')) {
    trueDistance -= 1;
  }

  return trueDistance;
};

export const isTargetWithinReach = (reach: number, distance: number) => {
  return reach >= distance;
};
