import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { lobbyService } from '../../api';
import { selectPlayerCredentials, selectPlayerId, setRoomData } from '../../store';
import { GameClient } from '../GameClient';
import { Header } from '../shared/Header';
import { LobbySetup } from './LobbySetup';

export const Lobby = () => {
  const [isGameRunning, setIsGameRunning] = useState(false);
  const dispatch = useDispatch();
  const playerId = useSelector(selectPlayerId);
  const playerToken = useSelector(selectPlayerCredentials);
  const { roomId } = useParams<{ roomId: string }>();

  useEffect(() => {
    const leaveWhenWindowIsClosed = (ev: Event) => {
      ev.preventDefault();

      if (playerId !== null && playerToken) {
        dispatch(setRoomData(null));
        lobbyService.leaveRoom(roomId, playerId, playerToken);
      }
    };

    window.addEventListener('beforeunload', leaveWhenWindowIsClosed);

    return () => {
      if (playerId !== null && playerToken) {
        dispatch(setRoomData(null));
        lobbyService.leaveRoom(roomId, playerId, playerToken);
      }
      window.removeEventListener('beforeunload', leaveWhenWindowIsClosed);
    };
  }, [playerId, playerToken, roomId, dispatch]);

  return isGameRunning && playerId !== null ? (
    <GameClient roomId={roomId} playerId={playerId} playerCredentials={playerToken} debug={true} />
  ) : (
    <>
      <Header />
      <LobbySetup roomId={roomId} startGame={() => setIsGameRunning(true)} />
    </>
  );
};
