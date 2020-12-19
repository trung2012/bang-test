import React, { Dispatch, Fragment, SetStateAction, useCallback, useState } from 'react';
import classnames from 'classnames';
import { Draggable, DragComponent } from 'react-dragtastic';
import { useCardsContext, useErrorContext, useGameContext } from '../../../context';
import { delayBetweenActions, RobbingType, stageNames } from '../../../game';
import { ICard } from '../../../game';
import { MoreOptions } from '../../shared';
import { Card } from '../Card';
import './DraggableCard.scss';
import { DraggableCardContainer, DragComponentContainer } from './DraggableCard.styles';

interface IDraggableCardProps {
  card: ICard;
  index: number;
  isFacedUp: boolean;
  playerId: string;
  selectedCards?: number[];
  setSelectedCards?: Dispatch<SetStateAction<number[]>>;
  cardLocation: RobbingType;
}

const DraggableCardComponent: React.FC<IDraggableCardProps> = ({
  card,
  index,
  isFacedUp,
  playerId,
  cardLocation,
}) => {
  const { moves, playerID, isActive, G, ctx } = useGameContext();
  const { selectedCards, setSelectedCards } = useCardsContext();
  const { activeStage, players, reactionRequired } = G;
  const { setError, setNotification } = useErrorContext();
  const [showCardOptions, setShowCardOptions] = useState(false);
  const isCardDisabled =
    !!activeStage &&
    !reactionRequired.cardNeeded.length &&
    !reactionRequired.cardNeeded.includes(card.name);
  const isSelected =
    (cardLocation === 'hand' && selectedCards.hand.includes(index)) ||
    (cardLocation === 'green' && selectedCards.green.includes(index));
  const selectedCardsTotalLength = selectedCards.hand.length + selectedCards.green.length;
  const isClientPlayer = playerID === playerId;

  const onDiscardClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    const currentPlayer = players[playerId];
    if (playerID !== playerId) return;
    if (
      currentPlayer.character.name !== 'sid ketchum' &&
      (!ctx.activePlayers || ctx.activePlayers[playerId] !== stageNames.discard)
    ) {
      setError('You can only discard cards at the end of your turn');
      return;
    }

    moves.discardFromHand(playerId, index);
  };

  const onCardClick = () => {
    const currentPlayer = players[playerId];

    if (!isActive || playerID !== playerId) return;

    if (ctx.activePlayers && ctx.activePlayers[playerID] === stageNames.discardToPlayCard) {
      moves.discardFromHand(playerID, index);

      if (G.reactionRequired.cardToPlayAfterDiscard) {
        const moveName = G.reactionRequired.cardToPlayAfterDiscard.replace(' ', '').toLowerCase();

        if (!moves[moveName] || G.reactionRequired.targetPlayerId === undefined) {
          throw Error('No move no target');
        }

        moves[moveName](G.reactionRequired.targetPlayerId);
        return;
      }
    }

    if (activeStage && reactionRequired.cardNeeded.length && selectedCards && setSelectedCards) {
      if (
        !isSelected &&
        selectedCardsTotalLength === reactionRequired.quantity - 1 &&
        (reactionRequired.cardNeeded.includes(card.name) ||
          (currentPlayer.character.name === 'calamity janet' &&
            ['bang', 'missed'].includes(card.name) &&
            reactionRequired.cardNeeded.some(cardName => ['bang', 'missed'].includes(cardName))))
      ) {
        if (cardLocation === 'hand') {
          moves.playCardToReact(
            {
              hand: [...selectedCards.hand, index],
              green: selectedCards.green,
            },
            playerID
          );
        } else {
          moves.playCardToReact(
            {
              hand: selectedCards.hand,
              green: [...selectedCards.green, index],
            },
            playerID
          );
        }

        setSelectedCards({
          hand: [],
          green: [],
          equipment: [],
        });

        return;
      }

      if (selectedCardsTotalLength < reactionRequired.quantity) {
        if (isSelected) {
          if (cardLocation === 'hand') {
            setSelectedCards(selectedCards => ({
              hand: selectedCards.hand.filter(cardIndex => cardIndex !== index),
              green: selectedCards.green,
              equipment: [],
            }));
          } else {
            setSelectedCards(selectedCards => ({
              hand: selectedCards.hand,
              green: selectedCards.green.filter(cardIndex => cardIndex !== index),
              equipment: [],
            }));
          }
        } else {
          if (
            reactionRequired.cardNeeded.includes(card.name) ||
            (currentPlayer.character.name === 'calamity janet' &&
              ['bang', 'missed'].includes(card.name) &&
              reactionRequired.cardNeeded.some(cardName => ['bang', 'missed'].includes(cardName)))
          ) {
            if (cardLocation === 'hand') {
              setSelectedCards({
                hand: [...selectedCards.hand, index],
                green: selectedCards.green,
                equipment: [],
              });
            } else {
              setSelectedCards({
                hand: selectedCards.hand,
                green: [...selectedCards.green, index],
                equipment: [],
              });
            }
          }
        }
        return;
      }
    }

    if (card.type === 'green' && cardLocation === 'hand') {
      if (currentPlayer.equipmentsGreen.find(equipment => equipment.name === card.name)) {
        setError('You cannot equip something more than once');
        return;
      }

      moves.equipGreenCard(index);
      return;
    }

    if (card.isTargeted) return;

    // Equip
    if (card.type === 'equipment') {
      if (currentPlayer.equipments.find(equipment => equipment.name === card.name)) {
        setError('You cannot equip something more than once');
        return;
      }

      moves.equip(index);
      return;
    }

    // Play card
    if (card.needsDiscard && currentPlayer.hand.length < 2) {
      setError(`You do not have enough cards to play this right now`);
      return;
    }

    if (card.timer !== undefined && card.timer > 0 && card.name !== 'dynamite') {
      setError('You cannot play this card right now');
      return;
    }

    moves.playCard(index, playerID);

    if (card.needsDiscard) {
      moves.makePlayerDiscardToPlay(card.name, playerID);
      setNotification('Please click on a card to discard and continue');
      return;
    }

    const moveName = card.name.replace(' ', '').toLowerCase();

    if (!moves[moveName]) {
      throw Error('Move errror: No such move');
    }

    moves[moveName]();

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
            isClientPlayer={isClientPlayer}
            cardLocation={cardLocation}
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
