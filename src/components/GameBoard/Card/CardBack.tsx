import React from 'react';
import classnames from 'classnames';
import { ICard } from '../../../game';
import cardBackImg from '../../../assets/card_back.png';

interface ICardBackProps {
  card: ICard;
  style?: React.CSSProperties | undefined;
  className?: string;
  onContextMenu?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onClick?: () => void;
  disabled?: boolean;
}

export const CardBack = React.forwardRef<HTMLDivElement, ICardBackProps>(
  ({ card, className, disabled, style, onClick }, cardRef) => {
    return (
      <div
        id={card.id}
        className={classnames('card', className && className, {
          'card-disabled': disabled,
        })}
        style={style}
        title={card.description ?? ''}
        ref={node => {
          if (typeof cardRef === 'function') {
            cardRef(node);
          } else if (cardRef) {
            cardRef.current = node;
          }
        }}
        onClick={onClick}
      >
        <img className='card-image' src={cardBackImg} alt='card back' />
      </div>
    );
  }
);
