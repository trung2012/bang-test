import React from 'react';
import Tippy from '@tippyjs/react';
import './PlayerButton.scss';

interface IPlayerButtonProps {
  buttonType?: string;
  className?: string;
  tooltipTitle: string;
  onClick: () => void;
}

export const PlayerButton: React.FC<IPlayerButtonProps> = ({
  children,
  className,
  tooltipTitle,
  onClick,
}) => {
  const playerButtonClassName = `player-button ${className ? className : ''}`;

  return (
    <Tippy content={tooltipTitle}>
      <button className={playerButtonClassName} onClick={onClick}>
        {children}
      </button>
    </Tippy>
  );
};
