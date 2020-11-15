import React, { useContext, useState } from 'react';

export interface IErrorContext {
  error: string;
  setError: (error: string) => void;
}

export const ErrorContext = React.createContext<IErrorContext | null>(null);

interface IErrorProviderProps {
  children: React.ReactNode;
}

export const ErrorProvider: React.FC<IErrorProviderProps> = ({ children }) => {
  const [error, setError] = useState('');

  return <ErrorContext.Provider value={{ error, setError }}>{children}</ErrorContext.Provider>;
};

export const useErrorContext = () => {
  const errorContext = useContext(ErrorContext);
  if (!errorContext) {
    throw new Error('Components must be wrapped in ErrorProvider to use ErrorContext');
  }
  return errorContext;
};
