import { keyframes } from '@emotion/core';
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { useErrorContext, useGameContext } from '../../../context';
import { stageNames } from '../../../game';
import { ICard } from '../../../game';
import { hasDynamite, isJailed } from '../../../game/original/utils';
import { DraggableCard } from '../DraggableCard';
import { CardContainerProps, DroppableCard } from '../DroppableCard';
import './PlayerHand.scss';

interface IPlayerCardsProps {
  playerId: string;
  hand: ICard[];
}

export const cardShuffleAnimation = (destinationTransform: string) =>
  keyframes`
  from {
    transform: none;
  }

  to {
    transform: ${destinationTransform};
  }
`;

const DroppableCardContainer = styled.div<
  CardContainerProps & { numCards: number; maxCardRotationAngle: number; shouldAnimate: boolean }
>`
  position: absolute;
  animation: ${props =>
      props.shouldAnimate
        ? cardShuffleAnimation(
            `rotate(${
              -props.maxCardRotationAngle / 2 +
              props.index * (props.maxCardRotationAngle / props.numCards)
            }deg)`
          )
        : 'none'}
    0.3s cubic-bezier(0.075, 0.82, 0.165, 1) forwards;
  transform-origin: center top;

  &:hover {
    transform: ${props =>
      `rotate(${
        -props.maxCardRotationAngle / 2 +
        props.index * (props.maxCardRotationAngle / props.numCards)
      }deg)
      ${props.isCurrentPlayer ? 'translateY(-40px)' : 'translateY(40px)'} `};
  }
`;

export const PlayerHand: React.FC<IPlayerCardsProps> = ({ hand, playerId }) => {
  const { G, playerID, ctx, moves, isActive } = useGameContext();
  const { setError } = useErrorContext();
  const clientPlayer = G.players[playerID!];
  const targetPlayer = G.players[playerId];
  const isPlayerDead = targetPlayer.hp <= 0;
  const isFacedUp = playerId === playerID || isPlayerDead;
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const maxCardRotationAngle = Math.min(hand.length * 25, 140);

  useEffect(() => {
    if (!isActive && selectedCards.length > 0) {
      setSelectedCards([]);
    }
  }, [isActive, selectedCards.length]);

  useEffect(() => {
    setShouldAnimate(false);

    let animationTimeout = setTimeout(() => {
      setShouldAnimate(true);
    }, 500);

    return () => {
      clearTimeout(animationTimeout);
    };
  }, [hand.length]);

  const onPlayerHandCardClick = (index: number) => {
    if (hasDynamite(clientPlayer) && G.dynamiteTimer === 0) {
      setError('Please draw for dynamite');
      return;
    }

    if (isJailed(clientPlayer)) {
      setError('Please draw for jail');
      return;
    }

    const currentPlayer = G.players[playerID!];
    if (currentPlayer.character.name === 'jesse jones' && currentPlayer.cardDrawnAtStartLeft >= 2) {
      moves.drawFromPlayerHand(playerID, playerId, index);
      return;
    }

    if (G.activeStage === stageNames.takeCardFromHand) {
      if (currentPlayer.character.name !== 'el gringo' || playerId !== ctx.currentPlayer) return;

      moves.drawFromPlayerHand(playerID, playerId, index);
    }
  };

  if (isFacedUp) {
    return (
      <div className='player-hand'>
        {hand.map((card, index) => (
          <DraggableCard
            key={card.id}
            card={card}
            index={index}
            isFacedUp={isFacedUp}
            playerId={playerId}
            selectedCards={selectedCards}
            setSelectedCards={setSelectedCards}
          />
        ))}
      </div>
    );
  }

  return (
    <div className='player-hand'>
      {hand.map((card, index) => (
        <DroppableCardContainer
          index={index}
          isCurrentPlayer={playerId === playerID}
          numCards={hand.length}
          maxCardRotationAngle={maxCardRotationAngle}
          shouldAnimate={shouldAnimate}
          key={card.id}
        >
          <DroppableCard
            card={card}
            index={index}
            isFacedUp={isFacedUp}
            playerId={playerId}
            cardLocation='hand'
            onClick={() => onPlayerHandCardClick(index)}
          />
        </DroppableCardContainer>
      ))}
    </div>
  );
};

export const PlayerHandMemo = React.memo(PlayerHand);
