import gsap, { Power3 } from 'gsap';
import React, { useContext, useEffect, useLayoutEffect, useRef } from 'react';
import cardBackImg from '../../../assets/card_back.png';
import { AnimationContext } from '../../../context';
import { ICard } from '../../../game/types';
import classnames from 'classnames';
import { cardDisplayValue } from './Card.constants';
import './Card.scss';

interface ICardProps {
  isFacedUp: boolean;
  card: ICard;
  style?: React.CSSProperties | undefined;
  className?: string;
  onContextMenu?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onClick?: () => void;
  disabled?: boolean;
}

export const CardBaseComponent: React.FC<ICardProps> = ({
  card,
  style,
  isFacedUp,
  className,
  onContextMenu,
  onClick,
  disabled,
}) => {
  const { cardPositions, setCardPositions } = useContext(AnimationContext);
  const cardValue = cardDisplayValue[card.value];
  const cardRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (cardPositions && cardRef.current) {
      const oldPosition = cardPositions[card.id];
      const newPosition = cardRef.current.getBoundingClientRect();
      if (oldPosition) {
        if (oldPosition.left !== newPosition.left && oldPosition.top !== newPosition.top) {
          gsap.from(`#${CSS.escape(card.id)}`, {
            duration: 0.8,
            x: oldPosition.left - newPosition.left,
            y: oldPosition.top - newPosition.top,
            rotate: 0,
            ease: Power3.easeOut,
          });
        }

        setCardPositions(prevPositions => ({
          ...prevPositions,
          [card.id]: {
            left: newPosition.left,
            top: newPosition.top,
          },
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!cardPositions[card.id] && cardRef.current) {
      const bodyPosition = document.body.getBoundingClientRect();
      const newPosition = cardRef.current.getBoundingClientRect();
      setCardPositions(prevPositions => ({
        ...prevPositions,
        [card.id]: {
          left: newPosition.left - bodyPosition.left,
          top: newPosition.top - bodyPosition.top,
        },
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isFacedUp) {
    return (
      <div
        id={card.id}
        className={classnames('card', className && className, {
          'card-disabled': disabled,
        })}
        style={style}
        title={card.description ?? ''}
        onContextMenu={onContextMenu}
        onClick={onClick}
        ref={node => {
          if (node) {
            cardRef.current = node;
          }
        }}
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
      id={card.id}
      className={classnames('card', className && className, {
        'card-disabled': disabled,
      })}
      style={style}
      title={card.description ?? ''}
      ref={node => {
        if (node) {
          cardRef.current = node;
        }
      }}
      onClick={onClick}
    >
      <img className='card-image' src={cardBackImg} alt='card back' />
    </div>
  );
};

export const Card = React.memo(CardBaseComponent);
