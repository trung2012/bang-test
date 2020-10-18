import React from 'react';

import './Spinner.scss';

export const Spinner = () => (
  <div className='spinner-overlay'>
    <div className='spinner' />
    <p>Loading...</p>
  </div>
);
