import React from 'react';
import { useErrorContext, useGameContext } from '../../../context';
import { PlayerButton } from './PlayerButton';
import { ReactComponent as PassIcon } from '../../../assets/pass.svg';
import { ReactComponent as PowerIcon } from '../../../assets/power.svg';
import { ReactComponent as DamageIcon } from '../../../assets/damage.svg';
import './PlayerButtons.scss';
import {
  delayBetweenActions,
  hasActiveDynamite,
  IGamePlayer,
  isJailed,
  stageNames,
} from '../../../game';
import useSound from 'use-sound';
const power = require('../../../assets/sounds/power.mp3');

export const PlayerButtons: React.FC<{ player: IGamePlayer }> = ({ player }) => {
  const [playPower] = useSound(power, { volume: 0.2 });
  const { G, ctx, moves, playerID, isActive } = useGameContext();
  const { setError } = useErrorContext();
  const isCurrentPlayer = playerID === player.id;
  const isReactingToBullets =
    (G.activeStage === stageNames.reactToBang ||
      G.activeStage === stageNames.reactToGatling ||
      G.activeStage === stageNames.reactToIndians ||
      G.activeStage === stageNames.duel) &&
    !!ctx.activePlayers &&
    ctx.activePlayers[player.id];
  const isPowerDisabled = player.character.activePowerUsesLeft === 0;

  const onEndTurnClick = () => {
    if (!isCurrentPlayer || !isActive) {
      setError('You cannot perform this action right now');
      return;
    }

    const numCardsToDiscard =
      player.character.name === 'sean mallory'
        ? player.hand.length - 10
        : player.hand.length - player.hp;
    if (numCardsToDiscard > 0) {
      setError(
        `Please discard ${numCardsToDiscard} card${
          numCardsToDiscard > 1 ? 's' : ''
        } before ending your turn`
      );
      moves.makePlayerDiscard(numCardsToDiscard);
      return;
    }

    if (hasActiveDynamite(player)) {
      setError('Please draw for dynamite');
      return;
    }

    if (isJailed(player)) {
      setError('Please draw for jail');
      return;
    }

    moves.endTurn();
  };

  const onPowerClick = () => {
    if (!isCurrentPlayer) return;

    switch (player.character.name) {
      case 'jourdonnais': {
        if (player.jourdonnaisPowerUseLeft > 0) {
          if (
            G.activeStage === stageNames.reactToGatling ||
            G.activeStage === stageNames.reactToBang
          ) {
            moves.drawToReact(player.id);
            playPower();
            setTimeout(() => {
              moves.barrelResult(playerID, true);
            }, delayBetweenActions);
          }
          return;
        }
        break;
      }
      case 'chuck wengam': {
        if (player.hp === 1) {
          setError('You cannot use your power with 1 life point');
          return;
        }

        moves.chuckWengramPower();
        playPower();
        return;
      }
      case 'jose delgado': {
        if (!player.hand.some(card => card.type === 'equipment')) {
          setError('You have no blue card to discard');
          return;
        }
        moves.joseDelgadoPower();
        playPower();
        return;
      }
    }
  };

  const onTakeDamageClick = () => {
    if (!isCurrentPlayer) return;

    moves.takeDamage(player.id);
  };

  if (player.hp <= 0) {
    return null;
  }

  return (
    <div className='player-buttons'>
      {isCurrentPlayer && (
        <>
          {player.character.hasActivePower && (
            <PlayerButton
              tooltipTitle='Activate your power'
              onClick={onPowerClick}
              disabled={isPowerDisabled}
            >
              <PowerIcon className='player-button-icon' />
            </PlayerButton>
          )}
          {isCurrentPlayer && (
            <PlayerButton tooltipTitle='End turn' onClick={onEndTurnClick}>
              <PassIcon className='player-button-icon' />
            </PlayerButton>
          )}
          {isReactingToBullets && (
            <PlayerButton tooltipTitle='Take damage' onClick={onTakeDamageClick}>
              <DamageIcon className='player-button-icon damage-icon' />
            </PlayerButton>
          )}
        </>
      )}
    </div>
  );
};
