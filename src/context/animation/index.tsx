import React, { Dispatch, SetStateAction, useContext, useState } from 'react';

export interface IAnimationContext {
  cardPositions: ICardPositions;
  setCardPositions: Dispatch<SetStateAction<ICardPositions>>;
}

interface ICardPositions {
  [cardId: string]: ICardPosition;
}
interface ICardPosition {
  left: number;
  top: number;
}

export const AnimationContext = React.createContext<IAnimationContext>({
  cardPositions: {},
  setCardPositions: () => {},
});

interface IAnimationProviderProps {
  children: React.ReactNode;
}

export const AnimationProvider: React.FC<IAnimationProviderProps> = ({ children }) => {
  const [cardPositions, setCardPositions] = useState<ICardPositions>({});

  return (
    <AnimationContext.Provider value={{ cardPositions, setCardPositions }}>
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
