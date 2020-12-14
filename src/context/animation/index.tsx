import React, { useContext, useRef } from 'react';

export interface IAnimationContext {
  cardPositions: ICardPositions;
  setCardPositions: (cardId: string, cardPosition: ICardPosition) => void;
}

interface ICardPositions {
  [cardId: string]: ICardPosition | undefined;
}
interface ICardPosition {
  left: number;
  top: number;
}

export const AnimationContext = React.createContext<IAnimationContext | undefined>(undefined);

interface IAnimationProviderProps {
  children: React.ReactNode;
}

export const AnimationProvider: React.FC<IAnimationProviderProps> = ({ children }) => {
  const cardPositionsRef = useRef<ICardPositions>({});

  const setCardPositions = (cardId: string, cardPosition: ICardPosition) => {
    cardPositionsRef.current[cardId] = cardPosition;
  };

  return (
    <AnimationContext.Provider
      value={{ cardPositions: cardPositionsRef.current, setCardPositions }}
    >
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimationContext = () => {
  const animationContext = useContext(AnimationContext);
  if (!animationContext) {
    throw new Error('Components must be wrapped in AnimationProvider to use AnimationContext');
  }
  return animationContext;
};
