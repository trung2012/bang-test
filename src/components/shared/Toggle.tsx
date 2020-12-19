import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ExpansionName } from '../../game';
import { setSetupData } from '../../store';
import './Toggle.scss';

interface IToggleProps {
  option: ExpansionName;
}

export const Toggle: React.FC<IToggleProps> = ({ option }) => {
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(false);

  const onInputChange = () => {
    dispatch(setSetupData(option));
    setIsChecked(!isChecked);
  };

  return (
    <div className='toggle-option'>
      <span>{option}</span>
      <input
        type='checkbox'
        id={`toggle-${option}`}
        className='checkbox'
        checked={isChecked}
        onChange={onInputChange}
      />
      <label htmlFor={`toggle-${option}`} className='switch' />
    </div>
  );
};
