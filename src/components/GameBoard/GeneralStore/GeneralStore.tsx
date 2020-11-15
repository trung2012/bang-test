import React from 'react';
import { useGameContext } from '../../../context';
import { Card } from '../Card';

export const GeneralStore = () => {
  const { G } = useGameContext();
  const { generalStore } = G;

  if (!generalStore.length) return null;

  return (
    <div className='general-store'>
      {generalStore.map(card => {
        return <Card key={card.id} card={card} isFacedUp={true} />;
      })}
    </div>
  );
};
