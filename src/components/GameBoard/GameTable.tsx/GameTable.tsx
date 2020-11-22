import React from 'react';
import { useGameContext } from '../../../context';
import { useBgioEffects } from '../../../hooks';
import { Deck, Discarded } from '../Deck';
import { GeneralStore } from '../GeneralStore';
import { Player } from '../Player';
import './GameTable.scss';

export const GameTable = () => {
  const { G, playersInfo, playerID } = useGameContext();
  const { players } = G;

  const clientPlayerIndex = playersInfo?.findIndex((p, index) => playerID === p.id.toString());
  const renderedPlayers =
    playersInfo && clientPlayerIndex
      ? [
          playersInfo[clientPlayerIndex],
          ...playersInfo?.slice(clientPlayerIndex + 1),
          ...playersInfo?.slice(0, clientPlayerIndex),
        ]
      : playersInfo;

  useBgioEffects();

  if (playersInfo && playersInfo.length > 0) {
    return (
      <div className={`game-table--${playersInfo.length}-players`}>
        {renderedPlayers &&
          renderedPlayers.map((p, index) => {
            const player = { ...players[p.id], name: p.name };

            return player && <Player key={player.id} player={player} playerIndex={index} />;
          })}
        <GeneralStore />
        <div className='common-cards'>
          <Deck />
          <Discarded />
        </div>
      </div>
    );
  }

  return <h1>Something went wrong</h1>;
};
