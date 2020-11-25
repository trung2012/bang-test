import React from 'react';
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
  onClick?: () => void;
}

export type CardContainerProps = {
  index: number;
  isCurrentPlayer: boolean;
};

export const DroppableCard: React.FC<IDroppableCardProps> = React.memo(
  ({ card, index, isFacedUp, playerId, cardLocation, onClick }) => {
    const { G, playersInfo, moves } = useGameContext();
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
        moves.clearCardsInPlay(playerId);

        const moveName = sourceCard.name.replace(' ', '').toLowerCase();
        const robbingType: RobbingType = cardLocation;
        if (moves[moveName]) {
          moves[moveName](playerId, index, robbingType);
        }
      }, delayBetweenActions);
    };

    return (
      <Droppable accepts='card' onDrop={onDrop}>
        {droppableDragState => (
          <div className='droppable-card' {...droppableDragState.events}>
            <Card card={card} isFacedUp={isFacedUp} onClick={onClick} />
          </div>
        )}
      </Droppable>
    );
  }
);
