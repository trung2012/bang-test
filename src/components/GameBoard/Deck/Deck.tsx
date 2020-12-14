import React from 'react';
import { useErrorContext, useGameContext } from '../../../context';
import { delayBetweenActions } from '../../../game';
import { hasDynamite, isJailed } from '../../../game';
import { CardPile } from './CardPile';
import classnames from 'classnames';
import './Deck.scss';

export const Deck = () => {
  const { G, ctx, isActive, playerID, moves } = useGameContext();
  const { setError } = useErrorContext();
  const { deck } = G;
  const clientPlayer = G.players[playerID!];

  const onDeckClick = () => {
    if (!isActive || clientPlayer.cardDrawnAtStartLeft <= 0) return;

    if (playerID === ctx.currentPlayer && hasDynamite(clientPlayer) && G.dynamiteTimer === 0) {
      moves.drawToReact(playerID);

      setTimeout(() => {
        moves.dynamiteResult();
      }, delayBetweenActions);
      return;
    }

    if (playerID === ctx.currentPlayer && isJailed(clientPlayer)) {
      moves.drawToReact(playerID);

      setTimeout(() => {
        moves.jailResult();
      }, delayBetweenActions);
      return;
    }

    if (clientPlayer.cardDrawnAtStartLeft <= 0) {
      setError('You cannot draw at the moment');
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

    if (clientPlayer.character.name === 'black jack') {
      moves.blackJackDraw();
      setTimeout(() => {
        moves.blackJackResult();
      }, 2000);

      return;
    }

    if (clientPlayer.character.name === 'kit carlson') {
      moves.kitCarlsonDraw();
      return;
    }
    moves.drawTwoFromDeck();
  };

  return (
    <CardPile
      className={classnames('deck', {
        'deck--active': isActive && clientPlayer.cardDrawnAtStartLeft > 0,
      })}
      cards={deck}
      isFacedUp={false}
      onClick={onDeckClick}
    />
  );
};
