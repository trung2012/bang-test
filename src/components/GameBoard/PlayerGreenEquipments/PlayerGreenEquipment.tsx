import React from 'react';
import { ICard } from '../../../game';
import { DroppableDraggableCard } from '../DraggableCard/DroppableDraggableCard';
import './PlayerGreenEquipments.scss';

interface IPlayerGreenEquipments {
  playerId: string;
  equipments: ICard[];
}

export const PlayerGreenEquipments: React.FC<IPlayerGreenEquipments> = ({
  playerId,
  equipments,
}) => {
  if (!equipments?.length) {
    return null;
  }

  return (
    <div className='player-green-equipments'>
      {equipments.map((card, index) => (
        <DroppableDraggableCard key={card.id} card={card} index={index} playerId={playerId} />
      ))}
    </div>
  );
};
