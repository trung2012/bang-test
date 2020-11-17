import React from 'react';
import { useGameContext } from '../../../context';
import { Card } from '../Card';

export const GeneralStore = () => {
  const { G, moves, playerID } = useGameContext();
  const { generalStore } = G;

  const pickFromGeneralStore = (index: number) => {
    moves.pickCardFromGeneralStore(index, playerID);
  };

  if (!generalStore.length) return null;

  return (
    <div className='general-store'>
      {generalStore.map((card, index) => {
        return (
          <Card
            key={card.id}
            card={card}
            isFacedUp={true}
            onClick={() => pickFromGeneralStore(index)}
          />
        );
      })}
    </div>
  );
};
