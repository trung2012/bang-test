import { keyframes } from '@emotion/core';
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { useErrorContext, useGameContext } from '../../../context';
import { stageNames } from '../../../game';
import { ICard } from '../../../game';
import { hasActiveDynamite, isJailed } from '../../../game';
import { DraggableCard } from '../DraggableCard';
import { DroppableCard } from '../DroppableCard';
import './PlayerHand.scss';

interface IPlayerCardsProps {
  playerId: string;
  hand: ICard[];
}

export type CardContainerProps = {
  index: number;
  numCards: number;
  maxCardRotationAngle: number;
  shouldAnimate: boolean;
};

export const cardShuffleAnimation = (destinationTransform: string) =>
  keyframes`
  from {
    transform: none;
  }

  to {
    transform: ${destinationTransform};
  }
`;

const PlayerHandContainer = styled.div<{ shouldAnimate: boolean }>`
  ${props => !props.shouldAnimate && 'transform: rotate(0) !important'}
`;

const PlayerHandDroppableCardContainer = styled.div<CardContainerProps>`
  position: absolute;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform: none;
  animation: ${props =>
      props.shouldAnimate
        ? cardShuffleAnimation(
            `rotate(${
              -props.maxCardRotationAngle / 2 +
              props.index * (props.maxCardRotationAngle / props.numCards)
            }deg)`
          )
        : 'none'}
    0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  transform-origin: center top;

  &:hover {
    transform: translateY(-40px);
  }
`;

export const PlayerHandComponent: React.FC<IPlayerCardsProps> = ({ hand, playerId }) => {
  const { G, playerID, ctx, moves } = useGameContext();
  const { setError } = useErrorContext();
  const clientPlayer = G.players[playerID!];
  const targetPlayer = G.players[playerId];
  const isPlayerDead = targetPlayer.hp <= 0;
  const isFacedUp = playerId === playerID || isPlayerDead;
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const maxCardRotationAngle = Math.min(hand.length * 25, 135);
  const cardLocation = 'hand';

  useEffect(() => {
    setShouldAnimate(false);

    let animationTimeout = setTimeout(() => {
      setShouldAnimate(true);
    }, 500);

    return () => {
      clearTimeout(animationTimeout);
    };
  }, [hand.length]);

  const onPlayerHandDroppableCardClick = (index: number) => {
    if (hasActiveDynamite(clientPlayer)) {
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

    if (ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer] === stageNames.ragtime) {
      moves.panic(playerId, index, cardLocation);
      return;
    }

    if (G.activeStage === stageNames.takeCardFromHand) {
      if (currentPlayer.character.name === 'el gringo' && playerId === ctx.currentPlayer) {
        moves.drawFromPlayerHand(playerID, playerId, index);
      }
    }
  };

  if (isFacedUp) {
    return (
      <div className='player-hand'>
        {hand.map((card, index) => (
          <DraggableCard
            key={`${card.id}-${index}-hand`}
            card={card}
            index={index}
            isFacedUp={isFacedUp}
            playerId={playerId}
            cardLocation={cardLocation}
          />
        ))}
      </div>
    );
  }

  return (
    <PlayerHandContainer shouldAnimate={shouldAnimate} className='player-hand'>
      {hand.map((card, index) => (
        <PlayerHandDroppableCardContainer
          index={index}
          numCards={hand.length}
          maxCardRotationAngle={maxCardRotationAngle}
          shouldAnimate={shouldAnimate}
          key={`${card.id}-${index}`}
        >
          <DroppableCard
            card={card}
            index={index}
            isFacedUp={isFacedUp}
            playerId={playerId}
            cardLocation={cardLocation}
            onClick={() => onPlayerHandDroppableCardClick(index)}
          />
        </PlayerHandDroppableCardContainer>
      ))}
    </PlayerHandContainer>
  );
};

export const PlayerHand = React.memo(PlayerHandComponent);
