import React from 'react';
import Tippy from '@tippyjs/react';
import './PlayerButton.scss';
import classnames from 'classnames';

interface IPlayerButtonProps {
  buttonType?: string;
  className?: string;
  tooltipTitle: string;
  onClick: () => void;
  disabled?: boolean;
}

export const PlayerButton: React.FC<IPlayerButtonProps> = ({
  children,
  className,
  tooltipTitle,
  onClick,
  disabled,
}) => {
  const playerButtonClassName = `player-button ${className ? className : ''}`;

  return (
    <Tippy content={tooltipTitle}>
      <button
        className={classnames(playerButtonClassName, {
          'player-button-disabled': disabled,
        })}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    </Tippy>
  );
};
