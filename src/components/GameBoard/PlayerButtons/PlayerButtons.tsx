import React from 'react';
import { useErrorContext, useGameContext } from '../../../context';
import { PlayerButton } from './PlayerButton';
import { ReactComponent as PassIcon } from '../../../assets/pass.svg';
import { ReactComponent as PowerIcon } from '../../../assets/power.svg';
import { ReactComponent as DamageIcon } from '../../../assets/damage.svg';
import './PlayerButtons.scss';
import { delayBetweenActions, IGamePlayer, stageNames } from '../../../game';

export const PlayerButtons: React.FC<{ player: IGamePlayer }> = ({ player }) => {
  const { G, moves, playerID, isActive } = useGameContext();
  const { setError } = useErrorContext();
  const isCurrentPlayer = playerID === player.id;
  const isReactingToBullets =
    G.activeStage === stageNames.reactToBang ||
    G.activeStage === stageNames.reactToGatling ||
    G.activeStage === stageNames.reactToIndians ||
    G.activeStage === stageNames.duel;

  const onEndTurnClick = () => {
    if (!isCurrentPlayer || !isActive) {
      setError('You cannot perform this action right now');
      return;
    }

    const numCardsToDiscard = player.hand.length - player.hp;
    if (numCardsToDiscard > 0) {
      setError(
        `Please discard ${numCardsToDiscard} card${
          numCardsToDiscard > 1 ? 's' : ''
        } before ending your turn`
      );
      moves.makePlayerDiscard(numCardsToDiscard);
      return;
    }

    if (player.equipments.some(card => card.name === 'dynamite') && G.dynamiteTimer === 0) {
      setError('Please draw for dynamite');
      return;
    }

    moves.endTurn();
  };

  const onPowerClick = () => {
    if (!isCurrentPlayer) return;

    if (player.character.name === 'jourdonnais' && player.jourdonnaisPowerUseLeft > 0) {
      if (G.activeStage === stageNames.reactToGatling || G.activeStage === stageNames.reactToBang) {
        moves.drawToReact(player.id);
        setTimeout(() => {
          moves.barrelResult(playerID, true);
        }, delayBetweenActions);
      }
    }
  };

  const onTakeDamageClick = () => {
    if (!isCurrentPlayer) return;

    moves.takeDamage(player.id);
  };

  return (
    <div className='player-buttons'>
      {isCurrentPlayer && (
        <>
          {player.character.hasActivePower && (
            <PlayerButton tooltipTitle='Activate your power' onClick={onPowerClick}>
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
