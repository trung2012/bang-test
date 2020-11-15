import gsap, { Power3 } from 'gsap';
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import cardBackImg from '../../../assets/card_back.png';
import { useAnimationContext } from '../../../context';
import { ICard } from '../../../game/types';
// import { useWhyDidYouUpdate } from '../../../hooks';
import { cardDisplayValue } from './Card.constants';
import './Card.scss';

interface ICardProps {
  isFacedUp: boolean;
  card: ICard;
  style?: React.CSSProperties | undefined;
  className?: string;
  onContextMenu?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onClick?: () => void;
}

export const Card: React.FC<ICardProps> = React.memo(
  ({ card, style, isFacedUp, className, onContextMenu, onClick }) => {
    const { left, top, animatedCardId, setLeft, setTop } = useAnimationContext();
    const cardValue = cardDisplayValue[card.value];
    const cardRef = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
      if (card.id === animatedCardId && cardRef.current) {
        const newPosition = cardRef.current.getBoundingClientRect();
        gsap.from(`#${CSS.escape(animatedCardId)}`, {
          duration: 0.5,
          x: left - newPosition.left,
          y: top - newPosition.top,
          ease: Power3.easeOut,
        });

        setLeft(newPosition.left);
        setTop(newPosition.top);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cardRef]);

    if (isFacedUp) {
      return (
        <div
          id={card.id}
          className={`${className ?? ''} card`}
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
        className={`${className ?? ''} card`}
        style={style}
        title={card.description ?? ''}
        ref={node => {
          if (node) {
            cardRef.current = node;
          }
        }}
      >
        <img className='card-image' src={cardBackImg} alt='card back' />
      </div>
    );
  }
);
