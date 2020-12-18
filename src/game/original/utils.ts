import { Ctx } from 'boardgame.io';
import { cards_DodgeCity, cards_VOS } from '../expansions';
import { ExpansionName } from './config';
import { gunRange, stageNames } from './constants';
import { clearCardsInPlay } from './moves';
import { IGameState, IGamePlayer, CharacterName, ICard, RobbingType } from './types';

export const hasDynamite = (player: IGamePlayer) => {
  return player.equipments.find(card => card.name === 'dynamite');
};

export const hasActiveDynamite = (player: IGamePlayer) => {
  const dynamiteCard = hasDynamite(player);
  return dynamiteCard && dynamiteCard.timer === 0;
};

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
          [G.sidKetchumId]: stageNames.discard,
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

export const getOtherPlayersAliveStages = (G: IGameState, ctx: Ctx, stageName: string) => {
  const playersAlive = getOtherPlayersAlive(G, ctx);

  const activePlayers = playersAlive.reduce((players, player) => {
    players[player.id] = stageName;
    return players;
  }, {} as { [key: string]: any });

  return activePlayers;
};

export const getOtherPlayersAlive = (G: IGameState, ctx: Ctx) => {
  return ctx.playOrder
    .map(id => G.players[id])
    .filter(player => player.hp > 0 && player.id !== ctx.currentPlayer);
};

export const shuffle = (ctx: Ctx, array: any[]) => {
  return (array = ctx.random?.Shuffle ? ctx.random.Shuffle(array) : array);
};

export const processEquipmentRemoval = (
  targetPlayer: IGamePlayer,
  targetCardIndex: number,
  type: RobbingType
) => {
  let cardToDiscard: ICard;
  switch (type) {
    case 'hand':
      cardToDiscard = targetPlayer.hand.splice(targetCardIndex, 1)[0];
      break;
    case 'equipment':
      cardToDiscard = targetPlayer.equipments.splice(targetCardIndex, 1)[0];
      let gunWithRange = gunRange[cardToDiscard.name];
      if (gunWithRange) {
        targetPlayer.gunRange = targetPlayer.character.name === 'rose doolan' ? 2 : 1;
        if (cardToDiscard.name === 'volcanic') {
          if (targetPlayer.character.name !== 'willy the kid') {
            targetPlayer.numBangsLeft = Math.min(1, targetPlayer.numBangsLeft);
          }
        }
      }
      if (cardToDiscard.name === 'scope' || cardToDiscard.name === 'binocular') {
        targetPlayer.actionRange -= 1;
        targetPlayer.gunRange -= 1;
      }
      break;
    case 'green':
      cardToDiscard = targetPlayer.equipmentsGreen.splice(targetCardIndex, 1)[0];
      break;
  }

  return cardToDiscard;
};

export const checkIfBeersCanSave = (G: IGameState, ctx: Ctx, targetPlayer: IGamePlayer) => {
  const beerCardIndexes = targetPlayer.hand
    .map((card, index) => (card.name === 'beer' ? index : -1))
    .filter(index => index !== -1);

  const hpAfterBeers = targetPlayer.hp + beerCardIndexes.length;

  if (hpAfterBeers > 0) {
    for (const beerCardIndex of beerCardIndexes) {
      if (beerCardIndex !== -1 && ctx.phase !== 'suddenDeath') {
        const cardToPlay = targetPlayer.hand.splice(beerCardIndex, 1)[0];
        targetPlayer.cardsInPlay.push(cardToPlay);
        targetPlayer.hp = hpAfterBeers;
      }
    }

    clearCardsInPlay(G, ctx, targetPlayer.id);
  }
};

export const addExpansionCards = (cards: ICard[], expansions: ExpansionName[]) => {
  if (expansions.includes('valley of shadows')) {
    cards.push(...cards_VOS);
  }

  if (expansions.includes('dodge city')) {
    cards.push(...cards_DodgeCity);
  }

  return cards;
};
