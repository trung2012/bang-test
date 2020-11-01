import React from 'react';
import styled from '@emotion/styled';
import { Card } from '../Card';

import { ICard } from '../../../game/types';
import './CardPile.scss';

const randomRotationValue = () => {
  const plusOrMinus = Math.random() < 0.5 ? -1 : 1;
  return plusOrMinus * Math.round(Math.random() * 4);
};

const CardContainer = styled(Card)<{ index: number }>`
  position: absolute;
  transform: ${props => `rotate(${randomRotationValue()}deg)`};
  transform-origin: center;
`;

interface ICardPileProps {
  cards: ICard[];
  isFacedUp: boolean;
  className?: string;
}

export const CardPile: React.FC<ICardPileProps> = ({ cards, isFacedUp, className }) => {
  return (
    <div className={`${className ?? ''} card-pile`}>
      {cards.map((card, index) => {
        return <CardContainer key={card.id} index={index} card={card} isFacedUp={isFacedUp} />;
      })}
    </div>
  );
};
