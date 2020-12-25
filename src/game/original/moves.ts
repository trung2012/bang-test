import { INVALID_MOVE } from 'boardgame.io/core';
import { Ctx, MoveMap } from 'boardgame.io';
import { cardsThatWorkAgainstBang, gunRange, stageNames } from './constants';
import { CardName, ICard, IGameState, RobbingType } from './types';
import {
  isCharacterInGame,
  getOtherPlayersAliveStages,
  getOtherPlayersAlive,
  shuffle,
  processCardRemoval,
  checkIfBeersCanSave,
  hasDynamite,
  checkIfCanDrawOneAfterReacting,
  resetCardTimer,
  mollyStarkDraw,
  processOneVultureSamPower,
  processMultipleVultureSamPower,
  isJailed,
  setVeraCusterStage,
} from './utils';
import { SelectedCards } from '../../context';
import { cardsActivatingMollyStarkPower } from '../expansions';

const takeDamage = (G: IGameState, ctx: Ctx, targetPlayerId: string) => {
  if (!targetPlayerId) return INVALID_MOVE;
  const targetPlayer = G.players[targetPlayerId];
  targetPlayer.hp -= 1;
  ctx.effects.takeDamage();

  targetPlayer.barrelUseLeft = 1;
  if (targetPlayer.character.name === 'jourdonnais') {
    targetPlayer.jourdonnaisPowerUseLeft = 1;
  }

  if (targetPlayer.hp <= 0 && ctx.phase !== 'suddenDeath') {
    checkIfBeersCanSave(G, ctx, targetPlayer);
  }

  if (targetPlayer.hp <= 0) {
    if (ctx.events?.endStage) {
      ctx.events.endStage();
    }

    if (ctx.activePlayers && Object.keys(ctx.activePlayers).length === 1) {
      resetGameStage(G, ctx);
    }

    const gregDiggerIds = isCharacterInGame(G, 'greg digger');
    if (gregDiggerIds !== undefined) {
      for (const gregDiggerId of gregDiggerIds) {
        const gregDiggerPlayer = G.players[gregDiggerId];
        gregDiggerPlayer.hp = Math.min(gregDiggerPlayer.hp + 2, gregDiggerPlayer.maxHp);
      }
    }

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

    const vultureSamIds = isCharacterInGame(G, 'vulture sam');
    if (vultureSamIds !== undefined) {
      if (vultureSamIds.length === 1) {
        processOneVultureSamPower(G, targetPlayer, vultureSamIds[0]);
      } else {
        processMultipleVultureSamPower(G, targetPlayer, vultureSamIds);
      }
    } else {
      discardHand(G, ctx, targetPlayerId);
      discardEquipments(G, ctx, targetPlayerId);
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
    if (ctx.events?.endStage) {
      ctx.events.endStage();
    }

    if (ctx.activePlayers && Object.keys(ctx.activePlayers).length === 1) {
      const sourcePlayer = G.reactionRequired.sourcePlayerId
        ? G.players[G.reactionRequired.sourcePlayerId]
        : null;
      if (G.activeStage === stageNames.duel && sourcePlayer) {
        if (
          targetPlayer.character.name === 'molly stark' &&
          targetPlayer.mollyStarkCardsPlayed > 0
        ) {
          mollyStarkDraw(G, ctx, targetPlayer);
        } else if (
          sourcePlayer.character.name === 'molly stark' &&
          sourcePlayer.mollyStarkCardsPlayed > 0
        ) {
          mollyStarkDraw(G, ctx, sourcePlayer);
        }
      }

      resetGameStage(G, ctx);
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
          value: {
            ...ctx.activePlayers,
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
  ctx.effects.explosion(targetPlayerId);
  const targetPlayer = G.players[targetPlayerId];
  targetPlayer.hp -= 3;

  const dynamiteCardIndex = targetPlayer.equipments.findIndex(card => card.name === 'dynamite');
  if (dynamiteCardIndex !== -1) {
    const dynamiteCard = targetPlayer.equipments.splice(dynamiteCardIndex, 1)[0];
    dynamiteCard.timer = 1;
    G.discarded.push(dynamiteCard);
  }

  clearCardsInPlay(G, ctx, targetPlayerId);

  if (targetPlayer.hp <= 0) {
    checkIfBeersCanSave(G, ctx, targetPlayer);

    const vultureSamIds = isCharacterInGame(G, 'vulture sam');
    if (vultureSamIds !== undefined) {
      if (vultureSamIds.length === 1) {
        processOneVultureSamPower(G, targetPlayer, vultureSamIds[0]);
      } else {
        processMultipleVultureSamPower(G, targetPlayer, vultureSamIds);
      }
    } else {
      discardHand(G, ctx, targetPlayerId);
      discardEquipments(G, ctx, targetPlayerId);
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

    if (targetPlayer.character.realName && !isJailed(targetPlayer)) {
      setVeraCusterStage(ctx);
    }
  }
};

export const playCard = (
  G: IGameState,
  ctx: Ctx,
  cardIndex: number,
  targetPlayerId: string,
  cardLocation: RobbingType
) => {
  ctx.effects.swoosh();
  const targetPlayer = G.players[targetPlayerId];
  const currentPlayer = G.players[ctx.currentPlayer];
  let cardToPlay = currentPlayer.hand.splice(cardIndex, 1)[0];

  switch (cardLocation) {
    case 'green': {
      cardToPlay = currentPlayer.equipmentsGreen.splice(cardIndex, 1)[0];
      break;
    }
  }

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

  ctx.effects.clearJail(isFailure);

  if (!isFailure && currentPlayer.character.realName === 'vera custer') {
    if (ctx.events?.setActivePlayers) {
      ctx.events.setActivePlayers({
        currentPlayer: stageNames.copyCharacter,
        moveLimit: 1,
      });
    }
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
    const otherPlayersAlive = getOtherPlayersAlive(G, ctx);
    if (
      otherPlayersAlive.length === 1 &&
      nextPlayer.equipments.some(card => card.name === 'dynamite')
    ) {
      // do nothing
    } else {
      const dynamiteCard = currentPlayer.equipments.splice(dynamiteCardIndex, 1)[0];
      nextPlayer.equipments.push(dynamiteCard);
      while (currentPlayer.cardsInPlay.length > 0) {
        const discardedCard = currentPlayer.cardsInPlay.shift();
        if (discardedCard) {
          G.discarded.push(discardedCard);
        }
      }
    }

    if (currentPlayer.character.realName && !isJailed(currentPlayer)) {
      setVeraCusterStage(ctx);
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
  selectedCards: SelectedCards,
  reactingPlayerId: string
) => {
  const reactingPlayer = G.players[reactingPlayerId];
  const previousActiveStage = G.activeStage;
  const previousSourcePlayerId = G.reactionRequired.sourcePlayerId;
  const handCardIndexes = selectedCards.hand;
  const greenCardIndexes = selectedCards.green;
  const onlyHandCardToPlayIndex =
    selectedCards.hand.length === 1 && selectedCards.green.length === 0
      ? selectedCards.hand[0]
      : null;
  const onlyHandCardToPlay =
    onlyHandCardToPlayIndex !== null ? reactingPlayer.hand[onlyHandCardToPlayIndex] : null;

  handCardIndexes.sort((a, b) => a - b);
  greenCardIndexes.sort((a, b) => a - b);

  for (let i = handCardIndexes.length - 1; i >= 0; i--) {
    const cardToPlay = reactingPlayer.hand.splice(handCardIndexes[i], 1)[0];
    if (
      reactingPlayer.character.name === 'molly stark' &&
      cardsActivatingMollyStarkPower.includes(cardToPlay.name)
    ) {
      reactingPlayer.mollyStarkCardsPlayed += 1;
    }
    reactingPlayer.cardsInPlay.push(cardToPlay);
    checkIfCanDrawOneAfterReacting(G, reactingPlayer, cardToPlay);
  }

  for (let i = greenCardIndexes.length - 1; i >= 0; i--) {
    const cardToPlay = reactingPlayer.equipmentsGreen.splice(greenCardIndexes[i], 1)[0];

    reactingPlayer.cardsInPlay.push(cardToPlay);
    checkIfCanDrawOneAfterReacting(G, reactingPlayer, cardToPlay);
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

  if (G.reactionRequired.cardNeeded.includes('missed')) {
    ctx.effects.missed();
  }

  if (ctx.activePlayers && Object.keys(ctx.activePlayers).length === 1) {
    resetGameStage(G, ctx);
  }

  if (
    onlyHandCardToPlay !== null &&
    onlyHandCardToPlay.name === 'bang' &&
    previousActiveStage === stageNames.duel
  ) {
    if (previousSourcePlayerId) {
      duel(G, ctx, previousSourcePlayerId, reactingPlayerId);
    }
  }

  if (
    previousActiveStage !== stageNames.duel &&
    reactingPlayer.character.name === 'molly stark' &&
    reactingPlayer.mollyStarkCardsPlayed > 0
  ) {
    mollyStarkDraw(G, ctx, reactingPlayer);
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
  if (!G.reactionRequired.cardToPlayAfterDiscard) {
    targetPlayer.cardDiscardedThisTurn += 1;
  }

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

      if (
        previouslyEquippedGun.name === 'volcanic' &&
        currentPlayer.character.name !== 'willy the kid'
      ) {
        currentPlayer.numBangsLeft = 1;
      }
    }

    if (equipmentCard.name === 'volcanic') {
      currentPlayer.numBangsLeft = 9999;
    }

    currentPlayer.gunRange = newGunRange;
  }

  currentPlayer.equipments.push(equipmentCard);

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
  currentPlayer.hand = shuffle(ctx, currentPlayer.hand);
};

const drawTwoFromDeck = (G: IGameState, ctx: Ctx) => {
  const currentPlayer = G.players[ctx.currentPlayer];
  const newCards: ICard[] = G.deck.slice(G.deck.length - 2, G.deck.length);
  G.deck = G.deck.slice(0, G.deck.length - 2);
  currentPlayer.hand.push(...newCards);
  currentPlayer.cardDrawnAtStartLeft -= 2;
  currentPlayer.hand = shuffle(ctx, currentPlayer.hand);
};

const drawThreeFromDeck = (G: IGameState, ctx: Ctx) => {
  const currentPlayer = G.players[ctx.currentPlayer];
  const newCards: ICard[] = G.deck.slice(G.deck.length - 3, G.deck.length);
  G.deck = G.deck.slice(0, G.deck.length - 3);
  currentPlayer.hand.push(...newCards);
  currentPlayer.cardDrawnAtStartLeft = 0;
  currentPlayer.hand = shuffle(ctx, currentPlayer.hand);
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
  currentPlayer.cardDrawnAtStartLeft -= 2;

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

  currentPlayer.hand = shuffle(ctx, currentPlayer.hand);

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

  if (ctx.activePlayers && Object.keys(ctx.activePlayers).length === 1) {
    resetGameStage(G, ctx);
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
  }

  let cardFlipped = currentPlayer.cardsInPlay.pop();
  if (cardFlipped) {
    currentPlayer.hand.push(cardFlipped);
  }

  currentPlayer.hand = shuffle(ctx, currentPlayer.hand);
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
  if (isInnatePower) {
    reactingPlayer.jourdonnaisPowerUseLeft -= 1;
  } else {
    reactingPlayer.barrelUseLeft -= 1;
  }

  if (isSuccessful) {
    if (
      G.activeStage &&
      G.reactionRequired.cardNeeded.includes('missed') &&
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

    ctx.effects.missed();
  }
};

const bang = (G: IGameState, ctx: Ctx, targetPlayerId: string) => {
  const currentPlayer = G.players[ctx.currentPlayer];
  const bangCard = G.players[targetPlayerId].cardsInPlay[0];
  G.activeStage = stageNames.reactToBang;
  G.reactionRequired = {
    cardNeeded: cardsThatWorkAgainstBang,
    quantity: 1,
    sourcePlayerId: currentPlayer.id,
  };
  if (currentPlayer.character.name === 'slab the killer' && bangCard.name === 'bang') {
    G.reactionRequired.quantity = 2;
  }

  switch (bangCard.name) {
    case 'punch': {
      ctx.effects.punch(bangCard.id);
      break;
    }
    default: {
      ctx.effects.gunshot(bangCard.id);
      break;
    }
  }

  if (ctx.events?.setActivePlayers) {
    ctx.events?.setActivePlayers({
      value: {
        [targetPlayerId]: stageNames.reactToBang,
      },
    });
  }

  if (bangCard.name === 'bang') {
    currentPlayer.numBangsLeft -= 1;
  }

  checkIfCanDrawOneAfterReacting(G, currentPlayer, bangCard);
};

const beer = (G: IGameState, ctx: Ctx) => {
  const currentPlayer = G.players[ctx.currentPlayer];
  const beerCard = currentPlayer.cardsInPlay[0];

  if (ctx.phase !== 'suddenDeath') {
    if (beerCard) {
      ctx.effects.beer(beerCard.id);
    }
    currentPlayer.hp = Math.min(currentPlayer.maxHp, currentPlayer.hp + 1);
    if (currentPlayer.character.name === 'tequila joe') {
      currentPlayer.hp = Math.min(currentPlayer.maxHp, currentPlayer.hp + 1);
    }
  }
};

const catbalou = (
  G: IGameState,
  ctx: Ctx,
  targetPlayerId: string,
  targetCardIndex: number,
  type: RobbingType
) => {
  const targetPlayer = G.players[targetPlayerId];
  const cardToDiscard = processCardRemoval(targetPlayer, targetCardIndex, type);
  resetCardTimer(cardToDiscard);

  G.discarded.push(cardToDiscard);
};

const gatling = (G: IGameState, ctx: Ctx) => {
  const currentPlayer = G.players[ctx.currentPlayer];
  const gatlingCard = currentPlayer.cardsInPlay[0];
  if (gatlingCard) {
    ctx.effects.gatling(gatlingCard.id);
  }

  const activePlayers = getOtherPlayersAliveStages(G, ctx, stageNames.reactToGatling);

  if (ctx.events?.setActivePlayers) {
    ctx.events?.setActivePlayers({
      currentPlayer: {
        stage: stageNames.play,
        moveLimit: 1,
      },
      value: activePlayers,
    });
  }
  G.reactionRequired.cardNeeded = cardsThatWorkAgainstBang;
  G.activeStage = stageNames.reactToGatling;
};

const indians = (G: IGameState, ctx: Ctx) => {
  ctx.effects.indians();

  const activePlayers = getOtherPlayersAliveStages(G, ctx, stageNames.reactToIndians);

  if (ctx.events?.setActivePlayers) {
    ctx.events?.setActivePlayers({
      currentPlayer: {
        stage: stageNames.play,
        moveLimit: 1,
      },
      value: activePlayers,
    });
  }
  G.reactionRequired.cardNeeded = ['bang'];
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

  const cardToTake = processCardRemoval(targetPlayer, targetCardIndex, type);
  resetCardTimer(cardToTake);
  currentPlayer.hand.push(cardToTake);
  currentPlayer.hand = shuffle(ctx, currentPlayer.hand);

  if (ctx.events?.endStage) {
    ctx.events.endStage();
  }
};

const saloon = (G: IGameState, ctx: Ctx) => {
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
  const newCards: ICard[] = G.deck.slice(G.deck.length - 2, G.deck.length);
  G.deck = G.deck.slice(0, G.deck.length - 2);

  if (newCards) {
    currentPlayer.hand.push(...newCards);
  }
};

const wellsfargo = (G: IGameState, ctx: Ctx) => {
  const currentPlayer = G.players[ctx.currentPlayer];

  // Take 3 cards
  const newCards: ICard[] = G.deck.slice(G.deck.length - 3, G.deck.length);
  G.deck = G.deck.slice(0, G.deck.length - 3);

  if (newCards) {
    currentPlayer.hand.push(...newCards);
  }
};

const generalstore = (G: IGameState, ctx: Ctx) => {
  // Take cards equal to the number of players alive
  const otherPlayersAlive = getOtherPlayersAlive(G, ctx);
  const numGeneralStoreCards = otherPlayersAlive.length + 1;

  const newCards = G.deck.slice(0, numGeneralStoreCards);
  G.deck = G.deck.slice(numGeneralStoreCards);

  if (newCards) {
    G.generalStore.push(...newCards);
  }

  const activePlayers = getOtherPlayersAliveStages(G, ctx, stageNames.pickFromGeneralStore);

  if (ctx.events?.setActivePlayers) {
    ctx.events?.setActivePlayers({
      currentPlayer: stageNames.pickFromGeneralStore,
      value: activePlayers,
    });
  }
  G.activeStage = stageNames.pickFromGeneralStore;

  // Order to pick from general store starting from the current player
  G.generalStoreOrder = [
    ...ctx.playOrder.slice(ctx.playOrderPos),
    ...ctx.playOrder.slice(0, ctx.playOrderPos),
  ].filter(playerId => G.players[playerId].hp > 0);
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
  currentPlayer.hand = shuffle(ctx, currentPlayer.hand);

  if (ctx.events?.endStage) {
    ctx.events.endStage();
    G.generalStoreOrder.shift();
  }

  if (ctx.activePlayers && Object.keys(ctx.activePlayers).length === 1) {
    resetGameStage(G, ctx);
  }
};

const duel = (G: IGameState, ctx: Ctx, targetPlayerId: string, sourcePlayerId: string) => {
  G.reactionRequired.cardNeeded = ['bang'];
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
    cardNeeded: [],
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

  const dynamiteCard = hasDynamite(currentPlayer);
  if (dynamiteCard) {
    dynamiteCard.timer = 0;
  }

  if (ctx.phase === 'reselectCharacter' && currentPlayer.hand.length === 0) {
    initialCardDeal(G, ctx);
  }

  if (currentPlayer.equipmentsGreen.length > 0) {
    currentPlayer.equipmentsGreen.forEach(card => {
      card.timer = 0;
    });
  }

  if (ctx.events?.endTurn) {
    ctx.events.endTurn();
  }

  if (currentPlayer.character.name === 'jose delgado') {
    currentPlayer.character.activePowerUsesLeft = 2;
  }
};

export const makePlayerDiscard = (G: IGameState, ctx: Ctx, numCardsToDiscard: number) => {
  if (ctx.events?.setActivePlayers) {
    ctx.events.setActivePlayers({
      currentPlayer: stageNames.discard,
      moveLimit: numCardsToDiscard,
    });
  }
};

export const initialCardDeal = (G: IGameState, ctx: Ctx) => {
  let currentPlayer = G.players[ctx.currentPlayer];
  for (let hp = 1; hp <= currentPlayer.hp; hp++) {
    const card = G.deck.pop();
    if (card) {
      currentPlayer.hand.push(card);
    }
  }
};

export const copyCharacter = (G: IGameState, ctx: Ctx, targetPlayerId: string) => {
  const currentPlayer = G.players[ctx.currentPlayer];
  const targetPlayer = G.players[targetPlayerId];

  if (currentPlayer.character.realName) {
    currentPlayer.originalCharacter = currentPlayer.character;

    currentPlayer.character = {
      ...targetPlayer.character,
      realName: currentPlayer.character.realName,
    };
  }

  if (targetPlayer.character.name === 'willy the kid') {
    currentPlayer.numBangsLeft = 9999;
  }

  if (targetPlayer.character.name === 'jourdonnais') {
    currentPlayer.jourdonnaisPowerUseLeft = 1;
  }
};

export const reselectCharacter = (G: IGameState, ctx: Ctx) => {
  let currentPlayer = G.players[ctx.currentPlayer];
  const randomIndex = Math.floor(Math.random() * G.characters.length);
  const newCharacter = G.characters.splice(randomIndex, 1)[0];

  if (newCharacter) {
    const newPlayer = {
      ...currentPlayer,
      character: newCharacter,
      gunRange: 1,
      actionRange: 1,
      numBangsLeft: newCharacter.name === 'willy the kid' ? 9999 : 1,
      jourdonnaisPowerUseLeft: newCharacter.name === 'jourdonnais' ? 1 : 0,
      hp: currentPlayer.role === 'sheriff' ? newCharacter.hp + 1 : newCharacter.hp,
      maxHp: currentPlayer.role === 'sheriff' ? newCharacter.hp + 1 : newCharacter.hp,
    };

    G.players[ctx.currentPlayer] = newPlayer;

    initialCardDeal(G, ctx);
  }
};

export const equipOtherPlayer = (
  G: IGameState,
  ctx: Ctx,
  targetPlayerId: string,
  equipmentIndex: number
) => {
  const currentPlayer = G.players[ctx.currentPlayer];
  const targetPlayer = G.players[targetPlayerId];
  const equipmentCard = currentPlayer.hand.splice(equipmentIndex, 1)[0];
  targetPlayer.equipments.push(equipmentCard);

  //TODO: equipment effects
};

export const equipGreenCard = (G: IGameState, ctx: Ctx, cardIndex: number) => {
  ctx.effects.swoosh();
  const currentPlayer = G.players[ctx.currentPlayer];
  const equipmentGreenCard = currentPlayer.hand.splice(cardIndex, 1)[0];
  currentPlayer.equipmentsGreen.push(equipmentGreenCard);
};

export const resetDiscardStage = (G: IGameState, ctx: Ctx) => {
  G.reactionRequired.cardToPlayAfterDiscard = null;
  G.reactionRequired.targetPlayerId = undefined;
};

export const makePlayerDiscardToPlay = (
  G: IGameState,
  ctx: Ctx,
  cardName: CardName,
  targetPlayerId?: string
) => {
  if (ctx.events?.setActivePlayers) {
    ctx.events.setActivePlayers({
      currentPlayer: stageNames.discardToPlayCard,
      moveLimit: 1,
    });
  }

  G.reactionRequired.cardToPlayAfterDiscard = cardName;
  G.reactionRequired.targetPlayerId = targetPlayerId;
};

export const ragtime = (G: IGameState, ctx: Ctx) => {
  if (ctx.events?.setActivePlayers) {
    ctx.events.setActivePlayers({
      currentPlayer: stageNames.ragtime,
    });
  }

  resetDiscardStage(G, ctx);
  clearCardsInPlay(G, ctx, ctx.currentPlayer);
};

export const springfield = (G: IGameState, ctx: Ctx, targetPlayerId: string) => {
  bang(G, ctx, targetPlayerId);

  resetDiscardStage(G, ctx);
  clearCardsInPlay(G, ctx, targetPlayerId);
};

export const tequila = (G: IGameState, ctx: Ctx, targetPlayerId: string) => {
  const targetPlayer = G.players[targetPlayerId];
  targetPlayer.hp = Math.min(targetPlayer.maxHp, targetPlayer.hp + 1);

  resetDiscardStage(G, ctx);
  clearCardsInPlay(G, ctx, targetPlayerId);
};

export const whisky = (G: IGameState, ctx: Ctx) => {
  const currentPlayer = G.players[ctx.currentPlayer];

  currentPlayer.hp = Math.min(currentPlayer.maxHp, currentPlayer.hp + 2);
  resetDiscardStage(G, ctx);
  clearCardsInPlay(G, ctx, ctx.currentPlayer);
};

export const brawl = (G: IGameState, ctx: Ctx) => {
  const otherPlayersStages = getOtherPlayersAliveStages(G, ctx, stageNames.discardToPlayCard);

  if (ctx.events?.setActivePlayers) {
    ctx.events.setActivePlayers({
      value: {
        ...otherPlayersStages,
      },
      moveLimit: 1,
    });
  }

  resetDiscardStage(G, ctx);
  clearCardsInPlay(G, ctx, ctx.currentPlayer);
};

export const cancan = (
  G: IGameState,
  ctx: Ctx,
  targetPlayerId: string,
  targetCardIndex: number,
  type: RobbingType
) => {
  catbalou(G, ctx, targetPlayerId, targetCardIndex, type);
};

export const conestoga = (
  G: IGameState,
  ctx: Ctx,
  targetPlayerId: string,
  targetCardIndex: number,
  type: RobbingType
) => {
  panic(G, ctx, targetPlayerId, targetCardIndex, type);
};

export const howitzer = (G: IGameState, ctx: Ctx) => {
  gatling(G, ctx);
};

export const ponyexpress = (G: IGameState, ctx: Ctx) => {
  wellsfargo(G, ctx);
};

export const canteen = (G: IGameState, ctx: Ctx) => {
  const currentPlayer = G.players[ctx.currentPlayer];
  const canteenCard = currentPlayer.cardsInPlay[0];

  ctx.effects.beer(canteenCard.id);
  currentPlayer.hp = Math.min(currentPlayer.maxHp, currentPlayer.hp + 1);
};

export const billNoFaceDraw = (G: IGameState, ctx: Ctx) => {
  const currentPlayer = G.players[ctx.currentPlayer];
  drawOneFromDeck(G, ctx);
  const lostHp = currentPlayer.maxHp - currentPlayer.hp;

  if (currentPlayer.character.name === 'bill noface') {
    const newCards: ICard[] = G.deck.slice(G.deck.length - lostHp, G.deck.length);
    G.deck = G.deck.slice(0, G.deck.length - lostHp);
    currentPlayer.hand.push(...newCards);
    currentPlayer.hand = shuffle(ctx, currentPlayer.hand);
  }

  currentPlayer.cardDrawnAtStartLeft = 0;
};

export const chuckWengamPower = (G: IGameState, ctx: Ctx) => {
  const currentPlayer = G.players[ctx.currentPlayer];
  currentPlayer.hp -= 1;
  drawTwoFromDeck(G, ctx);
};

export const docHolyDayPower = (G: IGameState, ctx: Ctx) => {
  if (ctx.events?.setActivePlayers) {
    ctx.events.setActivePlayers({
      currentPlayer: stageNames.discardToPlayCard,
      moveLimit: 1,
    });
  }
};

export const patBrennanEquipmentDraw = (
  G: IGameState,
  ctx: Ctx,
  targetPlayerId: string,
  targetCardIndex: number,
  type: RobbingType
) => {
  const targetPlayer = G.players[targetPlayerId];
  const currentPlayer = G.players[ctx.currentPlayer];

  const cardToTake = processCardRemoval(targetPlayer, targetCardIndex, type);
  resetCardTimer(cardToTake);
  currentPlayer.hand.push(cardToTake);
  currentPlayer.hand = shuffle(ctx, currentPlayer.hand);
  currentPlayer.cardDrawnAtStartLeft = 0;
};

export const joseDelgadoPower = (G: IGameState, ctx: Ctx) => {
  const currentPlayer = G.players[ctx.currentPlayer];

  if (ctx.events?.setActivePlayers) {
    ctx.events.setActivePlayers({
      currentPlayer: stageNames.discardToPlayCard,
      moveLimit: 1,
    });
  }

  G.reactionRequired.cardToPlayAfterDiscard = 'josedelgadodraw' as CardName;
  G.reactionRequired.targetPlayerId = ctx.currentPlayer;

  if (currentPlayer.character.activePowerUsesLeft !== undefined) {
    currentPlayer.character.activePowerUsesLeft -= 1;
  }
};

export const josedelgadodraw = (G: IGameState, ctx: Ctx) => {
  drawTwoFromDeck(G, ctx);
};

export const moves_DodgeCity: MoveMap<IGameState> = {
  equipGreenCard,
  ragtime,
  springfield,
  tequila,
  whisky,
  brawl,
  makePlayerDiscardToPlay,
  resetDiscardStage,
  cancan,
  howitzer,
  ponyexpress,
  canteen,
  conestoga,
  billNoFaceDraw,
  chuckWengamPower,
  docHolyDayPower,
  patBrennanEquipmentDraw,
  joseDelgadoPower,
  josedelgadodraw,
  copyCharacter,
};

export const moves_VOS: MoveMap<IGameState> = {};

export const moves: MoveMap<IGameState> = {
  takeDamage,
  drawOneFromDeck,
  drawTwoFromDeck,
  drawThreeFromDeck,
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
  makePlayerDiscard,
  endTurn,
  reselectCharacter,
};

const allMoves = {
  ...moves,
  ...moves_DodgeCity,
  ...moves_VOS,
};

export default allMoves;
