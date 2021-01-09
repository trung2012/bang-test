import React from 'react';
import { IServerPlayer } from '../../../api/types';
import { IGamePlayer } from '../../../game';
import { PlayerButtons } from '../PlayerButtons';
import { PlayerCardsInPlay } from '../PlayerCardsInPlay';
import { PlayerEquipments } from '../PlayerEquipments';
import { PlayerGreenEquipments } from '../PlayerGreenEquipments';
import { PlayerHand } from '../PlayerHand';
import { PlayerInfo } from '../PlayerInfo';
import { PlayerSecretCards } from '../PlayerSecretCards';
import './Player.scss';

interface IPlayerProps {
  player: IGamePlayer & IServerPlayer;
  playerIndex: number;
}

export const Player: React.FC<IPlayerProps> = ({ player, playerIndex }) => {
  return (
    <div className={`player player${playerIndex}`}>
      <div className='player-info-container'>
        <PlayerButtons player={player} />
        <PlayerInfo player={player} />
      </div>
      <div className='player-equipments-container'>
        <PlayerEquipments equipments={player.equipments} playerId={player.id} />
        <PlayerGreenEquipments equipments={player.equipmentsGreen} playerId={player.id} />
      </div>
      <PlayerHand hand={player.hand} playerId={player.id} />
      <PlayerCardsInPlay cards={player.cardsInPlay} playerId={player.id} />
      <PlayerSecretCards cards={player.secretCards} playerId={player.id} />
    </div>
  );
};
