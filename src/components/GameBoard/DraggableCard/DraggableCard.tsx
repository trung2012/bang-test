import React, { Dispatch, Fragment, SetStateAction, useCallback, useState } from 'react';
import classnames from 'classnames';
import { Draggable, DragComponent } from 'react-dragtastic';
import { useCardsContext, useErrorContext, useGameContext } from '../../../context';
import {
  canPlayCardToReact,
  delayBetweenActions,
  hasActiveDynamite,
  isJailed,
  RobbingType,
  stageNames,
} from '../../../game';
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
  const isClientPlayer = playerID === playerId;
  const isCardDisabled = G.players[ctx.currentPlayer].character.name === 'belle star';
  // || (!!activeStage &&
  //   reactionRequired.cardNeeded.length > 0 &&
  //   G.players[playerId].character.name !== 'calamity janet' &&
  //   !reactionRequired.cardNeeded.includes(card.name));
  const isSelected =
    (cardLocation === 'hand' && selectedCards.hand.includes(index)) ||
    (cardLocation === 'green' && selectedCards.green.includes(index));
  const selectedCardsTotalLength = selectedCards.hand.length + selectedCards.green.length;

  const onDiscardClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    const targetPlayer = players[playerId];
    if (playerID !== playerId) return;
    if (
      targetPlayer.character.name !== 'sid ketchum' &&
      (!ctx.activePlayers || ctx.activePlayers[playerId] !== stageNames.discard)
    ) {
      setError('You can only discard cards at the end of your turn');
      return;
    }

    moves.discardFromHand(playerId, index);
  };

  const onCardClick = () => {
    if (!isActive || playerID === null) return;

    const targetPlayer = players[playerId];
    const sourcePlayer = players[playerID];
    const isTargetPlayerTurn = playerId === playerID;

    // Process moves when source player is different from target player

    if (
      playerID !== playerId &&
      cardLocation === 'green' &&
      sourcePlayer.character.name === 'pat brennan' &&
      sourcePlayer.cardDrawnAtStartLeft >= 2 &&
      (!ctx.activePlayers || !ctx.activePlayers[sourcePlayer.id])
    ) {
      if (hasActiveDynamite(sourcePlayer)) {
        setError('Please draw for dynamite');
        return;
      }

      if (isJailed(sourcePlayer)) {
        setError('Please draw for jail');
        return;
      }

      moves.patBrennanEquipmentDraw(playerId, index, cardLocation);
      return;
    }

    if (ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer] === stageNames.ragtime) {
      moves.panic(playerId, index, cardLocation);
      return;
    }

    // Process moves when source player is target player (current turn)
    if (!isTargetPlayerTurn) return;

    if (activeStage && reactionRequired.cardNeeded.length && selectedCards && setSelectedCards) {
      if (
        !isSelected &&
        selectedCardsTotalLength === reactionRequired.quantity - 1 &&
        canPlayCardToReact(reactionRequired, targetPlayer, card)
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
            (targetPlayer.character.name === 'calamity janet' &&
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

    if (hasActiveDynamite(targetPlayer)) {
      setError('Please draw for dynamite');
      return;
    }

    if (isJailed(targetPlayer)) {
      setError('Please draw for jail');
      return;
    }

    if (
      ctx.activePlayers &&
      ctx.activePlayers[playerID] === stageNames.joseDelgadoDiscard &&
      targetPlayer.character.name === 'jose delgado'
    ) {
      if (card.type !== 'equipment') {
        setError('Please choose a blue card to discard');
        return;
      }
    }

    if (
      ctx.activePlayers &&
      (ctx.activePlayers[playerID] === stageNames.discardToPlayCard ||
        ctx.activePlayers[playerID] === stageNames.joseDelgadoDiscard)
    ) {
      if (cardLocation !== 'hand') {
        setError('You can only discard from your hand');
        return;
      }

      moves.discardFromHand(playerID, index);

      if (G.reactionRequired.moveToPlayAfterDiscard) {
        const moveName = G.reactionRequired.moveToPlayAfterDiscard.replace(' ', '').toLowerCase();

        if (!moves[moveName]) {
          throw Error('No move no target');
        }

        if (G.reactionRequired.moveArgs) {
          moves[moveName](...G.reactionRequired.moveArgs);
        } else {
          moves[moveName]();
        }

        return;
      }
    }

    if (card.type === 'green' && cardLocation === 'hand') {
      if (targetPlayer.equipmentsGreen.find(equipment => equipment.name === card.name)) {
        setError('You cannot equip something more than once');
        return;
      }

      moves.equipGreenCard(index);
      return;
    }

    if (card.isTargeted) return;

    // Equip
    if (card.type === 'equipment') {
      if (targetPlayer.equipments.find(equipment => equipment.name === card.name)) {
        setError('You cannot equip something more than once');
        return;
      }

      moves.equip(index);
      return;
    }

    // Play card
    if (card.needsDiscard && targetPlayer.hand.length < 2) {
      setError(`You do not have enough cards to play this right now`);
      return;
    }

    if (cardLocation === 'green' && card.timer !== undefined && card.timer > 0) {
      setError('You cannot play this card right now');
      return;
    }

    moves.playCard(index, playerID, cardLocation);

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

  const onContextMenu = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (cardLocation === 'hand') {
        setShowCardOptions(true);
      }
    },
    [cardLocation]
  );

  return (
    <Fragment>
      <Draggable
        id={`${card.id}`}
        type='card'
        data={{
          sourceCard: card,
          sourceCardIndex: index,
          sourcePlayerId: playerID,
          sourceCardLocation: cardLocation,
        }}
      >
        {draggableDragState => (
          <DraggableCardContainer
            className={classnames({
              'draggable-card': !isSelected,
              'draggable-card-selected': isSelected && playerID === playerId,
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
            <Card
              card={card}
              isFacedUp={isFacedUp}
              disabled={isCardDisabled}
              isDragComponent={true}
            />
          </DragComponentContainer>
        )}
      </DragComponent>
    </Fragment>
  );
};

export const DraggableCard = React.memo(DraggableCardComponent);
