import React from 'react';
import classnames from 'classnames';
import { useGameContext } from '../../../context';
import { CardPile } from './CardPile';
import './Discarded.scss';

export const Discarded = () => {
  const { G, isActive, playerID, moves } = useGameContext();
  const { discarded } = G;
  const clientPlayer = G.players[playerID!];

  const onDiscardPileClick = () => {
    if (!isActive || clientPlayer.character.name !== 'pedro ramirez') return;
    moves.drawOneFromDiscardPile();
  };

  return (
    <CardPile
      className={classnames('discarded', {
        'discarded--active': isActive && clientPlayer.character.name === 'pedro ramirez',
      })}
      cards={discarded}
      isFacedUp={true}
      onClick={onDiscardPileClick}
    />
  );
};
