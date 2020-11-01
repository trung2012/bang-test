import { useRef, useEffect } from 'react';

export const useClickOutside = (callback: (event: React.MouseEvent<HTMLDivElement>) => void) => {
  const innerRef = useRef<HTMLDivElement | null>(null);
  const callbackRef = useRef<Function>();

  // set current callback in ref, before second useEffect uses it
  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    function handleClick(e: any) {
      if (innerRef.current && callbackRef.current && !innerRef.current.contains(e.target)) {
        callbackRef.current(e);
      }
    }

    document.addEventListener('click', handleClick);
    document.addEventListener('contextmenu', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('contextmenu', handleClick);
    };

    // read most recent callback and innerRef dom node from refs
  }, []); // no need for callback + innerRef dep

  return innerRef; // return ref; client can omit `useRef`
};
