import React from 'react';
import { ChangeNickNameLink } from '../Lobby';
import './Header.scss';

export const Header = () => {
  return (
    <div className='game-header'>
      <h1>Bang</h1>
      <span
        onClick={() =>
          window.open(
            'https://res.cloudinary.com/trungpham/image/upload/v1612245964/bang/bang_rules_zepgrf.pdf'
          )
        }
      >
        Game rules
      </span>
      <span
        onClick={() =>
          window.open(
            'https://res.cloudinary.com/trungpham/image/upload/v1612245963/bang/bang_faq_eng_f7v39p.pdf'
          )
        }
      >
        FAQ
      </span>
      <ChangeNickNameLink />
    </div>
  );
};
