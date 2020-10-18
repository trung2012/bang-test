import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectPlayerName, setPlayerCredentials, setPlayerName } from '../store/lobbyStore';
import { CustomButton } from './CustomButton';
import { CustomInput } from './CustomInput';
import './ChangeNickName.scss';
import { History } from 'history';
import { useLocation } from 'react-router-dom';

interface ILocationState {
  from: {
    pathname: string;
  };
}

export const ChangeNickName: React.FC<{ history: History }> = ({ history }) => {
  let location = useLocation<ILocationState>();

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
      <h3>What is your name?</h3>
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
