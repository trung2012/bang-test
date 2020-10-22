import React from 'react';
import { useDispatch } from 'react-redux';
import { CustomButton } from '../shared';
import { createGameRoom } from '../../store';

interface ICreateGameButtonProps {
  numPlayers: number;
}

export const CreateGameButton: React.FC<ICreateGameButtonProps> = ({ numPlayers }) => {
  const dispatch = useDispatch();

  return (
    <CustomButton
      text={numPlayers.toString()}
      onClick={() => {
        dispatch(createGameRoom(numPlayers));
      }}
    />
  );
};
