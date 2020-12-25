import React, { useEffect } from 'react';
import classnames from 'classnames';
import { useErrorContext, useGameContext } from '../../../context';
import { IGamePlayer, isJailed, stageNames } from '../../../game';
import { PlayerHp } from '../PlayerHp';
import { PlayerDead } from '../PlayerDead';
import { ReactComponent as SheriffBadge } from '../../../assets/sheriff.svg';
import Tippy from '@tippyjs/react';
import explosionImg from '../../../assets/explosion.png';
import jailImg from '../../../assets/jail.png';
import './PlayerInfo.scss';
interface IPlayerInfoProps {
  player: IGamePlayer;
}

export const PlayerInfo: React.FC<IPlayerInfoProps> = ({ player }) => {
  const { G, ctx, playerID, moves, isActive } = useGameContext();
  const { setNotification } = useErrorContext();
  const isClientPlayer = player.id === playerID;
  const isActivePlayer = player.id === ctx.currentPlayer;
  const isReactingPlayer = ctx.activePlayers && ctx.activePlayers[player.id];
  const isPlayerJailed = isJailed(player);
  const clientPlayer = G.players[playerID!];

  const onPlayerClick = () => {
    if (!isActive || isActivePlayer || !playerID) return;

    if (
      clientPlayer.character.realName === 'vera custer' &&
      ctx.activePlayers &&
      ctx.activePlayers[playerID] === stageNames.copyCharacter
    ) {
      moves.copyCharacter(player.id);
      return;
    }
  };

  useEffect(() => {
    if (
      playerID !== null &&
      ctx.activePlayers &&
      ctx.activePlayers[playerID] === stageNames.copyCharacter &&
      clientPlayer.character.realName === 'vera custer'
    ) {
      setNotification('Please choose a character to copy their power');
    }
  }, [clientPlayer.character.realName, ctx.activePlayers, playerID, setNotification]);

  if (player.hp <= 0) {
    return <PlayerDead player={player} />;
  }

  return (
    <>
      <div
        className={classnames('player-info', {
          'player-info--active': isActivePlayer,
          'player-info--reacting': isReactingPlayer,
        })}
        onClick={onPlayerClick}
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
          <Tippy content={player.character.description}>
            <img
              className='player-character-image'
              src={player.character.imageUrl}
              alt={player.character.name}
            />
          </Tippy>
          <img
            className={classnames({
              'jail-bars': !isPlayerJailed,
              'jail-bars--active': isPlayerJailed,
            })}
            src={jailImg}
            alt='jail bars'
          />
        </div>
        {isClientPlayer && <div className='player-role'>{player.role}</div>}
        <img
          className={classnames('dynamite-explosion', `dynamite-explosion-${player.id}`)}
          src={explosionImg}
          alt='explosion'
        />
      </div>
      <PlayerHp hp={player.hp} maxHp={player.maxHp} />
    </>
  );
};
