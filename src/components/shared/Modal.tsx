import React from 'react';

import './Modal.scss';

interface IModalProps {
  title: string;
}

const Modal: React.FC<IModalProps> = ({ title, children }) => {
  return (
    <React.Fragment>
      <div className='modal'>
        <div className='modal__title'>
          <span className='modal__title-text'>{title}</span>
        </div>
        <div className='modal__content'>{children}</div>
      </div>
    </React.Fragment>
  );
};

export default Modal;
