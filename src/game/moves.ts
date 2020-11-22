import { INVALID_MOVE } from 'boardgame.io/core';
import { Ctx, MoveMap } from 'boardgame.io';
import { gunRange, stageNames } from './constants';
import { ICard, IGameState, RobbingType } from './types';

const takeDamage = (G: IGameState, ctx: Ctx, targetPlayerId: string) => {
  if (!targetPlayerId) return INVALID_MOVE;
  const targetPlayer = G.players[targetPlayerId];
  targetPlayer.hp -= 1;

  const beerCardIndex = targetPlayer.hand.findIndex(card => card.name === 'beer');
  if (beerCardIndex !== -1 && targetPlayer.hp === 0) {
    const cardToPlay = targetPlayer.hand.splice(beerCardIndex, 1)[0];
    targetPlayer.cardsInPlay.push(cardToPlay);
    targetPlayer.hp = 1;

    clearCardsInPlay(G, ctx, targetPlayerId);
  }

  if (targetPlayer.hp <= 0) {
    while (targetPlayer.hand.length > 0) {
      const discardedCard = targetPlayer.hand.pop();
      if (discardedCard) {
        G.discarded.push(discardedCard);
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
      ctx.events.setActivePlayers({
        value: {
          [targetPlayerId]: stageNames.takeCardFromHand,
        },
        moveLimit: 1,
      });
      G.activeStage = stageNames.takeCardFromHand;
    }
  }
};

export const dynamiteExplodes = (G: IGameState, ctx: Ctx, targetPlayerId: string) => {
  if (!targetPlayerId) return INVALID_MOVE;
  const currentPlayer = G.players[targetPlayerId];
  currentPlayer.hp -= 3;

  const beerCardIndex = currentPlayer.hand.findIndex(card => card.name === 'beer');
  if (beerCardIndex !== -1 && currentPlayer.hp === 0) {
    playCard(G, ctx, beerCardIndex, targetPlayerId);
    currentPlayer.hp = 1;
    clearCardsInPlay(G, ctx, targetPlayerId);
  }
};

export const playCard = (G: IGameState, ctx: Ctx, cardIndex: number, targetPlayerId: string) => {
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
      G.discarded.push(discardedCard);
    }
  }
};

export const playCardToReact = (
  G: IGameState,
  ctx: Ctx,
  cardIndex: number,
  reactingPlayerId: string
) => {
  const reactingPlayer = G.players[reactingPlayerId];
  const cardToPlay = reactingPlayer.hand.splice(cardIndex, 1)[0];
  const previousActiveStage = G.activeStage;
  const previousSourcePlayerId = G.reactionRequired.sourcePlayerId;
  reactingPlayer.cardsInPlay.push(cardToPlay);
  clearCardsInPlay(G, ctx, reactingPlayerId);

  if (ctx.activePlayers && Object.keys(ctx.activePlayers).length === 1) {
    resetGameStage(G, ctx);
  }

  if (ctx.events?.endStage) {
    ctx.events.endStage();
  }

  if (cardToPlay.name === 'bang' && previousActiveStage === 'duel') {
    if (previousSourcePlayerId) {
      duel(G, ctx, previousSourcePlayerId, reactingPlayerId);
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
  const currentPlayer = G.players[ctx.currentPlayer];
  const equipmentCard = currentPlayer.hand.splice(cardIndex, 1)[0];

  if (equipmentCard.type !== 'equipment') return INVALID_MOVE;
  if (equipmentCard.name === 'volcanic') {
    currentPlayer.numBangsLeft = 9999;
  }

  const newGunRange = gunRange[equipmentCard.name];
  if (newGunRange) {
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
      currentPlayer.numBangsLeft = 1;
    }
    currentPlayer.gunRange = newGunRange;
  }

  if (equipmentCard.name === 'scope') {
    currentPlayer.actionRange += 1;
  }

  currentPlayer.equipments.push(equipmentCard);
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
  currentPlayer.hand.push(...currentPlayer.cardsInPlay);

  let thirdCard: ICard;

  if (secondCard && (secondCard.suit === 'hearts' || secondCard.suit === 'diamond')) {
    thirdCard = G.deck.pop() as ICard;
    if (thirdCard) {
      currentPlayer.hand.push(thirdCard);
    }
  }
};

export const barrel = (G: IGameState, ctx: Ctx, targetPlayerId: string) => {
  let cards: ICard[] = [];
  const currentPlayer = G.players[targetPlayerId];
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

  const isSuccessful = cards.some(card => card.suit === 'hearts');

  if (isSuccessful) {
    if (ctx.events?.endStage) {
      ctx.events.endStage();
      clearCardsInPlay(G, ctx, targetPlayerId);
      if (ctx.activePlayers && Object.keys(ctx.activePlayers).length === 1) {
        resetGameStage(G, ctx);
      }
    }
  }

  currentPlayer.barrelUseLeft -= 1;
};

const bang = (G: IGameState, ctx: Ctx, targetPlayerId: string) => {
  const currentPlayer = G.players[ctx.currentPlayer];
  G.reactionRequired.cardNeeded = 'missed';
  if (currentPlayer.character.name === 'slab the killer') {
    G.reactionRequired.quantity = 2;
  }

  if (ctx.events?.setActivePlayers) {
    ctx.events?.setActivePlayers({
      value: {
        [targetPlayerId]: stageNames.reactToBang,
      },
    });
  }
  G.activeStage = stageNames.reactToBang;
  G.reactionRequired = {
    cardNeeded: 'missed',
    quantity: 1,
    sourcePlayerId: currentPlayer.id,
  };
  currentPlayer.numBangsLeft -= 1;
};

const beer = (G: IGameState, ctx: Ctx) => {
  if (G.isSuddenDeathOn) {
    return INVALID_MOVE;
  }

  const currentPlayer = G.players[ctx.currentPlayer];
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
        targetPlayer.gunRange = 1;
        if (cardToDiscard.name === 'volcanic') {
          targetPlayer.numBangsLeft = 1;
        }
      }
      break;
  }
  G.discarded.push(cardToDiscard);
};

const gatling = (G: IGameState, ctx: Ctx) => {
  if (ctx.events?.setActivePlayers) {
    ctx.events?.setActivePlayers({
      others: stageNames.reactToGatling,
    });
  }
  G.reactionRequired.cardNeeded = 'missed';
  G.activeStage = stageNames.reactToGatling;
};

const indians = (G: IGameState, ctx: Ctx) => {
  if (ctx.events?.setActivePlayers) {
    ctx.events?.setActivePlayers({
      others: stageNames.reactToIndians,
      moveLimit: 1,
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
  let cardToTake: ICard;
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
  currentPlayer.hand.push(cardToTake);
};

const saloon = (G: IGameState, ctx: Ctx) => {
  if (G.isSuddenDeathOn) {
    return INVALID_MOVE;
  }

  for (const playerId of ctx.playOrder) {
    const player = G.players[playerId];
    player.hp = Math.min(player.maxHp, player.hp + 1);
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

  if (ctx.events?.setActivePlayers) {
    ctx.events?.setActivePlayers({
      all: stageNames.pickFromGeneralStore,
      moveLimit: 1,
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
};

const duel = (G: IGameState, ctx: Ctx, targetPlayerId: string, sourcePlayerId: string) => {
  G.reactionRequired.cardNeeded = 'bang';
  G.reactionRequired.sourcePlayerId = sourcePlayerId;
  G.activeStage = stageNames.duel;

  if (ctx.events?.setActivePlayers) {
    ctx.events.setActivePlayers({
      value: {
        [targetPlayerId]: stageNames.duel,
      },
      moveLimit: 1,
    });
  }

  if (ctx.events?.endStage) {
    ctx.events.endStage();
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

const discardHand = (G: IGameState, ctx: Ctx) => {
  const targetPlayer = G.players[ctx.currentPlayer];
  while (targetPlayer.hand.length > 0) {
    const discarded = targetPlayer.hand.pop();
    if (discarded) {
      G.discarded.push(discarded);
    }
  }
};

export const doNothing = (G: IGameState, ctx: Ctx) => {
  return G;
};

const moves: MoveMap<IGameState> = {
  takeDamage,
  drawOneFromDeck,
  drawTwoFromDeck,
  barrel,
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
  dynamiteExplodes,
  drawOneFromDiscardPile,
  blackJackDraw,
  discardHand,
  kitCarlsonDraw,
  kitCarlsonDiscard,
};

export default moves;
