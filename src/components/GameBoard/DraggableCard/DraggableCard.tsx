import React, { Dispatch, Fragment, SetStateAction, useCallback, useState } from 'react';
import styled from '@emotion/styled';
import classnames from 'classnames';
import { INVALID_MOVE } from 'boardgame.io/core';
import { Draggable, DragComponent } from 'react-dragtastic';
import { useErrorContext, useGameContext } from '../../../context';
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
  selectedCards?: number[];
  setSelectedCards?: Dispatch<SetStateAction<number[]>>;
}

const DraggableCardContainer = styled.div<{
  draggableDragState: IDraggableDragState;
  cardId: string;
  index: number;
}>(props => ({
  display:
    props.draggableDragState.isDragging &&
    props.draggableDragState.currentlyDraggingId === props.cardId
      ? 'none'
      : 'block',
}));

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

const DraggableCardComponent: React.FC<IDraggableCardProps> = ({
  card,
  index,
  isFacedUp,
  playerId,
  selectedCards,
  setSelectedCards,
}) => {
  const { moves, playerID, isActive, G, ctx } = useGameContext();
  const { activeStage, players, reactionRequired } = G;
  const { setError } = useErrorContext();
  const [showCardOptions, setShowCardOptions] = useState(false);
  const isCardDisabled =
    !!activeStage && !!reactionRequired.cardNeeded && card.name !== reactionRequired.cardNeeded;
  const isSelected = selectedCards?.includes(index);

  const onDiscardClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    if (playerID !== playerId) return;
    const currentPlayer = players[playerId];

    if (!isActive) {
      if (currentPlayer.character.name === 'sid ketchum') {
        moves.discardFromHand(playerId, index);
      }
      return;
    }

    moves.discardFromHand(playerId, index);
  };

  const onCardClick = () => {
    const currentPlayer = players[playerId];

    if (!isActive || playerID !== playerId) return;

    if (ctx.phase === 'suddenDeath' && card.name === 'beer') {
      setError('Beer cannot be played when there are 2 players left');
      return;
    }

    if (activeStage && reactionRequired.cardNeeded && selectedCards && setSelectedCards) {
      if (
        !isSelected &&
        selectedCards.length === reactionRequired.quantity - 1 &&
        (card.name === reactionRequired.cardNeeded ||
          (currentPlayer.character.name === 'calamity janet' &&
            ['bang', 'missed'].includes(card.name) &&
            ['bang', 'missed'].includes(reactionRequired.cardNeeded)))
      ) {
        moves.playCardToReact([...selectedCards, index], playerID);
        setSelectedCards([]);
        return;
      }

      if (selectedCards.length < reactionRequired.quantity) {
        if (isSelected) {
          setSelectedCards(cards => cards.filter(cardIndex => cardIndex !== index));
        } else {
          if (
            card.name === reactionRequired.cardNeeded ||
            (currentPlayer.character.name === 'calamity janet' &&
              ['bang', 'missed'].includes(card.name) &&
              ['bang', 'missed'].includes(reactionRequired.cardNeeded))
          ) {
            setSelectedCards(cards => [...cards, index]);
          }
        }
        return;
      }
    }

    if (card.name === 'jail' || card.isTargeted) return;

    if (card.type === 'equipment') {
      if (currentPlayer.equipments.find(equipment => equipment.name === card.name)) {
        setError('You cannot equip something more than once');
        return INVALID_MOVE;
      }

      moves.equip(index);
      return;
    }

    moves.playCard(index, playerID);
    const moveName = card.name.replace(' ', '').toLowerCase();
    if (moves[moveName]) {
      moves[moveName]();
    }

    setTimeout(() => {
      moves.clearCardsInPlay(playerID);
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
            className={classnames({
              'draggable-card': !isSelected,
              'draggable-card-selected': isSelected,
            })}
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
              disabled={isCardDisabled}
            />
            {showCardOptions && (
              <MoreOptions dismiss={() => setShowCardOptions(false)}>
                <div className='more-options-item' onClick={e => onDiscardClick(e)}>
                  Discard
                </div>
              </MoreOptions>
            )}
          </DraggableCardContainer>
        )}
      </Draggable>
      <DragComponent for={`${card.id}`}>
        {draggableDragState => (
          <DragComponentContainer className='card-dragging' draggableDragState={draggableDragState}>
            <Card card={card} isFacedUp={isFacedUp} disabled={isCardDisabled} />
          </DragComponentContainer>
        )}
      </DragComponent>
    </Fragment>
  );
};

export const DraggableCard = React.memo(DraggableCardComponent);
