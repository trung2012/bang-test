import React from 'react';
import classnames from 'classnames';
import { useGameContext } from '../../../context';
import { IGamePlayer } from '../../../game/types';
import { PlayerHp } from '../PlayerHp';
import { PlayerDead } from '../PlayerDead';
import { ReactComponent as SheriffBadge } from '../../../assets/sheriff.svg';
import './PlayerInfo.scss';
import Tippy from '@tippyjs/react';
import { stageNames } from '../../../game';
interface IPlayerInfoProps {
  player: IGamePlayer;
}

export const PlayerInfo: React.FC<IPlayerInfoProps> = ({ player }) => {
  const { ctx } = useGameContext();
  const isActivePlayer =
    player.id === ctx.currentPlayer ||
    (ctx.activePlayers && ctx.activePlayers[player.id] !== stageNames.sidKetchum);

  if (player.hp <= 0) {
    return <PlayerDead player={player} />;
  }

  return (
    <>
      <div
        className={classnames('player-info', {
          'player-info--active': isActivePlayer,
        })}
      >
        {player.role === 'sheriff' && (
          <Tippy content='Sheriff'>
            <SheriffBadge className='sheriff-badge' />
          </Tippy>
        )}
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
