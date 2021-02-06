import React, { useEffect } from 'react';
import { useErrorContext, useGameContext } from '../../../context';
import { PlayerButton } from './PlayerButton';
import { ReactComponent as PassIcon } from '../../../assets/pass.svg';
import { ReactComponent as PowerIcon } from '../../../assets/power.svg';
import { ReactComponent as DamageIcon } from '../../../assets/damage.svg';
import { ReactComponent as CancelIcon } from '../../../assets/cancel.svg';
import './PlayerButtons.scss';
import {
  delayBetweenActions,
  hasActiveDynamite,
  hasActiveSnake,
  IGamePlayer,
  isJailed,
  isPlayerGhost,
  stageNames,
  stagesReactingToBullets,
} from '../../../game';
import useSound from 'use-sound';
const power = require('../../../assets/sounds/power.mp3');

export const PlayerButtons: React.FC<{ player: IGamePlayer }> = ({ player }) => {
  const [playPower] = useSound(power, { volume: 0.2 });
  const { G, ctx, moves, playerID, isActive } = useGameContext();
  const { setError, setNotification } = useErrorContext();
  const isClientPlayer = playerID === player.id;
  const isCurrentPlayer = isClientPlayer && player.id === ctx.currentPlayer;
  const playerCurrentStage = (ctx.activePlayers
    ? ctx.activePlayers[playerID!]
    : 'none') as stageNames;
  const isReactingToBullets =
    ctx.activePlayers !== null &&
    !!ctx.activePlayers[playerID!] &&
    stagesReactingToBullets.includes(playerCurrentStage);
  const isPowerDisabled = player.character.activePowerUsesLeft === 0;

  useEffect(() => {
    if (playerCurrentStage) {
      switch (playerCurrentStage) {
        case stageNames.discardToPlayCard: {
          setNotification('Please click a card to discard and continue');
          break;
        }
      }
    }
  }, [playerCurrentStage, setNotification]);

  const onEndTurnClick = () => {
    if (!isClientPlayer || !isActive) {
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

    if (hasActiveSnake(player)) {
      setError('Please draw for rattlesnake');
      return;
    }

    if (isJailed(player)) {
      setError('Please draw for jail');
      return;
    }

    moves.endTurn();
  };

  const onPowerClick = () => {
    if (!isClientPlayer) return;

    switch (player.character.name) {
      case 'jourdonnais': {
        if (player.jourdonnaisPowerUseLeft > 0) {
          if (
            playerCurrentStage === stageNames.reactToGatling ||
            playerCurrentStage === stageNames.reactToBang
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

        moves.chuckWengamPower();
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
    if (!isClientPlayer) return;

    moves.takeDamage(player.id);
  };

  const onPassClick = () => {
    if (!isClientPlayer) return;

    if (playerCurrentStage === stageNames.reactToRobbery) {
      if (G.reactionRequired.moveToPlayAfterDiscard === 'cat balou') {
      } else {
        moves.giveCardToRobber(ctx.currentPlayer);
      }
    }
  };

  if (player.hp <= 0 && !isPlayerGhost(player)) {
    return null;
  }

  return (
    <div className='player-buttons'>
      {isClientPlayer && (
        <>
          {player.character.hasActivePower && isActive && (
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
          {playerCurrentStage === stageNames.discard && isActive && (
            <PlayerButton tooltipTitle='Cancel' onClick={() => moves.endStage()}>
              <CancelIcon className='player-button-icon damage-icon' />
            </PlayerButton>
          )}
          {playerCurrentStage === stageNames.reactToRobbery && isActive && (
            <PlayerButton tooltipTitle='Cancel' onClick={onPassClick}>
              <CancelIcon className='player-button-icon damage-icon' />
            </PlayerButton>
          )}
        </>
      )}
    </div>
  );
};
