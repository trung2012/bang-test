import gsap, { Back } from 'gsap';
import React, { useEffect } from 'react';
import { useGameContext } from '../../../context';
import { IGameResult } from '../../../game';
import { Ribbon } from '../../shared/Ribbon';
import './GameOver.scss';

interface IGameOverProps {
  gameResult: IGameResult;
}

export const GameOver: React.FC<IGameOverProps> = ({ gameResult }) => {
  const { playersInfo = [] } = useGameContext();
  const winners = gameResult.winners.map(player => ({
    ...player,
    name: playersInfo[Number(player.id)].name,
  }));

  useEffect(() => {
    gsap.from('.game-result-winner', {
      duration: 0.75,
      x: -2000,
      ease: Back.easeOut,
      stagger: {
        from: 'start',
        axis: 'x',
        amount: 0.8,
      },
    });
  }, []);

  return (
    <div className='game-result'>
      <Ribbon teamName={gameResult.team} />
      <div className='game-result-winners'>
        {winners.map(player => (
          <div className='game-result-winner' key={player.id}>
            <div className='game-result-winner-character-image'>
              <img src={player.character.imageUrl} alt={player.character.name} />
            </div>
            {player.name && <span>{player.name}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};
