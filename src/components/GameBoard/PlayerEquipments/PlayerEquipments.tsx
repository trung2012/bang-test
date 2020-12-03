import React from 'react';
import { useGameContext } from '../../../context';
import { delayBetweenActions, stageNames } from '../../../game';
import { ICard } from '../../../game';
import { DroppableCard } from '../DroppableCard';
import './PlayerEquipments.scss';

interface IPlayerEquipments {
  playerId: string;
  equipments: ICard[];
}

export const PlayerEquipments: React.FC<IPlayerEquipments> = ({ playerId, equipments }) => {
  const { G, playerID, moves } = useGameContext();

  const onEquipmentClick = (equipmentCard: ICard) => {
    if (
      playerID !== playerId ||
      equipmentCard.name !== 'barrel' ||
      G.players[playerId].barrelUseLeft <= 0
    )
      return;

    if (G.activeStage === stageNames.reactToGatling || G.activeStage === stageNames.reactToBang) {
      moves.drawToReact(playerID);
      setTimeout(() => {
        moves.barrelResult(playerID, false);
      }, delayBetweenActions);
    }
  };

  if (!equipments?.length) {
    return null;
  }

  return (
    <div className='player-equipments'>
      {equipments.map((card, index) => (
        <DroppableCard
          key={card.id}
          card={card}
          index={index}
          isFacedUp={true}
          playerId={playerId}
          cardLocation='equipment'
          onClick={() => onEquipmentClick(card)}
        />
      ))}
    </div>
  );
};
