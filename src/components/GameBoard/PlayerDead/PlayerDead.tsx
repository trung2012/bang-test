import React from 'react';
import classnames from 'classnames';
import { IGamePlayer, roleImageSrcLookup } from '../../../game';
import { ReactComponent as TombSvg } from '../../../assets/tomb.svg';
import './PlayerDead.scss';
import { useGameContext } from '../../../context';
import explosionImg from '../../../assets/explosion.png';

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
      <img
        className={classnames('dynamite-explosion', `dynamite-explosion-${player.id}`)}
        src={explosionImg}
        alt='explosion'
      />
    </>
  );
};
