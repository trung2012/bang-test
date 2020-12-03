import React from 'react';
import { CustomButton } from '../shared';

interface ICreateGameButtonProps {
  numPlayers: number;
  onClick: () => void;
}

export const CreateGameButton: React.FC<ICreateGameButtonProps> = ({ numPlayers, onClick }) => {
  return <CustomButton text={numPlayers.toString()} onClick={onClick} />;
};
