import React from 'react';
import { useErrorContext, useGameContext } from '../../../context';
import { delayBetweenActions, hasActiveDynamite, isJailed, stageNames } from '../../../game';
import { ICard } from '../../../game';
import { DroppableCard } from '../DroppableCard';
import './PlayerEquipments.scss';

interface IPlayerEquipments {
  playerId: string;
  equipments: ICard[];
}

export const PlayerEquipments: React.FC<IPlayerEquipments> = ({ playerId, equipments }) => {
  const { G, ctx, playerID, moves, isActive } = useGameContext();
  const { setError } = useErrorContext();
  const { players } = G;
  const cardLocation = 'equipment';

  const onEquipmentClick = (equipmentCard: ICard, index: number) => {
    if (!isActive || playerID === null) return;

    const sourcePlayer = players[playerID];
    const targetPlayer = players[playerId];

    //Process clicking on other people's equipments
    if (
      playerID !== playerId &&
      sourcePlayer.character.name === 'pat brennan' &&
      sourcePlayer.cardDrawnAtStartLeft >= 2
    ) {
      if (hasActiveDynamite(sourcePlayer)) {
        setError('Please draw for dynamite');
        return;
      }

      if (isJailed(sourcePlayer)) {
        setError('Please draw for jail');
        return;
      }

      moves.patBrennanEquipmentDraw(playerId, index, cardLocation);
      return;
    }

    if (ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer] === stageNames.ragtime) {
      moves.panic(playerId, index, cardLocation);
      return;
    }

    // Process clicking on own equipments
    if (playerID !== playerId) return;

    if (
      equipmentCard.name === 'barrel' &&
      ctx.activePlayers &&
      (ctx.activePlayers[playerID] === stageNames.reactToGatling ||
        ctx.activePlayers[playerID] === stageNames.reactToBang) &&
      targetPlayer.barrelUseLeft > 0
    ) {
      moves.drawToReact(playerID);
      setTimeout(() => {
        moves.barrelResult(playerID, false);
      }, delayBetweenActions);
      return;
    }
  };

  if (!equipments?.length) {
    return null;
  }

  return (
    <div className='player-equipments'>
      {equipments.map((card, index) => (
        <DroppableCard
          key={card.id}
          card={card}
          index={index}
          isFacedUp={true}
          playerId={playerId}
          cardLocation={cardLocation}
          onClick={() => onEquipmentClick(card, index)}
        />
      ))}
    </div>
  );
};
