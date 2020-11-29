import { INVALID_MOVE } from 'boardgame.io/core';
import { Ctx, MoveMap } from 'boardgame.io';
import { gunRange, stageNames } from './constants';
import { ICard, IGameState, RobbingType } from './types';
import { isCharacterInGame, hasDynamite, getOtherPlayersAlive } from './utils';

const takeDamage = (G: IGameState, ctx: Ctx, targetPlayerId: string) => {
  if (!targetPlayerId) return INVALID_MOVE;
  const targetPlayer = G.players[targetPlayerId];
  targetPlayer.hp -= 1;
  ctx.effects.takeDamage();

  targetPlayer.barrelUseLeft = 1;
  if (targetPlayer.character.name === 'jourdonnais') {
    targetPlayer.jourdonnaisPowerUseLeft = 1;
  }

  const beerCardIndex = targetPlayer.hand.findIndex(card => card.name === 'beer');
  if (beerCardIndex !== -1 && targetPlayer.hp === 0 && ctx.phase !== 'suddenDeath') {
    const cardToPlay = targetPlayer.hand.splice(beerCardIndex, 1)[0];
    targetPlayer.cardsInPlay.push(cardToPlay);
    targetPlayer.hp = 1;

    clearCardsInPlay(G, ctx, targetPlayerId);
  }

  if (targetPlayer.hp <= 0) {
    const vultureSamId = isCharacterInGame(G, 'vulture sam');

    if (ctx.events?.endStage) {
      ctx.events.endStage();
    }

    if (ctx.activePlayers && Object.keys(ctx.activePlayers).length === 1) {
      resetGameStage(G, ctx);
    }

    if (vultureSamId && vultureSamId !== targetPlayerId) {
      const vultureSamPlayer = G.players[vultureSamId];
      if (targetPlayer.equipments.some(card => card.name === 'dynamite')) {
        G.dynamiteTimer = 1;
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
    } else {
      discardHand(G, ctx, targetPlayerId);
    }

    // if taking damage on own turn, it must be Duel. So take sourcePlayerId from the duel stage info
    // The playing causing death must be different from the target player
    let playerCausingDeathId = ctx.currentPlayer === targetPlayer.id ? null : ctx.currentPlayer;

    const playerCausingDeath = playerCausingDeathId ? G.players[playerCausingDeathId] : null;

    if (playerCausingDeathId && targetPlayer.role === 'outlaw') {
      drawBounty(G, ctx, playerCausingDeathId);
    }

    if (playerCausingDeathId && playerCausingDeath) {
      if (targetPlayer.role === 'deputy' && playerCausingDeath.role === 'sheriff') {
        discardHand(G, ctx, playerCausingDeathId);
        discardEquipments(G, ctx, playerCausingDeathId);
      }
    }
  } else {
    if (ctx.activePlayers && Object.keys(ctx.activePlayers).length === 1) {
      resetGameStage(G, ctx);
    }

    if (ctx.events?.endStage) {
      ctx.events.endStage();
    }

    clearCardsInPlay(G, ctx, targetPlayerId);

    if (targetPlayer.character.name === 'bart cassidy') {
      const cardDrawn = G.deck.pop();
      if (cardDrawn) {
        targetPlayer.hand.push(cardDrawn);
      }
    }

    if (
      targetPlayer.character.name === 'el gringo' &&
      targetPlayer.hp > 0 &&
      ctx.events?.setActivePlayers
    ) {
      if (ctx.activePlayers) {
        ctx.events.setActivePlayers({
          ...ctx.activePlayers,
          value: {
            [targetPlayerId]: stageNames.takeCardFromHand,
          },
          moveLimit: 1,
        });
      } else {
        ctx.events.setActivePlayers({
          value: {
            [targetPlayerId]: stageNames.takeCardFromHand,
          },
          moveLimit: 1,
        });
      }
      G.activeStage = stageNames.takeCardFromHand;
    }
  }

  clearCardsInPlay(G, ctx, targetPlayerId);
};

export const dynamiteExplodes = (G: IGameState, ctx: Ctx, targetPlayerId: string) => {
  if (!targetPlayerId) return INVALID_MOVE;
  ctx.effects.explosion();
  const targetPlayer = G.players[targetPlayerId];
  targetPlayer.hp -= 3;

  const dynamiteCardIndex = targetPlayer.equipments.findIndex(card => card.name === 'dynamite');
  const dynamiteCard = targetPlayer.equipments.splice(dynamiteCardIndex, 1)[0];
  if (dynamiteCard) {
    G.discarded.push(dynamiteCard);
  }

  const beerCardIndex = targetPlayer.hand.findIndex(card => card.name === 'beer');
  if (beerCardIndex !== -1 && targetPlayer.hp === 0 && ctx.phase !== 'suddenDeath') {
    playCard(G, ctx, beerCardIndex, targetPlayerId);
    targetPlayer.hp = 1;
  }

  clearCardsInPlay(G, ctx, targetPlayerId);
  G.dynamiteTimer = 1;

  if (targetPlayer.hp <= 0) {
    const vultureSamId = isCharacterInGame(G, 'vulture sam');

    if (vultureSamId && vultureSamId !== targetPlayerId) {
      const vultureSamPlayer = G.players[vultureSamId];
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
    } else {
      discardHand(G, ctx, targetPlayerId);
    }

    if (ctx.events?.endTurn) {
      ctx.events.endTurn();
    }
  } else {
    if (targetPlayer.character.name === 'bart cassidy') {
      const newCards: ICard[] = G.deck.slice(G.deck.length - 3, G.deck.length);
      G.deck = G.deck.slice(0, G.deck.length - 3);
      targetPlayer.hand.push(...newCards);
    }
  }
};

export const playCard = (G: IGameState, ctx: Ctx, cardIndex: number, targetPlayerId: string) => {
  ctx.effects.swoosh();
  const targetPlayer = G.players[targetPlayerId];
  const currentPlayer = G.players[ctx.currentPlayer];
  const cardToPlay = currentPlayer.hand.splice(cardIndex, 1)[0];
  targetPlayer.cardsInPlay.push(cardToPlay);
};

export const clearCardsInPlay = (G: IGameState, ctx: Ctx, targetPlayerId: string) => {
  const targetPlayer = G.players[targetPlayerId];

  while (targetPlayer.cardsInPlay.length > 0) {
    const discardedCard = targetPlayer.cardsInPlay.shift();
    if (discardedCard) {
      ctx.effects.swoosh();
      G.discarded.push(discardedCard);
    }
  }
};

export const jailResult = (G: IGameState, ctx: Ctx) => {
  const currentPlayer = G.players[ctx.currentPlayer];
  const isFailure = currentPlayer.cardsInPlay.every(card => card.suit !== 'hearts');
  const jailCardIndex = currentPlayer.equipments.findIndex(card => card.name === 'jail');
  const jailCard = currentPlayer.equipments.splice(jailCardIndex, 1)[0];
  G.discarded.push(jailCard);
  clearCardsInPlay(G, ctx, currentPlayer.id);

  if (isFailure && ctx.events?.endTurn) {
    ctx.events.endTurn();
  }
};

export const dynamiteResult = (G: IGameState, ctx: Ctx) => {
  const currentPlayer = G.players[ctx.currentPlayer];
  const dynamiteCardIndex = currentPlayer.equipments.findIndex(card => card.name === 'dynamite');

  const isFailure = currentPlayer.cardsInPlay.every(
    card => card.suit === 'spades' && card.value >= 2 && card.value <= 9
  );

  if (isFailure) {
    dynamiteExplodes(G, ctx, ctx.currentPlayer);
  } else {
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
  }
};

export const drawToReact = (G: IGameState, ctx: Ctx, reactingPlayerId: string) => {
  const currentPlayer = G.players[reactingPlayerId];
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

  clearCardsInPlay(G, ctx, reactingPlayerId);
  currentPlayer.cardsInPlay.push(...cards);
};

export const playCardToReact = (
  G: IGameState,
  ctx: Ctx,
  cardIndexes: number[],
  reactingPlayerId: string
) => {
  const reactingPlayer = G.players[reactingPlayerId];
  const previousActiveStage = G.activeStage;
  const previousSourcePlayerId = G.reactionRequired.sourcePlayerId;
  const onlyCardToPlayIndex = cardIndexes.length === 1 ? cardIndexes[0] : null;
  const onlyCardToPlay =
    onlyCardToPlayIndex !== null ? reactingPlayer.hand[onlyCardToPlayIndex] : null;
  cardIndexes.sort((a, b) => a - b);

  for (let i = cardIndexes.length - 1; i >= 0; i--) {
    const cardToPlay = reactingPlayer.hand.splice(cardIndexes[i], 1)[0];
    reactingPlayer.cardsInPlay.push(cardToPlay);
  }

  clearCardsInPlay(G, ctx, reactingPlayerId);

  if (ctx.events?.endStage) {
    ctx.events.endStage();

    // If you can play card to react, you passed the stage and can now be attacked again
    reactingPlayer.barrelUseLeft = 1;
    if (reactingPlayer.character.name === 'jourdonnais') {
      reactingPlayer.jourdonnaisPowerUseLeft = 1;
    }
  }

  if (ctx.activePlayers && Object.keys(ctx.activePlayers).length === 1) {
    resetGameStage(G, ctx);
  }

  if (onlyCardToPlay && onlyCardToPlay.name === 'bang' && previousActiveStage === 'duel') {
    if (previousSourcePlayerId) {
      duel(G, ctx, previousSourcePlayerId, reactingPlayerId);
      return;
    }
  }  
};

const moveToDiscard = (G: IGameState, ctx: Ctx, card: ICard) => {
  G.discarded.push(card);
};

const discardFromHand = (
  G: IGameState,
  ctx: Ctx,
  targetPlayerId: string,
  targetCardIndex: number
) => {
  const targetPlayer = G.players[targetPlayerId];
  const discardedCard = targetPlayer.hand.splice(targetCardIndex, 1)[0];
  if (!discardedCard) return INVALID_MOVE;

  moveToDiscard(G, ctx, discardedCard);
  targetPlayer.cardDiscardedThisTurn += 1;

  if (targetPlayer.cardDiscardedThisTurn === 2 && targetPlayer.character.name === 'sid ketchum') {
    targetPlayer.hp = Math.min(targetPlayer.hp + 1, targetPlayer.maxHp);
    targetPlayer.cardDiscardedThisTurn = 0;
  }
};

const equip = (G: IGameState, ctx: Ctx, cardIndex: number) => {
  ctx.effects.swoosh();
  const currentPlayer = G.players[ctx.currentPlayer];
  const equipmentCard = currentPlayer.hand.splice(cardIndex, 1)[0];

  if (equipmentCard.type !== 'equipment') return INVALID_MOVE;
  if (equipmentCard.name === 'volcanic') {
    currentPlayer.numBangsLeft = 9999;
  }

  const newGunRange = gunRange[equipmentCard.name];

  if (newGunRange) {
    ctx.effects.gunCock(equipmentCard.id);
    const previouslyEquippedGunIndex = currentPlayer.equipments.findIndex(
      equipment => gunRange[equipment.name]
    );

    if (previouslyEquippedGunIndex !== -1) {
      const previouslyEquippedGun = currentPlayer.equipments.splice(
        previouslyEquippedGunIndex,
        1
      )[0];
      moveToDiscard(G, ctx, previouslyEquippedGun);
    }

    if (equipmentCard.name === 'volcanic') {
      currentPlayer.numBangsLeft = 9999;
    } else {
      if (currentPlayer.character.name !== 'willy the kid') {
        currentPlayer.numBangsLeft = 1;
      }
    }
    currentPlayer.gunRange =
      currentPlayer.character.name === 'rose doolan' ? newGunRange + 1 : newGunRange;
  }

  currentPlayer.equipments.push(equipmentCard);

  if (equipmentCard.name === 'scope') {
    currentPlayer.actionRange += 1;
    currentPlayer.gunRange += 1;
  }

  if (equipmentCard.name === 'mustang') {
    ctx.effects.horse(equipmentCard.id);
  }

  if (equipmentCard.name === 'barrel') {
    ctx.effects.barrel();
  }
};

const jail = (G: IGameState, ctx: Ctx, targetPlayerId: string, jailCardIndex: number) => {
  const currentPlayer = G.players[ctx.currentPlayer];
  const targetPlayer = G.players[targetPlayerId];
  const jailCard = currentPlayer.hand.splice(jailCardIndex, 1)[0];
  if (jailCard.name !== 'jail') {
    currentPlayer.hand.push(jailCard);
    return INVALID_MOVE;
  }
  if (targetPlayer.role === 'sheriff') return INVALID_MOVE;

  targetPlayer.equipments.push(jailCard);
  ctx.effects.jail();
};

const drawOneFromDeck = (G: IGameState, ctx: Ctx) => {
  const currentPlayer = G.players[ctx.currentPlayer];
  const newCard = G.deck.pop();
  if (newCard) {
    currentPlayer.hand.push(newCard);
  }
  currentPlayer.cardDrawnAtStartLeft -= 1;
};

const drawTwoFromDeck = (G: IGameState, ctx: Ctx) => {
  const currentPlayer = G.players[ctx.currentPlayer];
  const newCards: ICard[] = G.deck.slice(G.deck.length - 2, G.deck.length);
  G.deck = G.deck.slice(0, G.deck.length - 2);
  currentPlayer.hand.push(...newCards);
  currentPlayer.cardDrawnAtStartLeft -= 2;
};

const drawBounty = (G: IGameState, ctx: Ctx, playerId: string) => {
  const currentPlayer = G.players[playerId];
  const newCards: ICard[] = G.deck.slice(G.deck.length - 3, G.deck.length);
  G.deck = G.deck.slice(0, G.deck.length - 3);
  currentPlayer.hand.push(...newCards);
};

const kitCarlsonDraw = (G: IGameState, ctx: Ctx) => {
  const currentPlayer = G.players[ctx.currentPlayer];
  const newCards: ICard[] = G.deck.slice(G.deck.length - 3, G.deck.length);
  G.deck = G.deck.slice(0, G.deck.length - 3);
  currentPlayer.secretCards.push(...newCards);
  currentPlayer.cardDrawnAtStartLeft -= 3;

  if (ctx.events?.setActivePlayers) {
    ctx.events.setActivePlayers({
      value: {
        [ctx.currentPlayer]: stageNames.kitCarlsonDiscard,
      },
      moveLimit: 1,
    });

    G.activeStage = stageNames.kitCarlsonDiscard;
  }
};

const kitCarlsonDiscard = (G: IGameState, ctx: Ctx, cardIndex: number) => {
  const currentPlayer = G.players[ctx.currentPlayer];
  const cardToPutBackInDeck = currentPlayer.secretCards.splice(cardIndex, 1)[0];
  if (cardToPutBackInDeck) {
    G.deck.push(cardToPutBackInDeck);
  }

  while (currentPlayer.secretCards.length > 0) {
    const card = currentPlayer.secretCards.pop();
    if (card) {
      currentPlayer.hand.push(card);
    }
  }

  if (ctx.events?.endStage) {
    ctx.events.endStage();
    resetGameStage(G, ctx);
  }
};

const drawOneFromDiscardPile = (G: IGameState, ctx: Ctx) => {
  const currentPlayer = G.players[ctx.currentPlayer];
  const newCard = G.discarded.pop();
  if (newCard) {
    currentPlayer.hand.push(newCard);
  }
  currentPlayer.cardDrawnAtStartLeft -= 1;
};

const drawFromPlayerHand = (
  G: IGameState,
  ctx: Ctx,
  sourcePlayerId: string,
  targetPlayerId: string,
  targetCardIndex: number
) => {
  const currentPlayer = G.players[sourcePlayerId];
  const targetPlayer = G.players[targetPlayerId];
  const cardToTake = targetPlayer.hand.splice(targetCardIndex, 1)[0];
  if (cardToTake) {
    currentPlayer.hand.push(cardToTake);
  }

  if (currentPlayer.character.name === 'jesse jones') {
    currentPlayer.cardDrawnAtStartLeft -= 1;
  }

  if (ctx.events?.endStage) {
    ctx.events.endStage();
  }
};

const blackJackDraw = (G: IGameState, ctx: Ctx) => {
  const currentPlayer = G.players[ctx.currentPlayer];

  let firstCard = G.deck.pop();
  if (firstCard) {
    currentPlayer.hand.push(firstCard);
  }

  let secondCard = G.deck.pop();
  if (secondCard) {
    currentPlayer.cardsInPlay.push(secondCard);
  }
  currentPlayer.cardDrawnAtStartLeft -= 2;
};

const blackJackResult = (G: IGameState, ctx: Ctx) => {
  const currentPlayer = G.players[ctx.currentPlayer];

  if (
    currentPlayer.cardsInPlay[0].suit === 'hearts' ||
    currentPlayer.cardsInPlay[0].suit === 'diamond'
  ) {
    drawOneFromDeck(G, ctx);
    currentPlayer.cardDrawnAtStartLeft -= 1;
  }

  let cardFlipped = currentPlayer.cardsInPlay.pop();
  if (cardFlipped) {
    currentPlayer.hand.push(cardFlipped);
  }
};

export const barrelResult = (
  G: IGameState,
  ctx: Ctx,
  targetPlayerId: string,
  isInnatePower: boolean
) => {
  const reactingPlayer = G.players[targetPlayerId];
  const isSuccessful = reactingPlayer.cardsInPlay.some(card => card.suit === 'hearts');

  clearCardsInPlay(G, ctx, targetPlayerId);
  if (!isInnatePower) {
    reactingPlayer.barrelUseLeft -= 1;
  } else {
    reactingPlayer.jourdonnaisPowerUseLeft -= 1;
  }

  if (isSuccessful) {
    if (
      G.activeStage &&
      G.reactionRequired.cardNeeded === 'missed' &&
      G.reactionRequired.quantity === 1
    ) {
      if (ctx.events?.endStage) {
        ctx.events.endStage();
        reactingPlayer.barrelUseLeft = 1;
        if (reactingPlayer.character.name === 'jourdonnais') {
          reactingPlayer.jourdonnaisPowerUseLeft = 1;
        }
        if (ctx.activePlayers && Object.keys(ctx.activePlayers).length === 1) {
          resetGameStage(G, ctx);
        }
      }
    } else {
      G.reactionRequired.quantity -= 1;
    }
  }
};

const bang = (G: IGameState, ctx: Ctx, targetPlayerId: string) => {
  const currentPlayer = G.players[ctx.currentPlayer];
  const bangCard = G.players[targetPlayerId].cardsInPlay[0];
  G.activeStage = stageNames.reactToBang;
  G.reactionRequired = {
    cardNeeded: 'missed',
    quantity: 1,
    sourcePlayerId: currentPlayer.id,
  };
  if (currentPlayer.character.name === 'slab the killer') {
    G.reactionRequired.quantity = 2;
  }
  ctx.effects.gunshot(bangCard.id);

  if (ctx.events?.setActivePlayers) {
    ctx.events?.setActivePlayers({
      value: {
        [targetPlayerId]: stageNames.reactToBang,
      },
    });
  }
  currentPlayer.numBangsLeft -= 1;
};

const beer = (G: IGameState, ctx: Ctx) => {
  if (ctx.phase === 'suddenDeath') {
    return INVALID_MOVE;
  }

  const currentPlayer = G.players[ctx.currentPlayer];
  const beerCard = currentPlayer.cardsInPlay[0];
  if (beerCard) {
    ctx.effects.beer(beerCard.id);
  }
  currentPlayer.hp = Math.min(currentPlayer.maxHp, currentPlayer.hp + 1);
};

const catbalou = (
  G: IGameState,
  ctx: Ctx,
  targetPlayerId: string,
  targetCardIndex: number,
  type: RobbingType
) => {
  const targetPlayer = G.players[targetPlayerId];
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
            targetPlayer.numBangsLeft = 1;
          }
        }
      }
      if (cardToDiscard.name === 'scope') {
        targetPlayer.actionRange -= 1;
        targetPlayer.gunRange -= 1;
      }
      break;
  }
  G.discarded.push(cardToDiscard);
};

const gatling = (G: IGameState, ctx: Ctx) => {
  const currentPlayer = G.players[ctx.currentPlayer];
  const gatlingCard = currentPlayer.cardsInPlay[0];
  if (gatlingCard) {
    ctx.effects.gatling(gatlingCard.id);
  }

  const activePlayers = getOtherPlayersAlive(G, ctx, stageNames.reactToGatling);

  if (ctx.events?.setActivePlayers) {
    ctx.events?.setActivePlayers({
      currentPlayer: {
        stage: stageNames.clearCardsInPlay,
        moveLimit: 1,
      },
      value: activePlayers,
    });
  }
  G.reactionRequired.cardNeeded = 'missed';
  G.activeStage = stageNames.reactToGatling;
};

const indians = (G: IGameState, ctx: Ctx) => {
  ctx.effects.indians();

  const activePlayers = getOtherPlayersAlive(G, ctx, stageNames.reactToIndians);

  if (ctx.events?.setActivePlayers) {
    ctx.events?.setActivePlayers({
      currentPlayer: {
        stage: stageNames.clearCardsInPlay,
        moveLimit: 1,
      },
      value: activePlayers,
    });
  }
  G.reactionRequired.cardNeeded = 'bang';
  G.activeStage = stageNames.reactToIndians;
};

const panic = (
  G: IGameState,
  ctx: Ctx,
  targetPlayerId: string,
  targetCardIndex: number,
  type: RobbingType
) => {
  const targetPlayer = G.players[targetPlayerId];
  const currentPlayer = G.players[ctx.currentPlayer];
  ctx.effects.panic();
  let cardToTake: ICard;
  switch (type) {
    case 'hand':
      cardToTake = targetPlayer.hand.splice(targetCardIndex, 1)[0];
      break;
    case 'equipment':
      cardToTake = targetPlayer.equipments.splice(targetCardIndex, 1)[0];
      let gunWithRange = gunRange[cardToTake.name];
      if (gunWithRange) {
        targetPlayer.gunRange = targetPlayer.character.name === 'rose doolan' ? 2 : 1;
        currentPlayer.gunRange = gunWithRange;
        if (cardToTake.name === 'volcanic') {
          if (targetPlayer.character.name !== 'willy the kid') {
            targetPlayer.numBangsLeft = 1;
          }
          currentPlayer.numBangsLeft = 9999;
        }
      }
      if (cardToTake.name === 'scope') {
        targetPlayer.actionRange -= 1;
        targetPlayer.gunRange -= 1;
        currentPlayer.actionRange += 1;
      }
      break;
  }
  currentPlayer.hand.push(cardToTake);
};

const saloon = (G: IGameState, ctx: Ctx) => {
  if (G.isSuddenDeathOn) {
    return INVALID_MOVE;
  }

  for (const playerId of ctx.playOrder) {
    const player = G.players[playerId];
    if (player.hp > 0) {
      player.hp = Math.min(player.maxHp, player.hp + 1);
    }
  }
};

const stagecoach = (G: IGameState, ctx: Ctx) => {
  const currentPlayer = G.players[ctx.currentPlayer];

  // Take 2 cards
  const newCards = G.deck.slice(0, 2);
  G.deck = G.deck.slice(2);

  if (newCards) {
    currentPlayer.hand.push(...newCards);
  }
};

const wellsfargo = (G: IGameState, ctx: Ctx) => {
  const currentPlayer = G.players[ctx.currentPlayer];

  // Take 3 cards
  const newCards = G.deck.slice(0, 3);
  G.deck = G.deck.slice(3);

  if (newCards) {
    currentPlayer.hand.push(...newCards);
  }
};

const generalstore = (G: IGameState, ctx: Ctx) => {
  // Take cards equal to the number of players alive
  const numPlayers = ctx.playOrder.reduce((count, id) => {
    const player = G.players[id];

    if (player.hp > 0) {
      return count + 1;
    }

    return count;
  }, 0);

  const newCards = G.deck.slice(0, numPlayers);
  G.deck = G.deck.slice(numPlayers);

  if (newCards) {
    G.generalStore.push(...newCards);
  }

  const activePlayers = getOtherPlayersAlive(G, ctx, stageNames.pickFromGeneralStore);

  if (ctx.events?.setActivePlayers) {
    ctx.events?.setActivePlayers({
      currentPlayer: stageNames.pickFromGeneralStore,
      value: activePlayers,
    });
  }
  G.activeStage = stageNames.pickFromGeneralStore;
};

const pickCardFromGeneralStore = (
  G: IGameState,
  ctx: Ctx,
  generalStoreCardIndex: number,
  targetPlayerId: string
) => {
  const currentPlayer = G.players[targetPlayerId];
  const selectedCard = G.generalStore.splice(generalStoreCardIndex, 1)[0];

  currentPlayer.hand.push(selectedCard);
  if (ctx.events?.endStage) {
    ctx.events.endStage();
  }
};

const duel = (G: IGameState, ctx: Ctx, targetPlayerId: string, sourcePlayerId: string) => {
  G.reactionRequired.cardNeeded = 'bang';
  G.reactionRequired.sourcePlayerId = sourcePlayerId;
  G.activeStage = stageNames.duel;

  if (ctx.events?.endStage) {
    ctx.events.endStage();
  }

  if (ctx.events?.setActivePlayers) {
    ctx.events.setActivePlayers({
      value: {
        [targetPlayerId]: stageNames.duel,
      },
      moveLimit: 1,
    });
  }
};

const resetGameStage = (G: IGameState, ctx: Ctx) => {
  G.activeStage = null;
  G.reactionRequired = {
    cardNeeded: null,
    quantity: 1,
    sourcePlayerId: null,
  };
};

const discardHand = (G: IGameState, ctx: Ctx, targetPlayerId: string) => {
  const targetPlayer = G.players[targetPlayerId ?? ctx.currentPlayer];
  while (targetPlayer.hand.length > 0) {
    const discarded = targetPlayer.hand.pop();
    if (discarded) {
      G.discarded.push(discarded);
    }
  }
};

const discardEquipments = (G: IGameState, ctx: Ctx, targetPlayerId: string) => {
  const targetPlayer = G.players[targetPlayerId ?? ctx.currentPlayer];
  while (targetPlayer.equipments.length > 0) {
    const discarded = targetPlayer.equipments.pop();
    if (discarded) {
      G.discarded.push(discarded);
    }
  }
};

export const doNothing = (G: IGameState, ctx: Ctx) => {
  return G;
};

export const endTurn = (G: IGameState, ctx: Ctx) => {
  const currentPlayer = G.players[ctx.currentPlayer];
  if (G.dynamiteTimer > 0 && hasDynamite(currentPlayer)) {
    G.dynamiteTimer = 0;
  }

  if (ctx.events?.endTurn) {
    ctx.events.endTurn();
  }
};

const moves: MoveMap<IGameState> = {
  takeDamage,
  drawOneFromDeck,
  drawTwoFromDeck,
  barrelResult,
  drawFromPlayerHand,
  discardFromHand,
  clearCardsInPlay,
  playCard,
  playCardToReact,
  equip,
  jail,
  bang,
  beer,
  catbalou,
  gatling,
  indians,
  panic,
  saloon,
  stagecoach,
  wellsfargo,
  duel,
  generalstore,
  pickCardFromGeneralStore,
  dynamiteResult,
  jailResult,
  dynamiteExplodes,
  drawOneFromDiscardPile,
  blackJackDraw,
  blackJackResult,
  discardHand,
  kitCarlsonDraw,
  kitCarlsonDiscard,
  drawToReact,
  drawBounty,
  discardEquipments,
  endTurn,
};

export default moves;
