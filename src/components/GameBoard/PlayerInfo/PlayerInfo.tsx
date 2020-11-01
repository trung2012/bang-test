import React from 'react';
import { IGamePlayer } from '../../../game/types';
import './PlayerInfo.scss';

interface IPlayerInfoProps {
  player: IGamePlayer;
}

export const PlayerInfo: React.FC<IPlayerInfoProps> = ({ player }) => {
  return (
    <div className='player-info'>
      <div>{player.name}</div>
      <div>{player.character.name}</div>
      <div>{player.hp}</div>
      <div>{player.hp === 0 ? 'Dead' : 'Alive'}</div>
    </div>
  );
};
