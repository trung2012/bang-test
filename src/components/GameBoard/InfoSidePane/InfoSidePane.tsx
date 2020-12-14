import React, { useState } from 'react';
import classnames from 'classnames';
import { useGameContext } from '../../../context';
import { PlayerButton } from '../PlayerButtons/PlayerButton';
import { ReactComponent as InfoIcon } from '../../../assets/info.svg';
import { ReactComponent as ChevronRightIcon } from '../../../assets/chevron_right.svg';
import './InfoSidePane.scss';

const root = 'info-side-pane';
const InfoSidePaneClassnames = {
  root,
  active: `${root}--active`,
};

export const InfoSidePane = () => {
  const { G, playerID, playersInfo } = useGameContext();
  const clientPlayer = playersInfo ? playersInfo[Number(playerID)] : null;
  const gamePlayer = playerID ? G.players[playerID] : null;
  const [isSidePaneOpened, setIsSidePaneOpened] = useState(false);

  const onKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      setIsSidePaneOpened(false);
    }
  };

  if (!clientPlayer || !gamePlayer) return null;

  return (
    <>
      {isSidePaneOpened ? null : (
        <PlayerButton
          className='info-icon'
          tooltipTitle='Player Information'
          onClick={() => setIsSidePaneOpened(true)}
        >
          <InfoIcon className='player-button-icon' />
        </PlayerButton>
      )}
      <div
        className={classnames({
          [InfoSidePaneClassnames.root]: !isSidePaneOpened,
          [InfoSidePaneClassnames.active]: isSidePaneOpened,
        })}
        onKeyDown={e => onKeyPress(e)}
      >
        <div
          className={classnames({
            [`${InfoSidePaneClassnames.root}-main`]: !isSidePaneOpened,
            [`${InfoSidePaneClassnames.active}-main`]: isSidePaneOpened,
          })}
        >
          <h2>{clientPlayer.name}</h2>
          <img
            className='character-image-info'
            src={gamePlayer.character.imageUrl}
            alt={gamePlayer.character.name}
          />
          <p>{gamePlayer.character.description}</p>
        </div>
        <ChevronRightIcon
          className={classnames({
            [`${InfoSidePaneClassnames.root}-close`]: !isSidePaneOpened,
            [`${InfoSidePaneClassnames.active}-close`]: isSidePaneOpened,
          })}
          title='Close'
          onClick={() => setIsSidePaneOpened(false)}
        />
      </div>
    </>
  );
};
