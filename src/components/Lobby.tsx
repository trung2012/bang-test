import React, { useState } from 'react';
import { GameClient } from './GameClient';
import { LobbySetup } from './LobbySetup';

export const Lobby = () => {
  const [isGameRunning, setIsGameRunning] = useState(false);

  return isGameRunning ? <GameClient /> : <LobbySetup startGame={() => setIsGameRunning(true)} />;
};
