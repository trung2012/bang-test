import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectPlayerName, setPlayerCredentials, setPlayerName } from '../../store/lobbyStore';
import './ChangeNickName.scss';
import { useHistory, useLocation } from 'react-router-dom';
import { CustomInput, CustomButton } from '../shared';

export interface ILocationState {
  from: {
    pathname: string;
  };
}

export const ChangeNickName = () => {
  let location = useLocation<ILocationState>();
  const history = useHistory();

  let { from } = location.state || { from: { pathname: '/' } };

  const dispatch = useDispatch();
  const playerName = useSelector(selectPlayerName);
  const [newPlayerName, setNewPlayerName] = useState(playerName || '');

  useEffect(() => {
    dispatch(setPlayerCredentials(''));
  }, [dispatch]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    localStorage.setItem('bang-playerName', newPlayerName);
    dispatch(setPlayerName(newPlayerName));
    if (from.pathname === '/') {
      return history.push('/create');
    }
    history.replace(from);
  };

  return (
    <div className='change-nickname'>
      <h2>What is your name?</h2>
      <form onSubmit={handleSubmit} className='change-nickname-form'>
        <CustomInput
          value={newPlayerName}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setNewPlayerName(event.target.value)
          }
          required
          autoFocus
        />
        <CustomButton text='Confirm' onClick={handleSubmit} />
      </form>
    </div>
  );
};
