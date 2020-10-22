import { BoardProps } from 'boardgame.io/dist/types/packages/react';
import React from 'react';
import { GameContext } from '../../context';
import { IGameState } from '../../game/types';

const GameBoard: React.FC<BoardProps<IGameState>> = ({
  G,
  ctx,
  moves,
  events,
  playerID,
  isActive,
  matchData,
}) => {
  return (
    <GameContext.Provider
      value={{
        G,
        ctx,
        moves,
        events,
        playerID,
        isActive,
        matchData,
      }}
    >
      <div>Game Board</div>
    </GameContext.Provider>
  );
};

export default GameBoard;
