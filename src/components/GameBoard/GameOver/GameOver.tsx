import gsap, { Back } from 'gsap';
import React, { useEffect } from 'react';
import useSound from 'use-sound';
import { useHistory, useParams } from 'react-router-dom';
import { useGameContext } from '../../../context';
import { IGameResult } from '../../../game';
import { CustomButton } from '../../shared';
import { Ribbon } from '../../shared/Ribbon';
import './GameOver.scss';
import { lobbyService } from '../../../api';
import { useSelector } from 'react-redux';
import { selectPlayerCredentials, selectPlayerId } from '../../../store';
import { getPreviousGamePlayersMap } from '../../../utils';
const gameOverMusic =
  'https://res.cloudinary.com/trungpham/video/upload/v1608100682/bang/gameover_xneobx.mp3';
interface IGameOverProps {
  gameResult: IGameResult;
}

export const GameOver: React.FC<IGameOverProps> = ({ gameResult }) => {
  const history = useHistory();
  const { roomId } = useParams<{ roomId: string }>();
  const clientPlayerId = useSelector(selectPlayerId);
  const clientPlayerCredentials = useSelector(selectPlayerCredentials);
  const { G, playersInfo = [] } = useGameContext();
  const winners = gameResult.winners.map(player => ({
    ...player,
    name: playersInfo[Number(player.id)].name,
  }));
  const [playGameOverMusic] = useSound(gameOverMusic, { volume: 0.6 });

  useEffect(() => {
    playGameOverMusic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playGameOverMusic]);

  useEffect(() => {
    gsap.from('.game-result-winner', {
      duration: 0.75,
      x: -2000,
      ease: Back.easeOut,
      stagger: {
        from: 'start',
        axis: 'x',
        amount: 0.5,
      },
    });
  }, []);

  const onPlayAgainClick = async () => {
    if (!roomId || clientPlayerId === null) {
      throw Error('No previous room!');
    }

    const previousGamePlayers = getPreviousGamePlayersMap(playersInfo);
    const previousExpansions = G.expansions;

    const nextMatchID = await lobbyService.playAgain(
      roomId,
      clientPlayerId,
      clientPlayerCredentials,
      {
        previousGamePlayers,
        expansions: previousExpansions,
      }
    );
    history.push(`/rooms/${nextMatchID}`);
  };

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
      <div className='game-result-buttons'>
        <CustomButton text='Play Again' onClick={onPlayAgainClick} />
      </div>
    </div>
  );
};
