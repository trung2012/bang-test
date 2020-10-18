import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { selectPlayerName } from '../store';

const PrivateRoute: React.FC<{ path: string; exact?: boolean; children: React.ReactNode }> = ({
  children,
  ...rest
}) => {
  const playerName = useSelector(selectPlayerName);
  const location = useLocation();

  return (
    <Route
      {...rest}
      render={() => {
        if (playerName) {
          return children;
        }

        return (
          <Redirect
            to={{
              pathname: '/',
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};

export default PrivateRoute;
