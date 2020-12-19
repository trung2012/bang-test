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
  const { G, ctx, playerID, moves } = useGameContext();

  const onEquipmentClick = (equipmentCard: ICard, index: number) => {
    const player = G.players[playerId];
    const sourcePlayer = G.players[ctx.currentPlayer];
    if (sourcePlayer.character.name === 'pat brennan' && sourcePlayer.cardDrawnAtStartLeft >= 2) {
      moves.patBrennanEquipmentDraw(playerId, index, 'equipment');
      return;
    }

    if (playerID !== playerId || equipmentCard.name !== 'barrel' || player.barrelUseLeft <= 0) {
      return;
    }

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
          onClick={() => onEquipmentClick(card, index)}
        />
      ))}
    </div>
  );
};
