import React, { Fragment, useState } from 'react';
import { Draggable, DragComponent } from 'react-dragtastic';
import { useGameContext } from '../../../context';
import { ICard } from '../../../game/types';
import { MoreOptions } from '../../shared';
import { Card } from '../Card';
import './DraggableCard.scss';

interface IDraggableCardProps {
  card: ICard;
  index: number;
  isFacedUp: boolean;
  playerId: string;
}

export const DraggableCard: React.FC<IDraggableCardProps> = React.memo(
  ({ card, index, isFacedUp, playerId }) => {
    const { moves } = useGameContext();
    const [showCardOptions, setShowCardOptions] = useState(false);

    return (
      <Fragment>
        <Draggable id={`${card.id}`} type='card' data={{ cardID: card.id }}>
          {draggableDragState => (
            <div
              className='draggable-card'
              {...draggableDragState.events}
              style={{
                display:
                  draggableDragState.isDragging &&
                  draggableDragState.currentlyDraggingId === card.id
                    ? 'none'
                    : 'block',
                left: `${50 + index * 70}px`,
              }}
            >
              <Card
                card={card}
                isFacedUp={isFacedUp}
                onContextMenu={(event: React.MouseEvent<HTMLDivElement>) => {
                  event.preventDefault();
                  setShowCardOptions(true);
                }}
              />
              {showCardOptions && (
                <MoreOptions dismiss={() => setShowCardOptions(false)}>
                  <div
                    className='more-options-item'
                    onClick={event => {
                      event.stopPropagation();
                      moves.discardFromHand(playerId, index);
                    }}
                  >
                    Discard
                  </div>
                </MoreOptions>
              )}
            </div>
          )}
        </Draggable>
        <DragComponent for={`${card.id}`}>
          {draggableDragState => (
            <div className='card-dragging'>
              <Card
                card={card}
                style={{
                  position: 'fixed',
                  left: draggableDragState.isDragging
                    ? draggableDragState.x
                    : draggableDragState.startingX,
                  top: draggableDragState.isDragging
                    ? draggableDragState.y
                    : draggableDragState.startingY,
                  zIndex: 100,
                  transform: 'translate(-50%, -50%)',
                }}
                isFacedUp={isFacedUp}
              />
            </div>
          )}
        </DragComponent>
      </Fragment>
    );
  }
);
