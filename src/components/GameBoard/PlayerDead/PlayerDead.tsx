import React from 'react';
import { IGamePlayer, roleImageSrcLookup } from '../../../game';
import { ReactComponent as TombSvg } from '../../../assets/tomb.svg';
import './PlayerDead.scss';

export const PlayerDead: React.FC<{ player: IGamePlayer }> = ({ player }) => {
  const playerRoleImg = roleImageSrcLookup[player.role];

  return (
    <>
      <TombSvg className='tomb' />
      {player.role !== 'sheriff' && (
        <img className='player-role-img' src={playerRoleImg} alt={player.role} />
      )}
    </>
  );
};
