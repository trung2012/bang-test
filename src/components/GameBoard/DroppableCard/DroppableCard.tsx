import React from 'react';
import { Droppable } from 'react-dragtastic';
import { hasActiveDynamite, ICard, isJailed, RobbingType } from '../../../game';
import { Card } from '../Card';
import './DroppableCard.scss';
import { useErrorContext, useGameContext } from '../../../context';
import { cardsWhichTargetCards, delayBetweenActions } from '../../../game';
import { calculateDistanceFromTarget } from '../../../utils';
import styled from '@emotion/styled';
import { IDraggableCardData } from '../DraggableCard/DraggableCard.types';
interface IDroppableCardProps {
  card: ICard;
  index: number;
  isFacedUp: boolean;
  playerId: string;
  cardLocation: RobbingType;
  onClick?: () => void;
}

export type CardContainerProps = {
  index: number;
  isCurrentPlayer: boolean;
};

export const DroppableCardContainer = styled.div<{ isCurrentPlayer: boolean }>`
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  &:hover {
    transform: ${props => `${props.isCurrentPlayer ? 'translateY(-3rem)' : 'translateY(2rem)'} `};
    z-index: 11;
  }
`;

export const DroppableCardComponent: React.FC<IDroppableCardProps> = ({
  card,
  index,
  isFacedUp,
  playerId,
  cardLocation,
  onClick,
}) => {
  const { G, playersInfo, moves, playerID } = useGameContext();
  const { setError, setNotification } = useErrorContext();
  const { players } = G;

  const onDrop = (data: IDraggableCardData) => {
    if (!playersInfo?.length) throw Error('Something went wrong');
    const { sourceCard, sourceCardIndex, sourcePlayerId, sourceCardLocation } = data;
    const sourcePlayer = players[sourcePlayerId];

    if (players[playerId].hp <= 0) return;

    if (hasActiveDynamite(sourcePlayer)) {
      setError('Please draw for dynamite');
      return;
    }

    if (isJailed(sourcePlayer)) {
      setError('Please draw for jail');
      return;
    }

    if (sourceCardLocation === 'green' && sourceCard.timer !== undefined && sourceCard.timer > 0) {
      setError('You cannot play this card right now');
      return;
    }

    const distanceBetweenPlayers = calculateDistanceFromTarget(
      players,
      playersInfo,
      sourcePlayerId,
      playerId
    );

    if (sourceCard.needsDiscard && sourceCard.isTargeted) {
      moves.playCard(sourceCardIndex, playerId, sourceCardLocation);
      moves.makePlayerDiscardToPlay(sourceCard.name, playerId);
      setNotification('Please click on a card to discard and continue');
      return;
    }

    if (sourcePlayer.actionRange < distanceBetweenPlayers) {
      setError('Target player is out of range');
      return;
    }
    if (!cardsWhichTargetCards.includes(sourceCard.name)) return;

    moves.playCard(sourceCardIndex, playerId, sourceCardLocation);

    setTimeout(() => {
      const moveName = sourceCard.name.replace(' ', '').toLowerCase();
      const robbingType: RobbingType = cardLocation;
      moves.clearCardsInPlay(playerId);
      if (moves[moveName]) {
        moves[moveName](playerId, index, robbingType);
      }
    }, delayBetweenActions);
  };

  return (
    <Droppable accepts='card' onDrop={onDrop}>
      {droppableDragState => (
        <DroppableCardContainer
          isCurrentPlayer={playerID === playerId}
          className='droppable-card'
          {...droppableDragState.events}
        >
          <Card card={card} isFacedUp={isFacedUp} onClick={onClick} />
        </DroppableCardContainer>
      )}
    </Droppable>
  );
};

export const DroppableCard = React.memo(DroppableCardComponent);
