import React from 'react';
import './PlayerHp.scss';

export const PlayerHp: React.FC<{ hp: number; maxHp: number }> = ({ hp, maxHp }) => {
  const stepsOverlay = Array(maxHp).fill(null);

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
