import React, { useEffect } from 'react';
import classnames from 'classnames';
import { useCardsContext, useErrorContext, useGameContext } from '../../../context';
import {
  cardsThatCanTargetsSelf,
  cardsWhichTargetCards,
  hasActiveDynamite,
  IGamePlayer,
  isJailed,
  stageNames,
} from '../../../game';
import { PlayerHp } from '../PlayerHp';
import { PlayerDead } from '../PlayerDead';
import { ReactComponent as SheriffBadge } from '../../../assets/sheriff.svg';
import Tippy from '@tippyjs/react';
import explosionImg from '../../../assets/explosion.png';
import jailImg from '../../../assets/jail.png';
import './PlayerInfo.scss';
import { Droppable } from 'react-dragtastic';
import { calculateDistanceFromTarget } from '../../../utils';
import { IDraggableCardData } from '../DraggableCard/DraggableCard.types';
interface IPlayerInfoProps {
  player: IGamePlayer;
}

export const PlayerInfo: React.FC<IPlayerInfoProps> = ({ player }) => {
  const { G, ctx, playerID, moves, isActive, playersInfo } = useGameContext();
  const { setNotification } = useErrorContext();
  const { setError } = useErrorContext();
  const { selectedCards, setSelectedCards } = useCardsContext();
  const { players } = G;
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

  const onDrop = (data: IDraggableCardData) => {
    if (!playersInfo?.length) throw Error('Something went wrong');
    const { sourceCard, sourceCardIndex, sourcePlayerId, sourceCardLocation } = data;
    const sourcePlayer = players[sourcePlayerId];

    if (player.hp <= 0) return;
    if (sourcePlayerId === player.id && !cardsThatCanTargetsSelf.includes(sourceCard.name)) return;

    if (hasActiveDynamite(sourcePlayer)) {
      setError('Please draw for dynamite');
      return;
    }

    if (isJailed(sourcePlayer)) {
      setError('Please draw for jail');
      return;
    }

    if (sourceCardLocation === 'green' && sourceCard.timer !== undefined && sourceCard.timer > 0) {
      setError('You cannot play this card right now');
      return;
    }

    const distanceBetweenPlayers = calculateDistanceFromTarget(
      players,
      playersInfo,
      sourcePlayerId,
      player.id
    );

    if (sourceCard.needsDiscard && sourcePlayer.hand.length < 2) {
      setError(`You do not have enough cards to play this right now`);
      return;
    }

    if (
      sourceCard.needsDiscard &&
      sourceCard.isTargeted &&
      !cardsWhichTargetCards.includes(sourceCard.name)
    ) {
      moves.playCard(sourceCardIndex, player.id, sourceCardLocation);
      moves.makePlayerDiscardToPlay(sourceCard.name, player.id);
      setNotification('Please click on a card to discard and continue');
      return;
    }

    switch (sourceCard.name) {
      case 'missed': {
        if (sourcePlayer.character.name !== 'calamity janet') {
          setError('Only Calamity Janet can play missed as bang');
          return;
        }
        if (sourcePlayer.numBangsLeft <= 0) {
          setError('You cannot play any more bangs');
          return;
        }
        if (sourcePlayer.gunRange < distanceBetweenPlayers) {
          setError('Target is out of range');
          return;
        }
        moves.playCard(sourceCardIndex, player.id, sourceCardLocation);
        moves.bang(player.id);
        return;
      }
      case 'bang':
      case 'pepperbox': {
        if (sourcePlayer.gunRange < distanceBetweenPlayers) {
          setError('Target is out of range');
          return;
        }
        if (sourcePlayer.numBangsLeft <= 0) {
          setError('You cannot play any more bangs');
          return;
        }
        moves.playCard(sourceCardIndex, player.id, sourceCardLocation);
        moves.bang(player.id);
        return;
      }
      case 'duel': {
        moves.playCard(sourceCardIndex, player.id, sourceCardLocation);
        moves.duel(player.id, sourcePlayerId);
        return;
      }
      case 'jail': {
        if (player.role === 'sheriff') {
          setError('Cannot jail sheriff');
          return;
        }

        if (player.equipments.find(card => card.name === 'jail')) {
          setError('Cannot jail someone twice');
          return;
        }

        moves.jail(player.id, sourceCardIndex);
        return;
      }
      case 'punch':
      case 'knife':
      case 'derringer': {
        const reach = Math.max(sourcePlayer.actionRange, 1);
        if (reach < distanceBetweenPlayers) {
          setError('Target is out of range');
          return;
        }
        moves.playCard(sourceCardIndex, player.id, sourceCardLocation);
        moves.bang(player.id);
        return;
      }
      case 'buffalo rifle': {
        moves.playCard(sourceCardIndex, player.id, sourceCardLocation);
        moves.bang(player.id);
        return;
      }
      default: {
        return;
      }
    }
  };

  useEffect(() => {
    if (!isActive && (selectedCards.hand?.length || selectedCards.green?.length)) {
      setSelectedCards({
        hand: [],
        green: [],
        equipment: [],
      });
    }
  }, [isActive, selectedCards, setSelectedCards]);

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
      <Droppable accepts='card' onDrop={onDrop}>
        {dragState => (
          <div
            className={classnames('player-info', {
              'player-info--active': isActivePlayer,
              'player-info--reacting': isReactingPlayer,
            })}
            onClick={onPlayerClick}
            {...dragState.events}
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
        )}
      </Droppable>
      <PlayerHp hp={player.hp} maxHp={player.maxHp} />
    </>
  );
};
