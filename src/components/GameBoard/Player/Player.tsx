import React from 'react';
import { Droppable } from 'react-dragtastic';
import { IServerPlayer } from '../../../api/types';
import { useErrorContext, useGameContext } from '../../../context';
import { ICard, IGamePlayer } from '../../../game/types';
import { calculateDistanceFromTarget } from '../../../utils';
import { PlayerButtons } from '../PlayerButtons';
import { PlayerCardsInPlay } from '../PlayerCardsInPlay';
import { PlayerEquipments } from '../PlayerEquipments';
import { PlayerHand } from '../PlayerHand';
import { PlayerInfo } from '../PlayerInfo';
import { PlayerSecretCards } from '../PlayerSecretCards';
import './Player.scss';

interface IPlayerProps {
  player: IGamePlayer & IServerPlayer;
  playerIndex: number;
}

export const Player: React.FC<IPlayerProps> = ({ player, playerIndex }) => {
  const { G, playersInfo, moves } = useGameContext();
  const { setError } = useErrorContext();
  const { players } = G;

  const onDrop = (data: { sourceCard: ICard; sourceCardIndex: number; sourcePlayerId: string }) => {
    if (!playersInfo?.length) throw Error('Something went wrong');
    const { sourceCard, sourceCardIndex, sourcePlayerId } = data;
    if (player.hp <= 0) return;
    if (sourcePlayerId === player.id) return;

    const sourcePlayer = players[sourcePlayerId];
    const distanceBetweenPlayers = calculateDistanceFromTarget(
      players,
      playersInfo,
      sourcePlayerId,
      player.id
    );

    switch (sourceCard.name) {
      case 'missed': {
        if (sourcePlayer.character.name !== 'calamity janet') {
          setError('Only Calamity Janet can play missed as bang');
          return;
        }
        if (sourcePlayer.numBangsLeft <= 0) {
          setError('You cannot play anymore bangs');
          return;
        }
        if (sourcePlayer.gunRange < distanceBetweenPlayers) {
          setError('Target is out of range');
          return;
        }
        moves.playCard(sourceCardIndex, player.id);
        moves.bang(player.id);
        return;
      }
      case 'bang': {
        if (sourcePlayer.gunRange < distanceBetweenPlayers) {
          setError('Target is out of range');
          return;
        }
        if (sourcePlayer.numBangsLeft <= 0) {
          setError('You cannot play anymore bangs');
          return;
        }
        moves.playCard(sourceCardIndex, player.id);
        moves.bang(player.id);
        return;
      }
      case 'duel': {
        moves.playCard(sourceCardIndex, player.id);
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
      default:
        return;
    }
  };

  return (
    <div className={`player player${playerIndex}`}>
      <Droppable accepts='card' onDrop={onDrop}>
        {dragState => (
          <div className='player-info-container' {...dragState.events}>
            <PlayerButtons player={player} />
            <PlayerInfo player={player} />
          </div>
        )}
      </Droppable>
      <PlayerEquipments equipments={player.equipments} playerId={player.id} />
      <PlayerHand hand={player.hand} playerId={player.id} />
      <PlayerCardsInPlay cards={player.cardsInPlay} playerId={player.id} />
      <PlayerSecretCards cards={player.secretCards} playerId={player.id} />
    </div>
  );
};
