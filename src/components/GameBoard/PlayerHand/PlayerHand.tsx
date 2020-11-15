import React from 'react';
import { useGameContext } from '../../../context';
import { ICard } from '../../../game/types';
import { DraggableCard } from '../DraggableCard';
import { DroppableCard } from '../DroppableCard';
import './PlayerHand.scss';

interface IPlayerCardsProps {
  playerId: string;
  hand: ICard[];
}

export const PlayerHand: React.FC<IPlayerCardsProps> = React.memo(({ hand, playerId }) => {
  const { playerID } = useGameContext();
  const isFacedUp = playerId === playerID;

  if (isFacedUp) {
    return (
      <div className='player-cards'>
        {hand.map((card, index) => (
          <DraggableCard
            key={card.id}
            card={card}
            index={index}
            isFacedUp={isFacedUp}
            playerId={playerId}
          />
        ))}
      </div>
    );
  }

  return (
    <div className='player-cards'>
      {hand.map((card, index) => (
        <DroppableCard
          key={card.id}
          card={card}
          index={index}
          isFacedUp={isFacedUp}
          playerId={playerId}
        />
      ))}
    </div>
  );
});
