import React from 'react';

import './CustomInput.scss';

interface ICustomInputProps {
  value: string;
  className?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  autoFocus?: boolean;
}

export const CustomInput: React.FC<ICustomInputProps> = ({
  value,
  onChange,
  className,
  ...props
}) => {
  return <input className='custom-input' value={value} onChange={onChange} {...props} />;
};
