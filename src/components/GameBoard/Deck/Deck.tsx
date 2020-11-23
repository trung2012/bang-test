import React from 'react';
import { useErrorContext, useGameContext } from '../../../context';
import { delayBetweenActions } from '../../../game/constants';
import { hasDynamite, isJailed } from '../../../game/utils';
import { CardPile } from './CardPile';
import './Deck.scss';

export const Deck = () => {
  const { G, isActive, playerID, moves } = useGameContext();
  const { setError } = useErrorContext();
  const { deck } = G;
  const clientPlayer = G.players[playerID!];

  const onDeckClick = () => {
    if (!isActive || clientPlayer.cardDrawnAtStartLeft === 0) return;

    if (hasDynamite(clientPlayer)) {
      moves.drawToReact(playerID);

      setTimeout(() => {
        moves.dynamiteResult();
      }, delayBetweenActions);
      return;
    }

    if (isJailed(clientPlayer)) {
      moves.drawToReact(playerID);

      setTimeout(() => {
        moves.jailResult();
      }, delayBetweenActions);
      return;
    }

    if (clientPlayer.character.name === 'black jack') {
      moves.blackJackDraw();
      setTimeout(() => {
        moves.blackJackResult();
      }, delayBetweenActions);

      return;
    }

    if (clientPlayer.character.name === 'kit carlson') {
      moves.kitCarlsonDraw();
      return;
    }

    if (
      (clientPlayer.character.name === 'jesse jones' ||
        clientPlayer.character.name === 'pedro ramirez') &&
      clientPlayer.cardDrawnAtStartLeft === 1
    ) {
      moves.drawOneFromDeck();
      return;
    }

    if (clientPlayer.cardDrawnAtStartLeft < 2) {
      setError('You cannot draw at the moment');
      return;
    }
    moves.drawTwoFromDeck();
  };

  return <CardPile className='deck' cards={deck} isFacedUp={false} onClick={onDeckClick} />;
};
