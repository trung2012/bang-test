import React, { useContext, useState } from 'react';

export interface IErrorContext {
  error: string;
  notification: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setNotification: React.Dispatch<React.SetStateAction<string>>;
}

export const ErrorContext = React.createContext<IErrorContext | null>(null);

interface IErrorProviderProps {
  children: React.ReactNode;
}

export const ErrorProvider: React.FC<IErrorProviderProps> = ({ children }) => {
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');

  return (
    <ErrorContext.Provider value={{ error, setError, notification, setNotification }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useErrorContext = () => {
  const errorContext = useContext(ErrorContext);
  if (!errorContext) {
    throw new Error('Components must be wrapped in ErrorProvider to use ErrorContext');
  }
  return errorContext;
};
