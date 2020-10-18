import React from 'react';
import { CreateGameButton } from './CreateGameButton';
import './CreateGame.scss';

export const CreateGame = () => {
  return (
    <div className='create-game'>
      <h2>Create Game</h2>
      <h3>How many players?</h3>
      <div className='create-game-buttons'>
        <CreateGameButton numPlayers={4} />
        <CreateGameButton numPlayers={5} />
        <CreateGameButton numPlayers={6} />
        <CreateGameButton numPlayers={7} />
      </div>
    </div>
  );
};
