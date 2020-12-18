import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ExpansionName } from '../../game';
import { selectSetUpData, setSetupData } from '../../store';
import './Toggle.scss';

interface IToggleProps {
  option: ExpansionName;
}

export const Toggle: React.FC<IToggleProps> = ({ option }) => {
  const dispatch = useDispatch();
  const setupData = useSelector(selectSetUpData);

  return (
    <div className='toggle-option'>
      <span>{option}</span>
      <input
        type='checkbox'
        id='toggle'
        className='checkbox'
        checked={setupData?.expansions.includes(option)}
      />
      <label htmlFor='toggle' className='switch' onClick={() => dispatch(setSetupData(option))} />
    </div>
  );
};
