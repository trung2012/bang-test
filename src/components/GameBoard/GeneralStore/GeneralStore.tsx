import React from 'react';
import { useErrorContext, useGameContext } from '../../../context';
import { Card } from '../Card';

export const GeneralStore = () => {
  const { G, moves, playerID } = useGameContext();
  const { setError } = useErrorContext();
  const { generalStore } = G;

  const pickFromGeneralStore = (index: number) => {
    if (playerID !== G.generalStoreOrder[0]) {
      setError('It is not your turn yet');
      return;
    }

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
