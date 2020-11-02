import { INVALID_MOVE } from 'boardgame.io/core';
import { Ctx, MoveMap } from 'boardgame.io/dist/types/src/types';
import { delayBetweenActions, stageNames } from './constants';
import { ICard, IGameState } from './types';

export const takeDamage = (G: IGameState, ctx: Ctx, targetPlayerId: string) => {
  const currentPlayer = G.players[targetPlayerId];
  currentPlayer.hp -= 1;
};

export const playCard = (G: IGameState, ctx: Ctx, cardIndex: number, targetPlayerId: string) => {
  const targetPlayer = G.players[targetPlayerId];
  const currentPlayer = G.players[ctx.currentPlayer];
  const cardToPlay = currentPlayer.hand.splice(cardIndex, 1)[0];
  targetPlayer.cardsInPlay.push(cardToPlay);
};

export const clearCardsInPlay = (G: IGameState, ctx: Ctx, targetPlayerId: string) => {
  const targetPlayer = G.players[targetPlayerId];
  const length = targetPlayer.cardsInPlay.length;

  for (let i = length - 1; i >= 0; i--) {
    const discardedCard = targetPlayer.cardsInPlay.pop();
    if (discardedCard) {
      G.discarded.push(discardedCard);
    }
  }
};

export const playCardToReact = (G: IGameState, ctx: Ctx) => {};

export const moveToDiscard = (G: IGameState, ctx: Ctx, card: ICard) => {
  G.discarded.push(card);
  return G;
};

export const discardFromHand = (
  G: IGameState,
  ctx: Ctx,
  targetPlayerId: string,
  targetCardIndex: number
) => {
  const targetPlayer = G.players[targetPlayerId];
  const discardedCard = targetPlayer.hand.splice(targetCardIndex, 1)[0];
  if (!discardedCard) return INVALID_MOVE;
  moveToDiscard(G, ctx, discardedCard);
};

export const delayedDiscard = (G: IGameState, ctx: Ctx, card: ICard) => {
  setTimeout(() => {
    moveToDiscard(G, ctx, card);
  }, delayBetweenActions);
};

export const equip = (G: IGameState, ctx: Ctx, cardIndex: number) => {
  const currentPlayer = G.players[ctx.currentPlayer];
  const equipmentCard = currentPlayer.hand.splice(cardIndex, 1)[0];
  if (equipmentCard.type !== 'equipment') return INVALID_MOVE;
  currentPlayer.equipments.push(equipmentCard);
};

export const jail = (G: IGameState, ctx: Ctx, jailCard: ICard, targetPlayerId: string) => {
  const targetPlayer = G.players[targetPlayerId];
  if (targetPlayer.role === 'sheriff') return INVALID_MOVE;

  targetPlayer.equipments.push(jailCard);
};

export const drawOneFromDeck = (G: IGameState, ctx: Ctx) => {
  const currentPlayer = G.players[ctx.currentPlayer];
  const newCard = G.deck.pop();
  if (newCard) {
    currentPlayer.hand.push(newCard);
  }
};

export const drawTwoFromDeck = (G: IGameState, ctx: Ctx) => {
  const currentPlayer = G.players[ctx.currentPlayer];
  const newCards: ICard[] = G.deck.slice(G.deck.length - 2, G.deck.length);
  G.deck = G.deck.slice(0, G.deck.length - 2);
  currentPlayer.hand.push(...newCards);
};

export const drawOneFromDiscardPile = (G: IGameState, ctx: Ctx) => {
  const currentPlayer = G.players[ctx.currentPlayer];
  const newCard = G.discarded.pop();
  if (newCard) {
    currentPlayer.hand.push(newCard);
  }
};

export const blackJackDraw = (G: IGameState, ctx: Ctx) => {
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

  setTimeout(() => {
    let thirdCard: ICard;

    if (secondCard && (secondCard.suit === 'hearts' || secondCard.suit === 'diamond')) {
      thirdCard = G.deck.pop() as ICard;
      if (thirdCard) {
        currentPlayer.hand.push(thirdCard);
      }
    }
  }, delayBetweenActions);
};

export const drawToReact = (
  G: IGameState,
  ctx: Ctx,
  isDynamite: boolean = false,
  isJail: boolean = false
) => {
  let cards: ICard[] = [];
  const currentPlayer = G.players[ctx.currentPlayer];
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

  if (isDynamite || isJail) {
    const isFailure = cards.every(
      card => card.suit === 'spades' && card.value >= 2 && card.value <= 9
    );

    if (isFailure) {
      if (isDynamite) {
        currentPlayer.hp = currentPlayer.hp - 3;
      }

      if (isJail && ctx.events && ctx.events.endTurn) {
        ctx.events?.endTurn();
      }
    }
  } else {
    // Barrel
    const isFailure = cards.every(card => card.suit !== 'hearts');
    if (isFailure) {
      currentPlayer.hp -= 1;
    }
  }
};

export const bang = (G: IGameState, ctx: Ctx, targetPlayerId: string) => {
  G.currentReactionCardNeeded = 'missed';

  if (ctx.events?.setActivePlayers) {
    ctx.events?.setActivePlayers({
      value: {
        [targetPlayerId]: stageNames.drawToReact,
      },
    });
  }
};

export const beer = (G: IGameState, ctx: Ctx) => {
  if (G.isSuddenDeathOn) {
    return INVALID_MOVE;
  }

  const currentPlayer = G.players[ctx.currentPlayer];
  currentPlayer.hp = Math.min(currentPlayer.maxHp, currentPlayer.hp + 1);
};

export const catbalou = (
  G: IGameState,
  ctx: Ctx,
  targetPlayerId: string,
  targetCardIndex: number
) => {
  const targetPlayer = G.players[targetPlayerId];
  const cardToDiscard = targetPlayer.hand.splice(targetCardIndex, 1)[0];
  G.discarded.push(cardToDiscard);
};

export const gatling = (G: IGameState, ctx: Ctx) => {
  G.currentReactionCardNeeded = 'missed';
  if (ctx.events?.setActivePlayers) {
    ctx.events?.setActivePlayers({
      others: stageNames.reactToGatling,
      moveLimit: 1,
    });
  }
};

export const indians = (G: IGameState, ctx: Ctx) => {
  G.currentReactionCardNeeded = 'bang';
  if (ctx.events?.setActivePlayers) {
    ctx.events?.setActivePlayers({
      others: stageNames.reactToIndians,
      moveLimit: 1,
    });
  }
};

export const panic = (G: IGameState, ctx: Ctx, targetPlayerId: string, targetCardIndex: number) => {
  const targetPlayer = G.players[targetPlayerId];
  const currentPlayer = G.players[ctx.currentPlayer];
  const cardToTake = targetPlayer.hand.splice(targetCardIndex, 1)[0];
  currentPlayer.hand.push(cardToTake);
};

export const saloon = (G: IGameState, ctx: Ctx) => {
  if (G.isSuddenDeathOn) {
    return INVALID_MOVE;
  }

  for (const playerId of ctx.playOrder) {
    const player = G.players[playerId];
    player.hp = Math.min(player.maxHp, player.hp + 1);
  }
};

export const stagecoach = (G: IGameState, ctx: Ctx) => {
  const currentPlayer = G.players[ctx.currentPlayer];

  // Take 2 cards
  const newCards = G.deck.slice(0, 2);
  G.deck = G.deck.slice(2);

  if (newCards) {
    currentPlayer.hand.push(...newCards);
  }
};

export const wellsfargo = (G: IGameState, ctx: Ctx) => {
  const currentPlayer = G.players[ctx.currentPlayer];

  // Take 3 cards
  const newCards = G.deck.slice(0, 3);
  G.deck = G.deck.slice(3);

  if (newCards) {
    currentPlayer.hand.push(...newCards);
  }
};

export const generalstore = (G: IGameState, ctx: Ctx) => {
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
};

export const pickCardFromGeneralStore = (
  G: IGameState,
  ctx: Ctx,
  generalStoreCardIndex: number
) => {
  const currentPlayer = G.players[ctx.currentPlayer];
  const selectedCard = G.generalStore.splice(generalStoreCardIndex, 1)[0];

  currentPlayer.hand.push(selectedCard);
};

export const duel = (G: IGameState, ctx: Ctx, targetPlayerId: string) => {
  G.currentReactionCardNeeded = 'bang';
  if (ctx.events?.setActivePlayers) {
    ctx.events.setActivePlayers({
      value: {
        [targetPlayerId]: stageNames.duel,
      },
      moveLimit: 1,
    });
  }
};

export const endTurn = (G: IGameState, ctx: Ctx) => {
  if (ctx.events?.endTurn) {
    ctx.events?.endTurn();
  }
};

export const endDuelStage = (G: IGameState, ctx: Ctx) => {
  if (G.activeStage !== 'duel') return INVALID_MOVE;
  if (ctx.events?.endStage) {
    ctx.events.endStage();
  }
};

const moves: MoveMap<IGameState> = {
  takeDamage,
  drawOneFromDeck,
  drawTwoFromDeck,
  drawToReact,
  delayedDiscard,
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
};

export default moves;
