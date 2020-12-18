import React, { useContext, useState } from 'react';
import { RobbingType } from '../../game';

export type SelectedCards = {
  [K in RobbingType]: number[];
};

export interface ICardsContext {
  selectedCards: SelectedCards;
  setSelectedCards: React.Dispatch<React.SetStateAction<SelectedCards>>;
}

export interface ICardsState {}

export const CardsContext = React.createContext<ICardsContext | null>(null);

interface ICardsProviderProps {
  children: React.ReactNode;
}

export const CardsProvider: React.FC<ICardsProviderProps> = ({ children }) => {
  const [selectedCards, setSelectedCards] = useState<SelectedCards>({
    hand: [],
    green: [],
    equipment: [],
  });

  return (
    <CardsContext.Provider value={{ selectedCards, setSelectedCards }}>
      {children}
    </CardsContext.Provider>
  );
};

export const useCardsContext = () => {
  const cardsContext = useContext(CardsContext);

  if (!cardsContext) {
    throw new Error('Components must be wrapped in CardsProvider to use CardsContext');
  }

  return cardsContext;
};
