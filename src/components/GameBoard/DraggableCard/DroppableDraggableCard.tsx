import styled from '@emotion/styled';
import React from 'react';
import { Droppable } from 'react-dragtastic';
import { DraggableCard } from '.';
import { useGameContext, useErrorContext } from '../../../context';
import {
  cardsWhichTargetCards,
  RobbingType,
  delayBetweenActions,
  ICard,
  cardsWithNoRangeLimit,
} from '../../../game';
import { calculateDistanceFromTarget } from '../../../utils';
import { IDraggableCardData } from './DraggableCard.types';

interface IDroppableDraggableCardProps {
  playerId: string;
  card: ICard;
  index: number;
}

export const DroppableDraggableCardContainer = styled.div<{ isCurrentPlayer: boolean }>`
  &:hover {
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    transform: ${props => `${props.isCurrentPlayer ? 'translateY(-3rem)' : 'translateY(2rem)'} `};
    z-index: 11;
  }
`;

export const DroppableDraggableCard: React.FC<IDroppableDraggableCardProps> = ({
  card,
  index,
  playerId,
}) => {
  const { G, ctx, moves, playerID } = useGameContext();
  const { setError } = useErrorContext();
  const { players } = G;
  const cardLocation: RobbingType = 'green';

  const onDrop = (data: IDraggableCardData) => {
    const { sourceCard, sourceCardIndex, sourcePlayerId, sourceCardLocation } = data;

    if (players[playerId].hp <= 0) return;

    const sourcePlayer = players[sourcePlayerId];
    const distanceBetweenPlayers = calculateDistanceFromTarget(
      players,
      ctx.playOrder,
      sourcePlayerId,
      playerId
    );

    if (!cardsWhichTargetCards.includes(sourceCard.name)) return;

    if (
      cardsWithNoRangeLimit.includes(sourceCard.name) ||
      sourcePlayer.actionRange >= distanceBetweenPlayers
    ) {
      moves.playCard(sourceCardIndex, playerId, sourceCardLocation);

      setTimeout(() => {
        const moveName = sourceCard.name.replace(' ', '').toLowerCase();
        const robbingType: RobbingType = cardLocation;
        moves.clearCardsInPlay(playerId);
        if (moves[moveName]) {
          moves[moveName](playerId, index, robbingType);
        }
      }, delayBetweenActions);
    } else {
      setError('Target player is out of range');
      return;
    }
  };

  return (
    <Droppable accepts='card' onDrop={onDrop}>
      {droppableDragState => (
        <DroppableDraggableCardContainer
          isCurrentPlayer={playerID === playerId}
          className='droppable-card'
          {...droppableDragState.events}
        >
          <DraggableCard
            card={card}
            index={index}
            isFacedUp={true}
            playerId={playerId}
            cardLocation={cardLocation}
          />
        </DroppableDraggableCardContainer>
      )}
    </Droppable>
  );
};
