import React from 'react';
import './CustomButton.scss';

interface ICustomButtonProps {
  buttonType?: string;
  text: string;
  onClick: (event: React.FormEvent) => void;
}

export const CustomButton: React.FC<ICustomButtonProps> = ({ buttonType, text, ...props }) => {
  const className = buttonType ? ` ${buttonType}` : 'custom-button';

  return (
    <button className={className} {...props}>
      {text}
    </button>
  );
};
