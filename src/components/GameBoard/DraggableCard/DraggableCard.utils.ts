import { cardsThatWorkAgainstBang, cardsWhichTargetCards, ICard } from '../../../game';

export const getCardInstructions = (card: ICard) => {
  if (cardsThatWorkAgainstBang.includes(card.name)) {
    return `When attacked, click to play`;
  }

  if (card.isTargeted) {
    if (cardsWhichTargetCards.includes(card.name)) {
      return `Drag and drop on top of another player's card to play`;
    }

    return `Drag and drop on top of a player to play`;
  }

  return `Click to play`;
};
