import React from 'react';
import './PlayerHp.scss';

interface IPlayerHpProps {
  isGhost?: boolean;
  hp: number;
  maxHp: number;
}

export const PlayerHp: React.FC<IPlayerHpProps> = ({ isGhost, hp, maxHp }) => {
  const stepsOverlay = Array(maxHp).fill(null);

  if (isGhost) {
    return null;
  }

  return (
    <div className='player-hp-container'>
      <progress className={`hp-bar${hp === 1 ? ' hp-bar-danger' : ''}`} max={maxHp} value={hp} />
      <div className='overlay-steps'>
        {stepsOverlay.map((step, index) => {
          return <div key={index} className='overlay-step' />;
        })}
      </div>
    </div>
  );
};
