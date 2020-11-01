import React, { useLayoutEffect, useState } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';

import './MoreOptions.scss';

interface IMoreOptionsProps {
  dismiss: () => void;
  className?: string;
}

export const MoreOptions: React.FC<IMoreOptionsProps> = ({ children, dismiss, className }) => {
  const [style, setStyle] = useState({});
  const moreOptionsRef = useClickOutside(event => dismiss());
  const classNames = className ? `${className} more-options` : 'more-options';

  useLayoutEffect(() => {
    if (moreOptionsRef?.current) {
      const { bottom } = moreOptionsRef.current.getBoundingClientRect();
      if (bottom > (window.innerHeight || document.documentElement.clientHeight)) {
        setStyle({
          top: '-5.75rem',
          animation: 'fadeFromBottom .2s cubic-bezier(0.1, 0.9, 0.2, 1)',
        });
      }
    }
  }, [moreOptionsRef]);

  return (
    <div
      className={classNames}
      onClick={event => {
        event.stopPropagation();
      }}
      ref={moreOptionsRef}
      style={style}
    >
      {children}
    </div>
  );
};
