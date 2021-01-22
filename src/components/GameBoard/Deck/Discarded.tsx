import React from 'react';
import classnames from 'classnames';
import { useGameContext } from '../../../context';
import { CardPile } from './CardPile';
import './Discarded.scss';
import { hasActiveDynamite, hasActiveSnake, isJailed } from '../../../game';

export const Discarded = () => {
  const { G, isActive, playerID, moves } = useGameContext();
  const { discarded } = G;
  const clientPlayer = G.players[playerID!];

  const onDiscardPileClick = () => {
    if (
      !isActive ||
      clientPlayer.character.name !== 'pedro ramirez' ||
      clientPlayer.cardDrawnAtStartLeft < 2 ||
      G.discarded.length === 0 ||
      hasActiveDynamite(clientPlayer) ||
      isJailed(clientPlayer) ||
      hasActiveSnake(clientPlayer)
    )
      return;
    moves.drawOneFromDiscardPile();
  };

  return (
    <CardPile
      className={classnames('discarded', {
        'discarded--active':
          isActive &&
          clientPlayer.character.name === 'pedro ramirez' &&
          clientPlayer.cardDrawnAtStartLeft > 0,
      })}
      cards={discarded}
      isFacedUp={true}
      onClick={onDiscardPileClick}
    />
  );
};
