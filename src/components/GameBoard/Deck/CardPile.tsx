import React from 'react';
import styled from '@emotion/styled';
import { Card } from '../Card';

import { ICard } from '../../../game';
import './CardPile.scss';
import classnames from 'classnames';

const CardContainer = styled(Card)<{ index: number; cardRotationValue: number }>`
  position: absolute;
  transform: ${props => `rotate(${props.cardRotationValue}deg)`};
  transform-origin: center;
`;

interface ICardPileProps {
  cards: ICard[];
  isFacedUp: boolean;
  className?: string;
  onClick: () => void;
}

export const CardPile: React.FC<ICardPileProps> = ({ cards, isFacedUp, className, onClick }) => {
  if (!cards) {
    return null;
  }
  console.log(cards);

  return (
    <div className={classnames(`card-pile `, className ? className : '')} onClick={onClick}>
      {cards.map((card, index) => {
        return (
          <CardContainer
            key={card.id}
            index={index}
            card={card}
            isFacedUp={isFacedUp}
            cardRotationValue={card.rotationValue ?? 0}
          />
        );
      })}
    </div>
  );
};
