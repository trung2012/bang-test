import React from 'react';
import { useGameContext } from '../../../context';
import { CardPile } from './CardPile';
import './Discarded.scss';

export const Discarded = () => {
  const { G } = useGameContext();
  const { discarded } = G;

  return <CardPile className='discarded' cards={discarded} isFacedUp={true} />;
};
