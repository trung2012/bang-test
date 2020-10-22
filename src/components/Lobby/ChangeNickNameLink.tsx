import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const ChangeNickNameLink = () => {
  const location = useLocation();
  return (
    <Link
      className='change-name-link custom-button'
      to={{
        pathname: '/',
        state: { from: location },
      }}
    >
      Change nickname
    </Link>
  );
};
