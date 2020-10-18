import React, { useEffect } from 'react';
import './App.scss';
import { Switch, Route } from 'react-router-dom';
import { ChangeNickName, CreateGame, GameHeader, Lobby } from './components';
import PrivateRoute from './components/PrivateRoute';
import { ChangeNickNameLink } from './components/ChangeNickNameLink';

function App() {
  useEffect(() => {
    localStorage.removeItem('bang-playerCredentials');
  }, []);

  return (
    <div className='App'>
      <GameHeader />
      <ChangeNickNameLink />
      <Switch>
        <Route exact path='/' component={ChangeNickName} />
        <Route exact path='/create'>
          <CreateGame />
        </Route>
        <PrivateRoute exact path='/rooms/:roomId'>
          <Lobby />
        </PrivateRoute>
      </Switch>
    </div>
  );
}

export default App;
