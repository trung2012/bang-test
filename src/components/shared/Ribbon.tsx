import React from 'react';
import './Ribbon.scss';

export const Ribbon: React.FC<{ teamName: string }> = ({ teamName }) => {
  return (
    <div className='ribbon'>
      {teamName} won
      <i></i>
      <i></i>
      <i></i>
      <i></i>
    </div>
  );
};
