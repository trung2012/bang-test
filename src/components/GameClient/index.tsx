import React from 'react';
import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer';
import { Bang } from '../../game';
import GameBoard from '../GameBoard';
import { SERVER_URL } from '../../config';

interface IGameClientProps {
  roomId: string;
  playerId: string;
  playerCredentials: string;
  debug: boolean;
}

export const GameClient: React.FC<IGameClientProps> = ({
  roomId,
  playerId,
  playerCredentials,
  debug,
}) => {
  const ClientComponent = Client({
    game: Bang,
    board: GameBoard,
    multiplayer: SocketIO({ server: SERVER_URL }),
  });

  return (
    <ClientComponent
      matchID={roomId}
      playerID={playerId.toString()}
      credentials={playerCredentials}
      debug={debug}
    />
  );
};
