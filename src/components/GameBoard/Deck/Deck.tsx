import React from 'react';
import { useGameContext } from '../../../context';
import { CardPile } from './CardPile';
import './Deck.scss';

export const Deck = () => {
  const { G } = useGameContext();
  const { deck } = G;

  return <CardPile className='deck' cards={deck} isFacedUp={false} />;
};
