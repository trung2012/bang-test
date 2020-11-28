import React from 'react';
import { IGamePlayer, roleImageSrcLookup } from '../../../game';
import { ReactComponent as TombSvg } from '../../../assets/tomb.svg';
import './PlayerDead.scss';
import { useGameContext } from '../../../context';

export const PlayerDead: React.FC<{ player: IGamePlayer }> = ({ player }) => {
  const { playersInfo } = useGameContext();
  const playerName = playersInfo ? playersInfo[Number(player.id)].name : '';
  const playerRoleImg = roleImageSrcLookup[player.role];

  return (
    <>
      {playerName && <div className='player-dead-name'>{player.name}</div>}
      <TombSvg className='tomb' />
      {player.role !== 'sheriff' && (
        <img className='player-role-img' src={playerRoleImg} alt={player.role} />
      )}
    </>
  );
};
