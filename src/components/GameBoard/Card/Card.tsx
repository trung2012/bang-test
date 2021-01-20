import gsap, { Power3 } from 'gsap';
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useAnimationContext } from '../../../context';
import { ICard } from '../../../game';
import { CardFront } from './CardFront';
import './Card.scss';
import { CardBack } from './CardBack';
import Tippy from '@tippyjs/react';
import 'tippy.js/themes/light.css';

interface ICardProps {
  isFacedUp: boolean;
  card: ICard;
  style?: React.CSSProperties | undefined;
  className?: string;
  onContextMenu?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onClick?: () => void;
  disabled?: boolean;
  isDragComponent?: boolean;
}

export const CardBaseComponent: React.FC<ICardProps> = ({
  card,
  style,
  isFacedUp,
  className,
  onContextMenu,
  onClick,
  disabled,
  isDragComponent,
}) => {
  const { cardPositions, setCardPositions } = useAnimationContext();
  const cardRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (cardPositions && cardRef.current && !isDragComponent) {
      const oldPosition = cardPositions[card.id];
      const newPosition = cardRef.current.getBoundingClientRect();
      if (oldPosition) {
        if (oldPosition.left !== newPosition.left && oldPosition.top !== newPosition.top) {
          gsap.from(`#${CSS.escape(card.id)}`, {
            x: oldPosition.left - newPosition.left,
            y: oldPosition.top - newPosition.top,
            duration: 0.8,
            ease: Power3.easeOut,
          });
        }

        setCardPositions(card.id, {
          left: newPosition.left,
          top: newPosition.top,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!cardPositions[card.id] && cardRef.current && !isDragComponent) {
      const newPosition = cardRef.current.getBoundingClientRect();
      setCardPositions(card.id, {
        left: newPosition.left,
        top: newPosition.top,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isFacedUp) {
    return (
      <Tippy
        theme='light'
        delay={[700, 0]}
        offset={[0, 80]}
        arrow={false}
        content={
          <CardFront className='card-enlarged' card={card} style={style} disabled={disabled} />
        }
      >
        <CardFront
          className={className}
          ref={cardRef}
          card={card}
          onContextMenu={onContextMenu}
          onClick={onClick}
          style={style}
          disabled={disabled}
        />
      </Tippy>
    );
  }

  return <CardBack className={className} ref={cardRef} card={card} onClick={onClick} />;
};

export const Card = React.memo(CardBaseComponent);
