import React from 'react';
import './App.scss';
import { Switch, Route } from 'react-router-dom';
import { ChangeNickName, CreateGame, Header, Lobby } from './components';
import PrivateRoute from './components/shared/PrivateRoute';

function App() {
  return (
    <div className='App'>
      <Switch>
        <Route exact path='/'>
          <Header />
          <ChangeNickName />
        </Route>
        <Route exact path='/create'>
          <Header />
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
