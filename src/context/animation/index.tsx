import React, { useContext, useState } from 'react';

export interface IAnimationContext {
  left: number;
  top: number;
  isAnimating: boolean;
  setTop: (top: number) => void;
  setLeft: (left: number) => void;
  setIsAnimating: (isAnimating: boolean) => void;
  animatedCardId: string;
  setAnimatedCardId: (cardId: string) => void;
}

export const AnimationContext = React.createContext<IAnimationContext | null>(null);

interface IAnimationProviderProps {
  children: React.ReactNode;
}

export const AnimationProvider: React.FC<IAnimationProviderProps> = ({ children }) => {
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [animatedCardId, setAnimatedCardId] = useState('');

  return (
    <AnimationContext.Provider
      value={{
        left,
        setLeft,
        top,
        setTop,
        isAnimating,
        setIsAnimating,
        animatedCardId,
        setAnimatedCardId,
      }}
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
