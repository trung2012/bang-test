import React from 'react';
import { ChangeNickNameLink } from '../Lobby';
import './Header.scss';

export const Header = () => {
  return (
    <div className='game-header'>
      <h1>Bang</h1>
      <span onClick={() => window.open('http://www.dvgiochi.net/bang/bang_rules.pdf')}>
        Game rules
      </span>
      <span onClick={() => window.open('http://www.dvgiochi.net/bang/bang_faq_eng.pdf')}>FAQ</span>
      <ChangeNickNameLink />
    </div>
  );
};
