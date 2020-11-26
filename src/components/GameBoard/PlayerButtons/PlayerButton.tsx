import React from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
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
  const playerButtonClassName = `${className ? className : ''} player-button`;

  return (
    <Tippy content={tooltipTitle}>
      <button className={playerButtonClassName} onClick={onClick}>
        {children}
      </button>
    </Tippy>
  );
};