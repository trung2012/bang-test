import React from 'react';
import { ExpansionName } from '../../game';
import { Toggle } from './Toggle';
import './Toggles.scss';

interface ITogglesProps {
  options: ExpansionName[];
}

export const Toggles: React.FC<ITogglesProps> = ({ options }) => {
  return (
    <div className='toggle'>
      {options.map(option => (
        <Toggle key={option} option={option} />
      ))}
    </div>
  );
};
