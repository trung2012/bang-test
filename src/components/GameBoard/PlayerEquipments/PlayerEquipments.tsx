import styled from '@emotion/styled';
import React from 'react';
import { useGameContext } from '../../../context';
import { ICard } from '../../../game/types';
import { CardContainerProps, DroppableCard } from '../DroppableCard';
import './PlayerEquipments.scss';

interface IPlayerEquipments {
  playerId: string;
  equipments: ICard[];
}

const EquipmentCardContainer = styled.div<CardContainerProps>`
  position: absolute;
  transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
  left: ${props => `${props.index * 70}px`};
  transform: translateX(-50%);

  &:hover {
    transform: ${props =>
      `translateX(-50%) ${props.isCurrentPlayer ? 'translateY(-40px)' : 'translateY(40px)'}`};
  }
`;

export const PlayerEquipments: React.FC<IPlayerEquipments> = ({ playerId, equipments }) => {
  const { playerID } = useGameContext();
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
          />
        </EquipmentCardContainer>
      ))}
    </div>
  );
};
