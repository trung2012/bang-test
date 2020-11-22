import { Ctx } from 'boardgame.io';
import { IGameState, ICard, IGamePlayer } from './types';

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
