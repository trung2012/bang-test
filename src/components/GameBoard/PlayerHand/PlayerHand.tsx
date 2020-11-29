import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { useGameContext } from '../../../context';
import { stageNames } from '../../../game/constants';
import { ICard } from '../../../game/types';
import { DraggableCard } from '../DraggableCard';
import { CardContainerProps, DroppableCard } from '../DroppableCard';
import './PlayerHand.scss';

interface IPlayerCardsProps {
  playerId: string;
  hand: ICard[];
}

const DroppableCardContainer = styled.div<
  CardContainerProps & { numCards: number; maxCardRotationAngle: number }
>`
  position: absolute;
  transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
  transform: ${props =>
    `rotate(${
      -props.maxCardRotationAngle / 2 + props.index * (props.maxCardRotationAngle / props.numCards)
    }deg)`};
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
  const { G, playerID, ctx, moves } = useGameContext();
  const targetPlayer = G.players[playerId];
  const isPlayerDead = targetPlayer.hp <= 0;
  const isFacedUp = playerId === playerID || isPlayerDead;
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const maxCardRotationAngle = Math.min(hand.length * 25, 140);

  useEffect(() => {
    if (
      G.activeStage &&
      G.reactionRequired.cardNeeded &&
      selectedCards.length === G.reactionRequired.quantity
    ) {
      moves.playCardToReact(selectedCards, playerID);
      setSelectedCards([]);
    }

    if (!G.activeStage) {
      setSelectedCards([]);
    }
  }, [
    G.activeStage,
    G.reactionRequired.cardNeeded,
    G.reactionRequired.quantity,
    moves,
    playerID,
    selectedCards,
  ]);

  const onPlayerHandCardClick = (index: number) => {
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
