import { INVALID_MOVE } from 'boardgame.io/core';
import { Ctx, Move } from 'boardgame.io/src/types';
import { ICard, IGameState } from './types';

export interface IGameMoves {
  [name: string]: Move;
}

const equip = (G: IGameState, ctx: Ctx, cardIndex: number) => {
  const currentPlayer = G.players[ctx.currentPlayer];
  const equippedCard = currentPlayer.hand.splice(cardIndex, 1)[0];
  currentPlayer.equipments.push(equippedCard);
};

const jail = (G: IGameState, ctx: Ctx, jailCardIndex: number, targetPlayerId: string) => {
  const targetPlayer = G.players[targetPlayerId];
  if (targetPlayer.role === 'sheriff') return INVALID_MOVE;

  const currentPlayer = G.players[ctx.currentPlayer];
  const jailCard = currentPlayer.hand.splice(jailCardIndex, 1)[0];

  if (jailCard.name !== 'jail') return INVALID_MOVE;

  targetPlayer.equipments.push(jailCard);
};

const draw = (G: IGameState, ctx: Ctx) => {
  const currentPlayer = G.players[ctx.currentPlayer];
  const newCard = G.deck.pop();
  if (newCard) {
    currentPlayer.hand.push(newCard);
  }
};

const drawToReact = (G: IGameState, ctx: Ctx, isDynamite: boolean, isJail: boolean) => {
  let cards: ICard[] = [];
  const currentPlayer = G.players[ctx.currentPlayer];
  let drawnCard = G.deck.pop();

  if (drawnCard) {
    cards.push(drawnCard);
  }

  if (currentPlayer.character.name === 'lucky duke') {
    drawnCard = G.deck.pop();
    if (drawnCard) {
      cards.push(drawnCard);
    }
  }

  if (isDynamite || isJail) {
    const failure = cards.every(
      card => card.suit === 'spades' && card.value >= 2 && card.value <= 9
    );

    if (failure) {
      if (isDynamite) {
        currentPlayer.hp = currentPlayer.hp - 3;
      }

      if (isJail && ctx.events && ctx.events.endTurn) {
        ctx.events?.endTurn();
      }
    }
  } else {
    const failure = cards.every(card => card.suit !== 'hearts');
    if (failure) {
      currentPlayer.hp = currentPlayer.hp - 1;
    }
  }
};

const playCardToReact = (G: IGameState, ctx: Ctx, targetPlayerId: string) => {};

const discard = (G: IGameState, ctx: Ctx, targetPlayerId: string, targetCardIndex: number) => {
  const targetPlayer = G.players[targetPlayerId];
  const discardedCard = targetPlayer.hand.splice(targetCardIndex, 1)[0];
  G.discarded.push(discardedCard);
};

const bang = (G: IGameState, ctx: Ctx, targetPlayerId: string) => {};
const missed = (G: IGameState, ctx: Ctx, targetPlayerId: string) => {};
const beer = (G: IGameState, ctx: Ctx, targetPlayerId: string) => {};
const catBalou = (G: IGameState, ctx: Ctx, targetPlayerId: string, targetCardIndex: number) => {};
const gattling = (G: IGameState, ctx: Ctx) => {};
const indians = (G: IGameState, ctx: Ctx) => {};
const panic = (G: IGameState, ctx: Ctx, targetPlayerId: string) => {};
const saloon = (G: IGameState, ctx: Ctx) => {};
const stagecoach = (G: IGameState, ctx: Ctx) => {};
const wellsfargo = (G: IGameState, ctx: Ctx) => {};
const moveToDiscard = (G: IGameState, ctx: Ctx, card: ICard) => {};
const duel = (G: IGameState, ctx: Ctx, targetPlayerId: string) => {};
const generalStore = (G: IGameState, ctx: Ctx) => {};
const pickCardFromGeneralStore = (G: IGameState, ctx: Ctx, generalStoreCardIndex: number) => {};

const moves: IGameMoves = {
  draw,
  drawToReact,
  playCardToReact,
  discard,
  equip,
  jail,
  bang,
  missed,
  beer,
  catBalou,
  gattling,
  indians,
  panic,
  saloon,
  stagecoach,
  wellsfargo,
  moveToDiscard,
  duel,
  generalStore,
  pickCardFromGeneralStore,
};

export default moves;
