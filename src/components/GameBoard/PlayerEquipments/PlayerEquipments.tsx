import styled from '@emotion/styled';
import React from 'react';
import { useGameContext } from '../../../context';
import { delayBetweenActions, stageNames } from '../../../game/constants';
import { ICard } from '../../../game/types';
import { CardContainerProps, DroppableCard } from '../DroppableCard';
import './PlayerEquipments.scss';

interface IPlayerEquipments {
  playerId: string;
  equipments: ICard[];
}

const EquipmentCardContainer = styled.div<CardContainerProps>`
  position: absolute;
  left: ${props => `${props.index * 70}px`};
`;

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
        moves.barrelResult(playerID);
      }, delayBetweenActions);
    }
  };

  if (!equipments?.length) {
    return null;
  }

  return (
    <div className='player-equipments'>
      {equipments.map((card, index) => (
        <EquipmentCardContainer key={card.id} index={index} isCurrentPlayer={playerID === playerId}>
          <DroppableCard
            card={card}
            index={index}
            isFacedUp={true}
            playerId={playerId}
            cardLocation='equipment'
            onClick={() => onEquipmentClick(card)}
          />
        </EquipmentCardContainer>
      ))}
    </div>
  );
};
