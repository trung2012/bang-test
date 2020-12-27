import { Ctx } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';
import { cardsThatDrawsOneWhenPlayed, cards_DodgeCity, characters_DodgeCity } from '../expansions';
import { ExpansionName } from './config';
import { gunRange, stageNames } from './constants';
import {
  IGameState,
  IGamePlayer,
  CharacterName,
  ICard,
  RobbingType,
  CardName,
  ICharacter,
} from './types';

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
  let matchingPlayerIds: string[] | undefined = undefined;

  for (const playerId in G.players) {
    const player = G.players[playerId];
    if (player.character.name === characterName && player.hp > 0) {
      if (matchingPlayerIds === undefined) {
        matchingPlayerIds = [playerId];
      } else {
        matchingPlayerIds = [...matchingPlayerIds, playerId];
      }
    }
  }

  return matchingPlayerIds;
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

export const processCardRemoval = (
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
        targetPlayer.gunRange = 1;
        if (cardToDiscard.name === 'volcanic' && targetPlayer.character.name !== 'willy the kid') {
          targetPlayer.numBangsLeft = 1;
        }
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

  const hpAfterBeers =
    targetPlayer.character.name === 'tequila joe'
      ? targetPlayer.hp + beerCardIndexes.length * 2
      : targetPlayer.hp + beerCardIndexes.length;

  if (hpAfterBeers > 0) {
    for (const beerCardIndex of beerCardIndexes) {
      if (beerCardIndex !== -1) {
        const cardToPlay = targetPlayer.hand.splice(beerCardIndex, 1)[0];
        G.discarded.push(cardToPlay);
        targetPlayer.hp = hpAfterBeers;
      }
    }
    if (targetPlayer.character.name === 'molly stark') {
      const mollyStarkCardsToDraw = G.deck.slice(
        G.deck.length - beerCardIndexes.length,
        G.deck.length
      );
      if (mollyStarkCardsToDraw.length > 0) {
        G.deck = G.deck.slice(0, G.deck.length - beerCardIndexes.length);
        targetPlayer.hand.push(...mollyStarkCardsToDraw);
      }
    }

    return true;
  }
};

export const addExpansionCards = (cards: ICard[], expansions: ExpansionName[]) => {
  const newCards = [...cards];
  if (expansions.includes('valley of shadows')) {
    // newCards.push(...cards_VOS);
  }

  if (expansions.includes('dodge city')) {
    newCards.push(...cards_DodgeCity);
  }

  return newCards;
};

export const addExpansionCharacters = (characters: ICharacter[], expansions: ExpansionName[]) => {
  if (expansions.includes('valley of shadows')) {
    // newCharacters.push(...characters_VOS);
  }

  // if (expansions.includes('dodge city')) {
  //   //
  // }
  const newCharacters = [...characters];
  newCharacters.push(...characters_DodgeCity);

  return [...newCharacters];
};

export const checkIfCanDrawOneAfterReacting = (
  G: IGameState,
  reactingPlayer: IGamePlayer,
  card: ICard
) => {
  if (card && cardsThatDrawsOneWhenPlayed.includes(card.name)) {
    const cardToDrawFromDeck = G.deck.pop();

    if (cardToDrawFromDeck) {
      reactingPlayer.hand.push(cardToDrawFromDeck);
    }
  }
};

export const resetCardTimer = (card: ICard) => {
  if (card && card.timer !== undefined) {
    card.timer = 1;
  }
};

export const canPlayCardToReact = (
  reactionRequired: {
    sourcePlayerId: string | null;
    cardNeeded: CardName[];
    quantity: number;
    cardToPlayAfterDiscard?: CardName | null;
    targetPlayerId?: string;
  },
  reactingPlayer: IGamePlayer,
  cardClicked: ICard
) => {
  return (
    reactionRequired.cardNeeded.includes(cardClicked.name) ||
    (reactingPlayer.character.name === 'calamity janet' &&
      ['bang', 'missed'].includes(cardClicked.name) &&
      reactionRequired.cardNeeded.some((cardName: CardName) =>
        ['bang', 'missed'].includes(cardName)
      )) ||
    (reactionRequired.cardNeeded.includes('missed') &&
      reactingPlayer.character.name === 'elena fuente')
  );
};

export const mollyStarkDraw = (G: IGameState, ctx: Ctx, targetPlayer: IGamePlayer) => {
  if (targetPlayer.id === ctx.currentPlayer) {
    return INVALID_MOVE;
  }

  const mollyStarkCardsToDraw = G.deck.slice(
    G.deck.length - targetPlayer.mollyStarkCardsPlayed,
    G.deck.length
  );
  if (mollyStarkCardsToDraw.length > 0) {
    G.deck = G.deck.slice(0, G.deck.length - targetPlayer.mollyStarkCardsPlayed);
    targetPlayer.hand.push(...mollyStarkCardsToDraw);
  }
  targetPlayer.mollyStarkCardsPlayed = 0;
  targetPlayer.hand = shuffle(ctx, targetPlayer.hand);
};

export const processOneVultureSamPower = (
  G: IGameState,
  targetPlayer: IGamePlayer,
  vultureSamId: string
) => {
  const vultureSamPlayer = G.players[vultureSamId];
  const dynamiteCard = targetPlayer.equipments.find(card => card.name === 'dynamite');
  if (dynamiteCard) {
    dynamiteCard.timer = 1;
  }

  while (targetPlayer.hand.length > 0) {
    const cardToTake = targetPlayer.hand.pop();
    if (cardToTake) {
      vultureSamPlayer.hand.push(cardToTake);
    }
  }

  while (targetPlayer.equipments.length > 0) {
    const cardToTake = targetPlayer.equipments.pop();
    if (cardToTake) {
      vultureSamPlayer.hand.push(cardToTake);
    }
  }
};

export const processMultipleVultureSamPower = (
  G: IGameState,
  targetPlayer: IGamePlayer,
  vultureSamIds: string[]
) => {
  vultureSamIds.forEach((vultureSamId, index) => {
    const vultureSamPlayer = G.players[vultureSamId];
    const dynamiteCard = targetPlayer.equipments.find(card => card.name === 'dynamite');
    if (dynamiteCard) {
      dynamiteCard.timer = 1;
    }

    for (let i = targetPlayer.hand.length - 1; i >= 0; i--) {
      const cardToTake = targetPlayer.hand.pop();
      if (cardToTake) {
        if (i % 2 === index) {
          vultureSamPlayer.hand.push(cardToTake);
        }
      }
    }

    for (let i = targetPlayer.equipments.length - 1; i >= 0; i--) {
      const cardToTake = targetPlayer.equipments.pop();
      if (cardToTake) {
        if (i % 2 === index) {
          vultureSamPlayer.hand.push(cardToTake);
        }
      }
    }
  });
};

export const setVeraCusterStage = (ctx: Ctx) => {
  if (ctx.events?.setActivePlayers) {
    ctx.events.setActivePlayers({
      currentPlayer: stageNames.copyCharacter,
      moveLimit: 1,
    });
  }
};

export const getNextPlayerToPassEquipments = (G: IGameState, ctx: Ctx) => {
  let nextPlayerPos = ctx.playOrderPos % ctx.playOrder.length;
  do {
    nextPlayerPos = (nextPlayerPos + 1) % ctx.playOrder.length;
  } while (G.players[nextPlayerPos.toString()].hp <= 0);
  return nextPlayerPos;
};
