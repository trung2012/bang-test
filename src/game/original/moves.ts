import { INVALID_MOVE } from 'boardgame.io/core';
import { ActivePlayersArg, Ctx, MoveMap } from 'boardgame.io';
import { gunRange, stageNames, stageNameToRequiredCardsMap } from './constants';
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
  getNextPlayerToPassEquipments,
  processGregDiggerPower,
  processHerbHunterPower,
  hasBounty,
  hasShotgun,
  isAnyPlayerWithinOneRange,
  isPlayerGhost,
  hasSnake,
  hasActiveSnake,
  hasLemat,
  getPlayerIdsNotTarget,
} from './utils';
import { SelectedCards } from '../../context';
import { cardsActivatingMollyStarkPower } from '../expansions';

const takeDamage = (G: IGameState, ctx: Ctx, targetPlayerId: string) => {
  if (!targetPlayerId) return INVALID_MOVE;
  const targetPlayer = G.players[targetPlayerId];

  if (isPlayerGhost(targetPlayer)) {
    endStage(G, ctx);
    return G;
  }

  const currentPlayer = G.players[ctx.currentPlayer];
  const doesCurrentPlayerHasShotgun = hasShotgun(currentPlayer);
  const cardCausingDamage = targetPlayer.cardsInPlay[0];
  const targetPlayerStage = (ctx.activePlayers
    ? ctx.activePlayers[targetPlayerId]
    : 'none') as stageNames;

  ctx.effects.takeDamage();
  targetPlayer.hp -= 1;

  if (targetPlayer.cardsInPlay.some(card => card.name === 'aim')) {
    targetPlayer.hp -= 1;
  }

  if (
    targetPlayerId !== ctx.currentPlayer &&
    targetPlayerStage === stageNames.reactToBang &&
    cardCausingDamage &&
    cardCausingDamage.name === 'bang'
  ) {
    if (hasBounty(targetPlayer)) {
      drawOneFromDeck(G, ctx); // Only current player can draw
    }

    if (doesCurrentPlayerHasShotgun) {
      if (targetPlayer.hand.length === 1) {
        const discardedCard = targetPlayer.hand.pop();
        if (discardedCard) {
          moveToDiscard(G, ctx, discardedCard);
        }
      } else {
        if (ctx.events?.setActivePlayers) {
          ctx.events.setActivePlayers({
            value: {
              ...(ctx.activePlayers || {}),
              [targetPlayerId]: stageNames.discardToPlayCard,
            },
            moveLimit: 1,
          });
        }
      }
    }
  } else {
    endStage(G, ctx);
  }

  targetPlayer.barrelUseLeft = 1;
  if (targetPlayer.character.name === 'jourdonnais') {
    targetPlayer.jourdonnaisPowerUseLeft = 1;
  }

  if (targetPlayer.hp <= 0 && ctx.phase !== 'suddenDeath') {
    checkIfBeersCanSave(G, ctx, targetPlayer);
  }

  if (targetPlayer.hp <= 0) {
    endStage(G, ctx);

    if (ctx.activePlayers && Object.keys(ctx.activePlayers).length === 1) {
      resetGameStage(G, ctx);
    }

    processGregDiggerPower(G);

    processHerbHunterPower(G, ctx);

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
    if (!doesCurrentPlayerHasShotgun || targetPlayer.hand.length === 0) {
      endStage(G, ctx);
    }

    if (ctx.activePlayers && Object.keys(ctx.activePlayers).length === 1) {
      const sourcePlayer = G.reactionRequired.sourcePlayerId
        ? G.players[G.reactionRequired.sourcePlayerId]
        : null;

      if (targetPlayerStage === stageNames.duel && sourcePlayer) {
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
      currentPlayer.hand.length > 0
    ) {
      if (ctx.random?.Shuffle) {
        ctx.random?.Shuffle(targetPlayer.hand);
      }
      const cardToDrawFromHand = currentPlayer.hand.pop();
      if (cardToDrawFromHand) {
        targetPlayer.hand.push(cardToDrawFromHand);
      }
    }
  }

  clearCardsInPlay(G, ctx, targetPlayerId);
};

export const setActivePlayersStage = (
  G: IGameState,
  ctx: Ctx,
  activePlayersValue: { [key: string]: string },
  moveLimit?: number
) => {
  const activePlayersObject: ActivePlayersArg = {
    value: activePlayersValue,
  };

  if (moveLimit !== undefined) {
    activePlayersObject.moveLimit = moveLimit;
  }

  if (ctx.events?.setActivePlayers) {
    ctx.events.setActivePlayers({
      ...activePlayersObject,
      value: {
        ...(ctx.activePlayers || {}),
        ...activePlayersObject.value,
      },
    });
  }
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
  }

  if (targetPlayer.hp <= 0) {
    processGregDiggerPower(G);

    processHerbHunterPower(G, ctx);

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

    if (
      targetPlayer.character.realName &&
      !isJailed(targetPlayer) &&
      !hasActiveSnake(targetPlayer)
    ) {
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
    const nextPlayerId = getNextPlayerToPassEquipments(G, ctx);
    const nextPlayer = G.players[nextPlayerId];
    const nextPlayerDynamiteCard = hasDynamite(nextPlayer);
    const currentPlayerDynamiteCard = currentPlayer.equipments[dynamiteCardIndex];
    if (nextPlayerDynamiteCard) {
      currentPlayerDynamiteCard.timer = 1;
    } else {
      const dynamiteCardToPass = currentPlayer.equipments.splice(dynamiteCardIndex, 1)[0];
      if (dynamiteCardToPass) {
        nextPlayer.equipments.push(dynamiteCardToPass);
      }
    }

    clearCardsInPlay(G, ctx, ctx.currentPlayer);

    if (
      currentPlayer.character.realName &&
      !isJailed(currentPlayer) &&
      !hasActiveSnake(currentPlayer)
    ) {
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
  const previousActiveStage = ctx.activePlayers ? ctx.activePlayers[reactingPlayerId] : null;
  const previousSourcePlayerId = G.reactionRequired.sourcePlayerId;
  const handCardIndexes = selectedCards.hand;
  const greenCardIndexes = selectedCards.green;
  const onlyHandCardToPlayIndex =
    selectedCards.hand.length === 1 && selectedCards.green.length === 0
      ? selectedCards.hand[0]
      : null;
  const onlyHandCardToPlay =
    onlyHandCardToPlayIndex !== null ? reactingPlayer.hand[onlyHandCardToPlayIndex] : null;
  const stageName = ctx.activePlayers ? (ctx.activePlayers[reactingPlayerId] as stageNames) : null;
  const cardsNeeded = stageName ? stageNameToRequiredCardsMap[stageName]! : [];

  let hasBackfire = false;

  handCardIndexes.sort((a, b) => a - b);
  greenCardIndexes.sort((a, b) => a - b);

  for (let i = handCardIndexes.length - 1; i >= 0; i--) {
    const cardToPlay = reactingPlayer.hand.splice(handCardIndexes[i], 1)[0];

    if (cardToPlay.name === 'backfire') {
      hasBackfire = true;
    }

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

    if (cardToPlay.name === 'backfire') {
      hasBackfire = true;
    }

    reactingPlayer.cardsInPlay.push(cardToPlay);
    checkIfCanDrawOneAfterReacting(G, reactingPlayer, cardToPlay);
  }

  clearCardsInPlay(G, ctx, reactingPlayerId);

  if (cardsNeeded.includes('missed')) {
    ctx.effects.missed();
  }

  if (ctx.activePlayers && Object.keys(ctx.activePlayers).length === 1) {
    resetGameStage(G, ctx);
  }

  if (hasBackfire) {
    if (ctx.events?.setActivePlayers) {
      ctx.events?.setActivePlayers({
        value: {
          ...(ctx.activePlayers ?? {}),
          [ctx.currentPlayer]: stageNames.reactToBangWithoutBang,
        },
      });
    }
  }

  if (ctx.events?.endStage) {
    ctx.events.endStage();

    // If you can play card to react, you passed the stage and can now be attacked again
    reactingPlayer.barrelUseLeft = 1;
    if (reactingPlayer.character.name === 'jourdonnais') {
      reactingPlayer.jourdonnaisPowerUseLeft = 1;
    }
  }

  if (onlyHandCardToPlay !== null && previousActiveStage === stageNames.duel) {
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
  targetPlayer.cardDiscardedThisTurn += 1;

  if (targetPlayer.cardDiscardedThisTurn === 2 && targetPlayer.character.name === 'sid ketchum') {
    targetPlayer.hp = Math.min(targetPlayer.hp + 1, targetPlayer.maxHp);
    targetPlayer.cardDiscardedThisTurn = 0;
  }

  if (targetPlayer.cardsInPlay.length) {
    clearCardsInPlay(G, ctx, targetPlayerId);
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

  if (ctx.activePlayers && Object.keys(ctx.activePlayers).length === 1) {
    resetGameStage(G, ctx);
  }

  endStage(G, ctx);
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
  const stageName = ctx.activePlayers ? (ctx.activePlayers[targetPlayerId] as stageNames) : null;
  const cardsNeeded = stageName ? stageNameToRequiredCardsMap[stageName]! : [];

  clearCardsInPlay(G, ctx, targetPlayerId);
  if (isInnatePower) {
    reactingPlayer.jourdonnaisPowerUseLeft -= 1;
  } else {
    reactingPlayer.barrelUseLeft -= 1;
  }

  if (isSuccessful) {
    if (stageName && cardsNeeded.includes('missed') && G.reactionRequired.quantity === 1) {
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
  const bangCard =
    G.players[targetPlayerId].cardsInPlay.find(card => card.name === 'bang') ||
    G.players[targetPlayerId].cardsInPlay[0];

  if (bangCard) {
    let activePlayersValue = {
      ...(ctx.activePlayers || {}),
    };

    if (
      bangCard.name === 'bang' ||
      (bangCard.name === 'missed' && currentPlayer.character.name === 'calamity janet')
    ) {
      activePlayersValue[targetPlayerId] = stageNames.reactToBang;
    } else {
      activePlayersValue[targetPlayerId] = stageNames.reactToBangWithoutBang;
    }

    if (ctx.events?.setActivePlayers) {
      ctx.events?.setActivePlayers({
        value: activePlayersValue,
      });
    }
  }

  G.reactionRequired = {
    quantity: 1,
    sourcePlayerId: currentPlayer.id,
  };

  if (bangCard) {
    if (currentPlayer.character.name === 'slab the killer' && bangCard.name === 'bang') {
      G.reactionRequired.quantity = 2;
    }

    switch (bangCard.name) {
      case 'punch': {
        ctx.effects.punch(bangCard.id);
        break;
      }
      case 'derringer':
      case 'tomahawk': {
        ctx.effects.knifeFlying();
        break;
      }
      default: {
        ctx.effects.gunshot(bangCard.id);
        break;
      }
    }

    if (bangCard.name === 'bang' || bangCard.name === 'fanning' || hasLemat(currentPlayer)) {
      currentPlayer.numBangsLeft -= 1;
    }

    checkIfCanDrawOneAfterReacting(G, currentPlayer, bangCard);
  }

  endStage(G, ctx);
};

const beer = (G: IGameState, ctx: Ctx) => {
  const currentPlayer = G.players[ctx.currentPlayer];
  const beerCard = currentPlayer.cardsInPlay[0];

  if (ctx.phase !== 'suddenDeath' && beerCard.name === 'beer') {
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

  endStage(G, ctx);
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

  // Order to pick from general store starting from the current player
  G.reactingOrder = [
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
    G.reactingOrder.shift();
  }

  if (ctx.activePlayers && Object.keys(ctx.activePlayers).length === 1) {
    resetGameStage(G, ctx);
  }
};

const duel = (G: IGameState, ctx: Ctx, targetPlayerId: string, sourcePlayerId: string) => {
  G.reactionRequired.sourcePlayerId = sourcePlayerId;

  endStage(G, ctx);

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
  G.reactionRequired = {
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

  const snakeCard = hasSnake(currentPlayer);
  if (snakeCard) {
    snakeCard.timer = 0;
  }

  if (ctx.phase === 'reselectCharacter' && currentPlayer.hand.length === 0) {
    initialCardDeal(G, ctx);
  }

  if (currentPlayer.equipmentsGreen.length > 0) {
    currentPlayer.equipmentsGreen.forEach(card => {
      card.timer = 0;
    });
  }

  if (currentPlayer.cardsInPlay.length > 0) {
    clearCardsInPlay(G, ctx, ctx.currentPlayer);
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

export const endStage = (G: IGameState, ctx: Ctx) => {
  if (ctx.events?.endStage) {
    ctx.events.endStage();
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

export const equipGreenCard = (G: IGameState, ctx: Ctx, cardIndex: number) => {
  ctx.effects.swoosh();
  const currentPlayer = G.players[ctx.currentPlayer];
  const equipmentGreenCard = currentPlayer.hand.splice(cardIndex, 1)[0];
  currentPlayer.equipmentsGreen.push(equipmentGreenCard);
};

export const resetDiscardStage = (G: IGameState, ctx: Ctx) => {
  G.reactionRequired.moveToPlayAfterDiscard = null;
  G.reactionRequired.moveArgs = undefined;
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

  G.reactionRequired.moveToPlayAfterDiscard = cardName;
  G.reactionRequired.moveArgs = [targetPlayerId];
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
      currentPlayer: stageNames.joseDelgadoDiscard,
      moveLimit: 1,
    });
  }

  G.reactionRequired.moveToPlayAfterDiscard = 'josedelgadodraw' as CardName;

  if (currentPlayer.character.activePowerUsesLeft !== undefined) {
    currentPlayer.character.activePowerUsesLeft -= 1;
  }
};

export const josedelgadodraw = (G: IGameState, ctx: Ctx) => {
  drawTwoFromDeck(G, ctx);
};

// Valley of shadows
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

export const lastcall = (G: IGameState, ctx: Ctx) => {
  const currentPlayer = G.players[ctx.currentPlayer];
  currentPlayer.hp = Math.min(currentPlayer.maxHp, currentPlayer.hp + 1);
};

export const snakeResult = (G: IGameState, ctx: Ctx) => {
  const currentPlayer = G.players[ctx.currentPlayer];
  const snakeCard = hasSnake(currentPlayer);

  if (snakeCard) {
    snakeCard.timer = 1;
  }

  const isFailure = currentPlayer.cardsInPlay.every(card => card.suit === 'spades');

  if (isFailure) {
    takeDamage(G, ctx, currentPlayer.id);
  }

  if (currentPlayer.character.realName && !isJailed(currentPlayer)) {
    setVeraCusterStage(ctx);
  }
};

export const bandidos = (G: IGameState, ctx: Ctx) => {
  const otherPlayersStages = getOtherPlayersAliveStages(G, ctx, stageNames.bandidos);

  if (ctx.events?.setActivePlayers) {
    ctx.events.setActivePlayers({
      value: {
        [ctx.currentPlayer]: stageNames.bandidos,
        ...otherPlayersStages,
      },
      moveLimit: 2,
    });
  }
};

export const fanning = (G: IGameState, ctx: Ctx, targetPlayerId: string) => {
  let playerStages = {
    [targetPlayerId]: stageNames.reactToBangWithoutBang,
  };

  if (isAnyPlayerWithinOneRange(G, ctx, targetPlayerId)) {
    playerStages[ctx.currentPlayer] = stageNames.fanning;
  }

  if (ctx.events?.setActivePlayers) {
    ctx.events.setActivePlayers({
      value: playerStages,
    });
  }

  const bangCard =
    G.players[targetPlayerId].cardsInPlay.find(card => card.name === 'bang') ||
    G.players[targetPlayerId].cardsInPlay[0];
  ctx.effects.gunshot(bangCard.id);
};

export const tornado = (G: IGameState, ctx: Ctx, targetPlayerId: string) => {
  const activePlayers = getOtherPlayersAliveStages(G, ctx, stageNames.tornado);

  for (const id in activePlayers) {
    const player = G.players[id];

    if (player.hand.length === 0) {
      activePlayers[id] = undefined;

      const newCards: ICard[] = G.deck.slice(G.deck.length - 2, G.deck.length);
      G.deck = G.deck.slice(0, G.deck.length - 2);
      player.hand.push(...newCards);
      player.hand = shuffle(ctx, player.hand);
    }
  }

  if (ctx.events?.setActivePlayers) {
    ctx.events?.setActivePlayers({
      currentPlayer: stageNames.tornado,
      value: activePlayers,
      moveLimit: 1,
    });
  }
};

export const discardToReact = (
  G: IGameState,
  ctx: Ctx,
  targetPlayerId: string,
  targetCardIndex: number
) => {
  const targetPlayer = G.players[targetPlayerId];
  const discardedCard = targetPlayer.hand.splice(targetCardIndex, 1)[0];
  if (!discardedCard) return INVALID_MOVE;

  if (discardedCard.name === 'escape') {
    endStage(G, ctx);
  }

  moveToDiscard(G, ctx, discardedCard);

  if (targetPlayer.cardsInPlay.length) {
    clearCardsInPlay(G, ctx, targetPlayerId);
  }
};

export const discardForTornado = (
  G: IGameState,
  ctx: Ctx,
  targetPlayerId: string,
  targetCardIndex: number
) => {
  discardToReact(G, ctx, targetPlayerId, targetCardIndex);

  const targetPlayer = G.players[targetPlayerId];
  const newCards: ICard[] = G.deck.slice(G.deck.length - 2, G.deck.length);
  G.deck = G.deck.slice(0, G.deck.length - 2);
  targetPlayer.hand.push(...newCards);
  targetPlayer.hand = shuffle(ctx, targetPlayer.hand);
};

export const poker = (G: IGameState, ctx: Ctx) => {
  const activePlayers = getOtherPlayersAliveStages(G, ctx, stageNames.poker);

  if (ctx.events?.setActivePlayers) {
    ctx.events?.setActivePlayers({
      currentPlayer: stageNames.play,
      value: activePlayers,
      moveLimit: 1,
    });
  }
};

export const discardForPoker = (
  G: IGameState,
  ctx: Ctx,
  targetPlayerId: string,
  targetCardIndex: number
) => {
  const targetPlayer = G.players[targetPlayerId];
  const discardedCard = targetPlayer.hand.splice(targetCardIndex, 1)[0];

  if (ctx.activePlayers && Object.keys(ctx.activePlayers).length === 1) {
    const wasAnyAceDiscarded = G.generalStore.some(card => card.value === 14);
    const otherPlayersAlive = getOtherPlayersAlive(G, ctx);

    if (!wasAnyAceDiscarded) {
      if (ctx.events?.setActivePlayers) {
        ctx.events?.setActivePlayers({
          currentPlayer: stageNames.pickCardForPoker,
          moveLimit: Math.min(otherPlayersAlive.length, 2),
        });

        G.reactingOrder = [ctx.currentPlayer];
      }
    }

    endStage(G, ctx);
  }

  if (discardedCard) {
    G.generalStore.push(discardedCard);
  }
};

export const pickCardForPoker = (
  G: IGameState,
  ctx: Ctx,
  generalStoreCardIndex: number,
  targetPlayerId: string
) => {
  const currentPlayer = G.players[targetPlayerId];
  const selectedCard = G.generalStore.splice(generalStoreCardIndex, 1)[0];

  currentPlayer.hand.push(selectedCard);
  currentPlayer.hand = shuffle(ctx, currentPlayer.hand);
};

export const lemat = (G: IGameState, ctx: Ctx) => {
  if (ctx.events?.setActivePlayers) {
    ctx.events?.setActivePlayers({
      currentPlayer: stageNames.lemat,
    });
  }
};

export const putPlayersInSavedState = (G: IGameState, ctx: Ctx, targetPlayerId: string) => {
  const playerIdsNotTarget = getPlayerIdsNotTarget(G, ctx, targetPlayerId);
  let playerStages: { [id: string]: string } = {};

  for (const id of playerIdsNotTarget) {
    playerStages[id] = stageNames.saved;
  }

  G.savedState = {
    previousStages: { ...(ctx.activePlayers || {}) },
    savedPlayerId: targetPlayerId,
  };

  if (ctx.events?.setActivePlayers) {
    ctx.events?.setActivePlayers({
      value: playerStages,
    });
  }
};

export const moves_VOS: MoveMap<IGameState> = {
  lastcall,
  snakeResult,
  bandidos,
  fanning,
  tornado,
  discardForTornado,
  poker,
  discardForPoker,
  pickCardForPoker,
  lemat,
  putPlayersInSavedState,
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
  endStage,
  reselectCharacter,
  discardToReact,
  equipOtherPlayer,
  setActivePlayersStage,
};

const allMoves = {
  ...moves,
  ...moves_DodgeCity,
  ...moves_VOS,
};

export default allMoves;
