import React from 'react';
import { Droppable } from 'react-dragtastic';
import { IServerPlayer } from '../../../api/types';
import { IGamePlayer } from '../../../game/types';
import { PlayerCardsInPlay } from '../PlayerCardsInPlay';
import { PlayerEquipments } from '../PlayerEquipments';
import { PlayerHand } from '../PlayerHand';
import { PlayerInfo } from '../PlayerInfo';
import './Player.scss';

interface IPlayerProps {
  player: IGamePlayer & IServerPlayer;
  playerIndex: number;
}

export const Player: React.FC<IPlayerProps> = ({ player, playerIndex }) => {
  const onDrop = (data: any) => {
    console.log({ ...data, destPlayerId: player.id });
  };

  return (
    <div className={`player player${playerIndex}`}>
      <Droppable accepts='card' onDrop={onDrop}>
        {dragState => (
          <div className='player-info-container' {...dragState.events}>
            <PlayerInfo player={player} />
          </div>
        )}
      </Droppable>
      <PlayerEquipments equipments={player.equipments} playerId={player.id} />
      <PlayerHand hand={player.hand} playerId={player.id} />
      <PlayerCardsInPlay cards={player.cardsInPlay} playerId={player.id} />
    </div>
  );
};
