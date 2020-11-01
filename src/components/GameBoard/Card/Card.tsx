import React from 'react';
import cardBackImg from '../../../assets/card_back.png';
import { ICard } from '../../../game/types';
import { cardDisplayValue } from './Card.constants';
import './Card.scss';

interface ICardProps {
  isFacedUp: boolean;
  card: ICard;
  style?: React.CSSProperties | undefined;
  className?: string;
  onContextMenu?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onBlur?: () => void;
}

export const Card: React.FC<ICardProps> = React.memo(
  ({ card, style, isFacedUp, className, onContextMenu, onBlur }) => {
    const cardValue = cardDisplayValue[card.value];

    if (isFacedUp) {
      return (
        <div
          className={`${className ?? ''} card ${card.id}`}
          style={style}
          title={card.description ?? ''}
          onContextMenu={onContextMenu}
        >
          <img className='card-image' src={card.imageUrl} alt='card' />
          <div className='card-value-container'>
            <span className='card-value'>{cardValue ?? card.value}</span>
            <img
              className='card-suit'
              src={require(`../../../assets/suit_${card.suit}.png`)}
              alt='card-suit'
            />
          </div>
        </div>
      );
    }

    return (
      <div
        className={`${className ?? ''} card ${card.id}`}
        style={style}
        title={card.description ?? ''}
      >
        <img className='card-image' src={cardBackImg} alt='card back' />
      </div>
    );
  }
);
