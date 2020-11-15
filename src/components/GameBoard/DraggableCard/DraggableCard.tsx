import styled from '@emotion/styled';
import { INVALID_MOVE } from 'boardgame.io/core';
import React, { Fragment, useCallback, useState } from 'react';
import { Draggable, DragComponent } from 'react-dragtastic';
import { useAnimationContext, useErrorContext, useGameContext } from '../../../context';
import { delayBetweenActions } from '../../../game/constants';
import { ICard } from '../../../game/types';
import { MoreOptions } from '../../shared';
import { Card } from '../Card';
import './DraggableCard.scss';
import { IDragComponentDragState, IDraggableDragState } from './DraggableCard.types';

interface IDraggableCardProps {
  card: ICard;
  index: number;
  isFacedUp: boolean;
  playerId: string;
}

const DraggableCardContainer = styled.div<{
  draggableDragState: IDraggableDragState;
  cardId: string;
  index: number;
}>(
  props => ({
    display:
      props.draggableDragState.isDragging &&
      props.draggableDragState.currentlyDraggingId === props.cardId
        ? 'none'
        : 'block',
  }),
  props => ({
    left: `${50 + props.index * 70}px`,
  })
);

const DragComponentContainer = styled.div<{
  draggableDragState: IDragComponentDragState;
}>(
  {
    position: 'fixed',
    zIndex: 100,
    transform: 'translate(-50%, -50%)',
  },
  ({ draggableDragState }) => ({
    left: draggableDragState.isDragging ? draggableDragState.x : draggableDragState.startingX,
    top: draggableDragState.isDragging ? draggableDragState.y : draggableDragState.startingY,
  })
);

export const DraggableCard: React.FC<IDraggableCardProps> = React.memo(
  ({ card, index, isFacedUp, playerId }) => {
    const { moves, playerID, isActive, G } = useGameContext();
    const { setLeft, setTop, setAnimatedCardId } = useAnimationContext();
    const { setError } = useErrorContext();
    const [showCardOptions, setShowCardOptions] = useState(false);

    const onCardClick = () => {
      if (!isActive) return;
      if (card.name === 'jail' || card.isTargeted) return;
      const currentPlayer = G.players[playerId];

      const cardEl = document.getElementById(CSS.escape(card.id));
      console.log(cardEl);
      if (cardEl) {
        const oldPosition = cardEl.getBoundingClientRect();
        setAnimatedCardId(card.id);
        setLeft(oldPosition.left);
        setTop(oldPosition.top);
      }

      if (card.type === 'equipment') {
        if (currentPlayer.equipments.find(equipment => equipment.name === card.name)) {
          setError('You cannot equip something more than once');
          return INVALID_MOVE;
        }

        moves.equip(index);
        return;
      }

      moves.playCard(index, playerID);

      setTimeout(() => {
        moves.clearCardsInPlay(playerID);
        const moveName = card.name.replace(' ', '').toLowerCase();
        if (moves[moveName]) {
          moves[moveName]();
        }
      }, delayBetweenActions);
    };

    const onContextMenu = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      setShowCardOptions(true);
    }, []);

    return (
      <Fragment>
        <Draggable
          id={`${card.id}`}
          type='card'
          data={{ sourceCard: card, sourceCardIndex: index, sourcePlayerId: playerID }}
        >
          {draggableDragState => (
            <DraggableCardContainer
              className='draggable-card'
              {...draggableDragState.events}
              draggableDragState={draggableDragState}
              cardId={card.id}
              index={index}
            >
              <Card
                card={card}
                isFacedUp={isFacedUp}
                onContextMenu={onContextMenu}
                onClick={onCardClick}
              />
              {showCardOptions && (
                <MoreOptions dismiss={() => setShowCardOptions(false)}>
                  <div
                    className='more-options-item'
                    onClick={event => {
                      event.stopPropagation();
                      const cardEl = document.getElementById(CSS.escape(card.id));
                      if (cardEl) {
                        const oldPosition = cardEl.getBoundingClientRect();
                        setAnimatedCardId(card.id);
                        setLeft(oldPosition.left);
                        setTop(oldPosition.top);
                      }
                      moves.discardFromHand(playerId, index);
                    }}
                  >
                    Discard
                  </div>
                </MoreOptions>
              )}
            </DraggableCardContainer>
          )}
        </Draggable>
        <DragComponent for={`${card.id}`}>
          {draggableDragState => (
            <DragComponentContainer
              className='card-dragging'
              draggableDragState={draggableDragState}
            >
              <Card card={card} isFacedUp={isFacedUp} />
            </DragComponentContainer>
          )}
        </DragComponent>
      </Fragment>
    );
  }
);
