import React, { useState } from 'react';
import { useErrorContext, useGameContext } from '../../../context';
import { ICard } from '../../../game';
import { DraggableCard } from '../DraggableCard';

interface IPlayerGreenEquipments {
  playerId: string;
  equipments: ICard[];
}

export const PlayerGreenEquipments: React.FC<IPlayerGreenEquipments> = ({
  playerId,
  equipments,
}) => {
  const { G, playerID, ctx, moves, isActive } = useGameContext();
  const { setError } = useErrorContext();
  const clientPlayer = G.players[playerID!];
  const targetPlayer = G.players[playerId];
  const [selectedCards, setSelectedCards] = useState<number[]>([]);

  if (!equipments?.length) {
    return null;
  }

  return (
    <div className='player-hand'>
      {equipments.map((card, index) => (
        <DraggableCard
          key={`${card.id}-${index}`}
          card={card}
          index={index}
          isFacedUp={true}
          playerId={playerId}
          selectedCards={selectedCards}
          setSelectedCards={setSelectedCards}
          cardLocation='green'
        />
      ))}
    </div>
  );
};
