import React, { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useErrorContext, useGameContext } from '../../../context';
import { Deck, Discarded } from '../Deck';
import { GameOver } from '../GameOver';
import { GeneralStore } from '../GeneralStore';
import { Player } from '../Player';
import './GameTable.scss';
import 'react-toastify/dist/ReactToastify.min.css';
import { useBgioEffects } from '../../../hooks';
import { InfoSidePane } from '../InfoSidePane';

export const GameTable = () => {
  const { G, ctx, playersInfo, playerID } = useGameContext();
  const { error, setError } = useErrorContext();
  const { players } = G;

  const clientPlayerIndex = playersInfo?.findIndex(p => playerID === p.id.toString());
  const renderedPlayers =
    playersInfo && clientPlayerIndex && clientPlayerIndex !== -1
      ? [
          playersInfo[clientPlayerIndex],
          ...playersInfo?.slice(clientPlayerIndex + 1),
          ...playersInfo?.slice(0, clientPlayerIndex),
        ]
      : playersInfo;

  useBgioEffects();

  useEffect(() => {
    if (error) {
      toast.error(error, {
        onClose: () => {
          setError('');
        },
      });
    }
  }, [error, setError]);

  if (ctx.gameover) {
    return <GameOver gameResult={ctx.gameover} />;
  }

  if (playersInfo && playersInfo.length > 0) {
    return (
      <div className={`game-table game-table--${playersInfo.length}-players`}>
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
        <ToastContainer
          position='top-center'
          autoClose={4500}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <InfoSidePane />
      </div>
    );
  }

  return <h1>Something went wrong</h1>;
};
