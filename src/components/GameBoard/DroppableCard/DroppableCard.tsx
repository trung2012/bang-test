import React from 'react';
import styled from '@emotion/styled';
import { Droppable } from 'react-dragtastic';
import { ICard } from '../../../game/types';
import { Card } from '../Card';
import './DroppableCard.scss';
import { useGameContext } from '../../../context';

interface IDroppableCardProps {
  card: ICard;
  index: number;
  isFacedUp: boolean;
  playerId: string;
}

type CardContainerProps = {
  index: number;
  isCurrentPlayer: boolean;
};

const CardContainer = styled.div<CardContainerProps>`
  position: absolute;
  transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
  left: ${props => `${props.index * 70}px`};
  transform: translateX(-50%);

  &:hover {
    transform: ${props =>
      `translateX(-50%) ${props.isCurrentPlayer ? 'translateY(-40px)' : 'translateY(40px)'}`};
  }
`;

export const DroppableCard: React.FC<IDroppableCardProps> = React.memo(
  ({ card, index, isFacedUp, playerId }) => {
    const { playerID } = useGameContext();

    const onDrop = (data: any) => {
      console.log({ ...data, destPlayerId: playerId, destCardIndex: index });
    };

    return (
      <Droppable accepts='card' onDrop={onDrop}>
        {droppableDragState => (
          <CardContainer
            className='droppable-card'
            {...droppableDragState.events}
            index={index}
            isCurrentPlayer={playerId === playerID}
          >
            <Card card={card} isFacedUp={isFacedUp} />
          </CardContainer>
        )}
      </Droppable>
    );
  }
);
