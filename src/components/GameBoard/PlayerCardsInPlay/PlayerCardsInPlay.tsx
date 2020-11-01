import styled from '@emotion/styled';
import React from 'react';
import { useGameContext } from '../../../context';
import { ICard } from '../../../game/types';
import { Card } from '../Card';
import './PlayerCardsInPlay.scss';

interface IPlayerCardsInPlay {
  cards: ICard[];
  playerId: string;
}

const CardInPlay = styled(Card)<{ index: number; isCurrentPlayer: boolean }>`
  position: absolute;
  left: ${props => `${props.index * 20}px`};
  top: ${props => (props.isCurrentPlayer ? '-100%' : '100%')};
  transform: ${props => `translate(${props.isCurrentPlayer ? '20rem, -20rem' : '0, 30rem'})`};
`;

export const PlayerCardsInPlay: React.FC<IPlayerCardsInPlay> = ({ cards, playerId }) => {
  const { playerID } = useGameContext();

  if (!cards?.length) {
    return null;
  }

  return (
    <div className='player-cards-in-play'>
      {cards.map((card, index) => (
        <CardInPlay
          key={card.id}
          card={card}
          isFacedUp={true}
          index={index}
          isCurrentPlayer={playerId === playerID}
        />
      ))}
    </div>
  );
};
