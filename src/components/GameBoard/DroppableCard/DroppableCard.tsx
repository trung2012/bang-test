import React from 'react';
import styled from '@emotion/styled';
import { Droppable } from 'react-dragtastic';
import { ICard, RobbingType } from '../../../game/types';
import { Card } from '../Card';
import './DroppableCard.scss';
import { useErrorContext, useGameContext } from '../../../context';
import { cardsWhichTargetCards, delayBetweenActions } from '../../../game/constants';
import { calculateDistanceFromTarget } from '../../../utils';

interface IDroppableCardProps {
  card: ICard;
  index: number;
  isFacedUp: boolean;
  playerId: string;
  cardLocation: RobbingType;
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
  ({ card, index, isFacedUp, playerId, cardLocation }) => {
    const { playerID, G, playersInfo, moves } = useGameContext();
    const { setError } = useErrorContext();
    const { players } = G;

    const onDrop = (data: {
      sourceCard: ICard;
      sourceCardIndex: number;
      sourcePlayerId: string;
    }) => {
      if (!playersInfo?.length) throw Error('Something went wrong');
      const { sourceCard, sourceCardIndex, sourcePlayerId } = data;
      if (sourcePlayerId === playerId) return;

      const sourcePlayer = players[sourcePlayerId];
      const distanceBetweenPlayers = calculateDistanceFromTarget(
        players,
        playersInfo,
        sourcePlayerId,
        playerId
      );
      if (sourcePlayer.actionRange < distanceBetweenPlayers) {
        setError('Target player is out of range');
        return;
      }
      if (!cardsWhichTargetCards.includes(sourceCard.name)) return;
      moves.playCard(sourceCardIndex, playerId);

      setTimeout(() => {
        moves.clearCardsInPlay(playerId);
        setTimeout(() => {
          const moveName = sourceCard.name.replace(' ', '').toLowerCase();
          const robbingType: RobbingType = cardLocation;
          if (moves[moveName]) {
            moves[moveName](playerId, index, robbingType);
          }
        }, 0);
      }, 0);
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
