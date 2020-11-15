import React from 'react';
import { useGameContext } from '../../../context';
import { IGamePlayer } from '../../../game/types';
import './PlayerInfo.scss';

interface IPlayerInfoProps {
  player: IGamePlayer;
}

export const PlayerInfo: React.FC<IPlayerInfoProps> = ({ player }) => {
  const { ctx } = useGameContext();
  const isActivePlayer =
    player.id === ctx.currentPlayer || (ctx.activePlayers && ctx.activePlayers[player.id]);
  const playerInfoClassName = `player-info ${isActivePlayer && 'player-info--active'}`;

  return (
    <div className={playerInfoClassName}>
      <div>{player.name}</div>
      <div>{player.character.name}</div>
      <div>{player.hp}</div>
      <div>{player.hp === 0 ? 'Dead' : 'Alive'}</div>
    </div>
  );
};
