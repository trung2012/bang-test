import React from 'react';
import classnames from 'classnames';
import { useGameContext } from '../../../context';
import { IGamePlayer } from '../../../game/types';
import './PlayerInfo.scss';
import { PlayerHp } from '../PlayerHp';
import { PlayerDead } from '../PlayerDead';

interface IPlayerInfoProps {
  player: IGamePlayer;
}

export const PlayerInfo: React.FC<IPlayerInfoProps> = ({ player }) => {
  const { ctx } = useGameContext();
  const isActivePlayer =
    player.id === ctx.currentPlayer || (ctx.activePlayers && ctx.activePlayers[player.id]);
  const playerInfoClassName = `player-info ${isActivePlayer ? 'player-info--active' : ''}`;

  if (player.hp <= 0) {
    return <PlayerDead player={player} />;
  }

  return (
    <>
      <div className={playerInfoClassName}>
        <div className='player-name'>{player.name}</div>
        <div
          className={classnames('player-character-image-container', {
            'player-character-image-container--active': isActivePlayer,
          })}
        >
          <img
            className='player-character-image'
            src={player.character.imageUrl}
            alt={player.character.name}
          />
        </div>
      </div>
      <PlayerHp hp={player.hp} maxHp={player.maxHp} />
    </>
  );
};
