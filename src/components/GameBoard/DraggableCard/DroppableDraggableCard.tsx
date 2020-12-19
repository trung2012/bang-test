import React from 'react';
import { Droppable } from 'react-dragtastic';
import { DraggableCard } from '.';
import { useGameContext, useErrorContext } from '../../../context';
import { cardsWhichTargetCards, RobbingType, delayBetweenActions, ICard } from '../../../game';
import { calculateDistanceFromTarget } from '../../../utils';
import { DroppableCardContainer } from '../DroppableCard';

interface IDroppableDraggableCardProps {
  playerId: string;
  card: ICard;
  index: number;
}

export const DroppableDraggableCard: React.FC<IDroppableDraggableCardProps> = ({
  card,
  index,
  playerId,
}) => {
  const { G, playersInfo, moves, playerID } = useGameContext();
  const { setError } = useErrorContext();
  const { players } = G;

  const onDrop = (data: any) => {
    if (!playersInfo?.length) throw Error('Something went wrong');
    const { sourceCard, sourceCardIndex, sourcePlayerId } = data;

    if (players[playerId].hp <= 0) return;

    const sourcePlayer = players[sourcePlayerId];
    const distanceBetweenPlayers = calculateDistanceFromTarget(
      players,
      playersInfo,
      sourcePlayerId,
      playerId
    );
    if (sourcePlayer.actionRange < distanceBetweenPlayers && sourceCard.name !== 'cat balou') {
      setError('Target player is out of range');
      return;
    }
    if (!cardsWhichTargetCards.includes(sourceCard.name)) return;
    moves.playCard(sourceCardIndex, playerId);

    setTimeout(() => {
      const moveName = sourceCard.name.replace(' ', '').toLowerCase();
      const robbingType: RobbingType = 'green';
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
          <DraggableCard
            key={`${card.id}-${index}`}
            card={card}
            index={index}
            isFacedUp={true}
            playerId={playerId}
            cardLocation='green'
          />
        </DroppableCardContainer>
      )}
    </Droppable>
  );
};
