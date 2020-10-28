import { BoardProps } from 'boardgame.io/dist/types/packages/react';
import React from 'react';
import { GameContext } from '../../context';
import { IGameState } from '../../game/types';
import { GameTable } from './GameTable.tsx';

const GameBoard: React.FC<BoardProps<IGameState>> = ({
  G,
  ctx,
  moves,
  events,
  playerID,
  isActive,
  matchData: playersInfo,
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
        playersInfo,
      }}
    >
      <GameTable />
    </GameContext.Provider>
  );
};

export default GameBoard;
