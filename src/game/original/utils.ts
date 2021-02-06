import { Ctx } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';
import { calculateDistanceFromTarget } from '../../utils';
import {
  cardsThatDrawsOneWhenPlayed,
  cards_DodgeCity,
  cards_VOS,
  characters_DodgeCity,
} from '../expansions';
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

export const hasEquipment = (equipmentName: CardName) => (player: IGamePlayer) =>
  player.equipments.find(card => card.name === equipmentName);

export const hasDynamite = hasEquipment('dynamite');

export const isJailed = hasEquipment('jail');

export const hasShotgun = hasEquipment('shotgun');

export const hasLemat = hasEquipment('lemat');

export const isPlayerGhost = hasEquipment('ghost');

export const hasBounty = hasEquipment('bounty');

export const hasSnake = hasEquipment('rattlesnake');

export const hasActiveSnake = (player: IGamePlayer) => {
  const snakeCard = hasSnake(player);
  return snakeCard && snakeCard.timer === 0;
};

export const hasActiveDynamite = (player: IGamePlayer) => {
  const dynamiteCard = hasDynamite(player);
  return dynamiteCard && dynamiteCard.timer === 0;
};

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
  if (ctx.phase !== 'suddenDeath') {
    const beerCardIndexes = targetPlayer.hand
      .map((card, index) => (card.name === 'beer' ? index : -1))
      .filter(index => index !== -1);

    let hpAfterBeers = targetPlayer.hp;

    for (const beerIndex of beerCardIndexes) {
      const beerCard = targetPlayer.hand.splice(beerIndex, 1)[0];

      hpAfterBeers = targetPlayer.hp + (targetPlayer.character.name === 'tequila joe' ? 2 : 1);

      if (beerCard) {
        G.discarded.push(beerCard);
      }

      if (hpAfterBeers > 0) break;
    }

    if (hpAfterBeers > 0) {
      targetPlayer.hp = hpAfterBeers;

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
    }
  }
};

export const addExpansionCards = (cards: ICard[], expansions: ExpansionName[]) => {
  const newCards = [...cards];
  if (expansions.includes('valley of shadows')) {
    newCards.push(...cards_VOS);
  }

  if (expansions.includes('dodge city')) {
    newCards.push(...cards_DodgeCity);
  }

  return newCards;
};

export const addExpansionCharacters = (characters: ICharacter[], expansions: ExpansionName[]) => {
  const newCharacters = [...characters, ...characters_DodgeCity];

  if (expansions.includes('valley of shadows')) {
    // newCharacters.push(...characters_VOS);
  }

  return newCharacters;
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
    quantity: number;
    moveToPlayAfterDiscard?: CardName | null;
    targetPlayerId?: string;
  },
  reactingPlayer: IGamePlayer,
  cardClicked: ICard,
  cardsNeeded: CardName[]
) => {
  return (
    cardsNeeded.includes(cardClicked.name) ||
    (reactingPlayer.character.name === 'calamity janet' &&
      ['bang', 'missed'].includes(cardClicked.name) &&
      cardsNeeded.some((cardName: CardName) => ['bang', 'missed'].includes(cardName))) ||
    (cardsNeeded.includes('missed') && reactingPlayer.character.name === 'elena fuente')
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

export const processGregDiggerPower = (G: IGameState) => {
  const gregDiggerIds = isCharacterInGame(G, 'greg digger');
  if (gregDiggerIds !== undefined) {
    for (const gregDiggerId of gregDiggerIds) {
      const gregDiggerPlayer = G.players[gregDiggerId];
      gregDiggerPlayer.hp = Math.min(gregDiggerPlayer.hp + 2, gregDiggerPlayer.maxHp);
    }
  }
};

export const processHerbHunterPower = (G: IGameState, ctx: Ctx) => {
  const herbHunterIds = isCharacterInGame(G, 'herb hunter');
  if (herbHunterIds !== undefined) {
    for (const herbHunterId of herbHunterIds) {
      const herbHunterPlayer = G.players[herbHunterId];
      const newCards: ICard[] = G.deck.slice(G.deck.length - 2, G.deck.length);
      G.deck = G.deck.slice(0, G.deck.length - 2);
      herbHunterPlayer.hand.push(...newCards);
      herbHunterPlayer.hand = shuffle(ctx, herbHunterPlayer.hand);
    }
  }
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

export const isAnyPlayerWithinOneRange = (G: IGameState, ctx: Ctx, playerId: string) => {
  for (const id of ctx.playOrder) {
    const player = G.players[id];
    if (playerId !== id && !isPlayerGhost(player) && player.hp > 0 && id !== ctx.currentPlayer) {
      const distance = calculateDistanceFromTarget(G.players, ctx.playOrder, playerId, id);

      if (distance <= 1) return true;
    }
  }

  return false;
};

export const getPlayerIdsNotTarget = (G: IGameState, ctx: Ctx, targetPlayerId: string) => {
  return ctx.playOrder.filter(id => id !== targetPlayerId);
};

export const getPlayersNotTargetPlayer = (G: IGameState, ctx: Ctx, targetPlayerId: string) => {
  return ctx.playOrder
    .map(id => G.players[id])
    .filter(player => player.hp > 0 && player.id !== targetPlayerId);
};

export const getPlayerWithSaved = (G: IGameState, ctx: Ctx, targetPlayerId: string) => {
  const playersNotTarget = getPlayersNotTargetPlayer(G, ctx, targetPlayerId);

  return playersNotTarget.find(card => card.name === 'saved');
};
