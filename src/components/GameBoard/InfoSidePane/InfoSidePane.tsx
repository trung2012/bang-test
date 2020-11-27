import React from 'react';
import { useGameContext } from '../../../context';

export const InfoSidePane = () => {
  const { G, playerID, playersInfo } = useGameContext();
  const clientPlayer = playersInfo ? playersInfo[Number(playerID)] : null;

  if (!clientPlayer) return null;

  return (
    <div className='info-side-pane'>
      <span></span>
    </div>
  );
};
