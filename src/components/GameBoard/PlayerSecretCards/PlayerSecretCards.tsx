import styled from '@emotion/styled';
import React from 'react';
import { useGameContext } from '../../../context';
import { stageNames } from '../../../game/constants';
import { ICard } from '../../../game/types';
import { Card } from '../Card';

interface IPlayerSecretCards {
  cards: ICard[];
  playerId: string;
}

export const SecretCard = styled(Card)<{ index: number; isCurrentPlayer: boolean }>`
  position: absolute;
  left: ${props => `${props.index * 100}px`};
  top: ${props => (props.isCurrentPlayer ? '-100%' : '100%')};
  transform: ${props => `translate(${props.isCurrentPlayer ? '5rem, -10rem' : '0, 30rem'})`};
`;

export const PlayerSecretCards: React.FC<IPlayerSecretCards> = ({ cards, playerId }) => {
  const { G, playerID, moves } = useGameContext();

  if (!cards?.length) {
    return null;
  }

  const onSecretCardClick = (index: number) => {
    if (G.activeStage === stageNames.kitCarlsonDiscard) {
      moves.kitCarlsonDiscard(index);
    }
  };

  return (
    <div className='player-cards-in-play'>
      {cards.map((card, index) => (
        <SecretCard
          key={card.id}
          card={card}
          index={index}
          isCurrentPlayer={playerId === playerID}
          isFacedUp={playerId === playerID}
          onClick={() => onSecretCardClick(index)}
        />
      ))}
    </div>
  );
};
