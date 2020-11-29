import { Ctx } from 'boardgame.io';
import { gunRange, stageNames } from './constants';
import { IGameState, ICard, IGamePlayer, CharacterName, RobbingType } from './types';

export const drawCardToReact = (G: IGameState, ctx: Ctx, currentPlayer: IGamePlayer) => {
  let cards: ICard[] = [];
  let drawnCard = G.deck.pop();

  if (drawnCard) {
    cards.push(drawnCard);
  }

  if (currentPlayer.character.name === 'lucky duke') {
    const extraCard = G.deck.pop();

    if (extraCard) {
      cards.push(extraCard);
    }
  }

  currentPlayer.cardsInPlay.push(...cards);
  return { G, ctx, currentPlayer };
};

export const dynamiteResult = (G: IGameState, ctx: Ctx, currentPlayer: IGamePlayer) => {
  const isFailure = currentPlayer.cardsInPlay.every(
    card => card.suit === 'spades' && card.value >= 2 && card.value <= 9
  );
  const dynamiteCardIndex = currentPlayer.equipments.findIndex(card => card.name === 'dynamite');

  if (isFailure) {
    currentPlayer.hp -= 3;
    const beerCardIndex = currentPlayer.hand.findIndex(card => card.name === 'beer');

    if (beerCardIndex !== -1 && currentPlayer.hp === 0) {
      const cardToPlay = currentPlayer.hand.splice(beerCardIndex, 1)[0];
      currentPlayer.cardsInPlay.push(cardToPlay);
      currentPlayer.hp = 1;

      while (currentPlayer.cardsInPlay.length > 0) {
        const discardedCard = currentPlayer.cardsInPlay.shift();
        if (discardedCard) {
          G.discarded.push(discardedCard);
        }
      }
    }

    const dynamiteCard = currentPlayer.equipments.splice(dynamiteCardIndex, 1)[0];
    G.discarded.push(dynamiteCard);

    while (currentPlayer.cardsInPlay.length > 0) {
      const discardedCard = currentPlayer.cardsInPlay.shift();
      if (discardedCard) {
        G.discarded.push(discardedCard);
      }
    }

    return isFailure;
  }

  const nextPlayerId = (Number(currentPlayer.id) + 1) % ctx.playOrder.length;
  const nextPlayer = G.players[nextPlayerId];
  const dynamiteCard = currentPlayer.equipments.splice(dynamiteCardIndex, 1)[0];
  nextPlayer.equipments.push(dynamiteCard);
  while (currentPlayer.cardsInPlay.length > 0) {
    const discardedCard = currentPlayer.cardsInPlay.shift();
    if (discardedCard) {
      G.discarded.push(discardedCard);
    }
  }
};

export const jailResult = (G: IGameState, ctx: Ctx, currentPlayer: IGamePlayer) => {
  const isFailure = currentPlayer.cardsInPlay.every(card => card.suit !== 'hearts');
  const jailCardIndex = currentPlayer.equipments.findIndex(card => card.name === 'jail');

  while (currentPlayer.cardsInPlay.length > 0) {
    const discardedCard = currentPlayer.cardsInPlay.shift();
    if (discardedCard) {
      G.discarded.push(discardedCard);
    }
  }

  const jailCard = currentPlayer.equipments.splice(jailCardIndex, 1)[0];
  G.discarded.push(jailCard);

  if (ctx.events?.endStage) {
    ctx.events.endStage();
  }

  return isFailure;
};

export const hasDynamite = (player: IGamePlayer) =>
  player.equipments.find(card => card.name === 'dynamite');
export const isJailed = (player: IGamePlayer) =>
  player.equipments.find(card => card.name === 'jail');

export const isCharacterInGame = (G: IGameState, characterName: CharacterName) => {
  let matchingPlayerId: string | undefined = undefined;
  for (const playerId in G.players) {
    const player = G.players[playerId];
    if (player.character.name === characterName && player.hp > 0) {
      matchingPlayerId = playerId;
      break;
    }
  }

  return matchingPlayerId;
};

export const setSidKetchumState = (G: IGameState, ctx: Ctx) => {
  if (G.sidKetchumId && (!ctx.activePlayers || !ctx.activePlayers[G.sidKetchumId])) {
    if (G.sidKetchumId !== ctx.currentPlayer && G.players[G.sidKetchumId].hp > 0) {
      if (ctx.events?.setActivePlayers) {
        ctx.events.setActivePlayers({
          currentPlayer: stageNames.play,
          value: {
            [G.sidKetchumId]: 'sidKetchum',
          },
        });
      }
    }
  }
};

export const setSidKetchumStateAfterEndingStage = (
  G: IGameState,
  ctx: Ctx,
  previousStage: string | null = null
) => {
  if (G.sidKetchumId && G.sidKetchumId !== ctx.currentPlayer && G.players[G.sidKetchumId].hp > 0) {
    if (ctx.events?.setActivePlayers) {
      const activePlayers: { [key: string]: any } = {
        currentPlayer: 'play',
        value: {
          [G.sidKetchumId]: stageNames.sidKetchum,
        },
      };

      const otherActivePlayersAlive = G.playOrder.filter(
        playerId => playerId !== ctx.currentPlayer && playerId !== G.sidKetchumId
      );

      if (previousStage) {
        for (const playerId of otherActivePlayersAlive) {
          activePlayers[Number(playerId)] = previousStage;
        }
      }

      ctx.events.setActivePlayers(activePlayers);
    }
  }
};

export const processEquipmentRemoval = (
  currentPlayer: IGamePlayer,
  targetPlayer: IGamePlayer,
  targetCardIndex: number,
  cardToTake: ICard,
  type: RobbingType
) => {
  switch (type) {
    case 'hand':
      cardToTake = targetPlayer.hand.splice(targetCardIndex, 1)[0];
      break;
    case 'equipment':
      cardToTake = targetPlayer.equipments.splice(targetCardIndex, 1)[0];
      let gunWithRange = gunRange[cardToTake.name];
      if (gunWithRange) {
        targetPlayer.gunRange = 1;
        currentPlayer.gunRange = gunWithRange;
        if (cardToTake.name === 'volcanic') {
          targetPlayer.numBangsLeft = 1;
          currentPlayer.numBangsLeft = 9999;
        }
      }
      break;
  }
};

export const getOtherPlayersAlive = (G: IGameState, ctx: Ctx, stageName: string) => {
  const playersAlive = ctx.playOrder
    .map(id => G.players[id])
    .filter(player => player.hp > 0)
    .filter(player => player.id !== ctx.currentPlayer);
  const activePlayers = playersAlive.reduce((players, player) => {
    players[player.id] = stageName;
    return players;
  }, {} as { [key: string]: any });

  return activePlayers;
};
