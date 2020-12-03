import React from 'react';
import { useDispatch } from 'react-redux';
import { ExpansionName } from '../../game';
import { setSetupData } from '../../store';
import './Toggle.scss';

interface IToggleProps {
  option: ExpansionName;
}

export const Toggle: React.FC<IToggleProps> = ({ option }) => {
  const dispatch = useDispatch();

  return (
    <div className='toggle-option'>
      <span>{option}</span>
      <input
        type='checkbox'
        id='toggle'
        className='checkbox'
        onChange={() => dispatch(setSetupData(option))}
      />
      <label htmlFor='toggle' className='switch' />
    </div>
  );
};
