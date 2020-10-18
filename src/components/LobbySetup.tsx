import React, { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import './LobbySetup.scss';

import {
  getRoomData,
  joinRoom,
  selectPlayerCredentials,
  selectPlayerId,
  selectPlayerName,
  selectRoomData,
  setPlayerCredentials,
  setPlayerId,
} from '../store/lobbyStore';
import { CustomButton } from './CustomButton';
import { lobbyService } from '../api';
import { useInterval } from '../hooks';
import { Spinner } from './Spinner';

interface ILobbySetupProps {
  startGame: () => void;
}

export const LobbySetup: React.FC<ILobbySetupProps> = ({ startGame }) => {
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const dispatch = useDispatch();
  const { roomId } = useParams<{ roomId: string }>();
  const isCopyingSupported = !!document.queryCommandSupported('copy');
  const roomData = useSelector(selectRoomData);
  const playerName = useSelector(selectPlayerName);
  const playerId = useSelector(selectPlayerId);
  const playerToken = useSelector(selectPlayerCredentials);
  const isRoomFull = roomData?.players.every(player => player.name);

  const copyLinkToClipboard = () => {
    const linkElement = document.getElementById('lobby-link') as HTMLInputElement;
    linkElement?.select();
    document.execCommand('copy');
  };

  useInterval(() => {
    dispatch(getRoomData(roomId));
  }, 1000);

  useEffect(() => {
    if (isRoomFull) {
      setTimeout(() => startGame(), 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRoomFull]);

  useEffect(() => {
    if (!playerToken) {
      const alreadyJoined = roomData?.players.find(player => player.name === playerName);
      if (alreadyJoined) {
        dispatch(setPlayerId(alreadyJoined.id));
        return;
      }

      const emptySeatId = roomData?.players.find(player => !player.name)?.id;
      if (emptySeatId !== undefined) {
        dispatch(setPlayerId(emptySeatId));
      }
      dispatch(joinRoom(roomId, { playerID: playerId!, playerName }));
    }
  }, [dispatch, playerId, playerName, playerToken, roomData, roomId]);

  useEffect(() => {
    const leaveWhenWindowIsClosed = (ev: Event) => {
      ev.preventDefault();

      if (playerId) {
        lobbyService.leaveRoom(roomId, playerId, playerToken);
      }
      localStorage.removeItem('bang-playerCredentials');
    };

    window.addEventListener('beforeunload', leaveWhenWindowIsClosed);

    return () => {
      if (playerId) {
        lobbyService.leaveRoom(roomId, playerId, playerToken);
      }
      localStorage.removeItem('bang-playerCredentials');
      window.removeEventListener('beforeunload', leaveWhenWindowIsClosed);
    };
  }, [playerId, playerToken]);

  return (
    <div className='lobby'>
      <h2>Invite Players</h2>
      <p>Send a link to your friends to invite them to your game</p>
      <div className='lobby-link-container'>
        <input
          className='custom-input'
          id='lobby-link'
          value={window.location.href}
          onChange={() => {}}
        />
        {isCopyingSupported && (
          <CustomButton
            text={isLinkCopied ? 'Copied' : 'Copy'}
            onClick={() => {
              copyLinkToClipboard();
              setIsLinkCopied(true);
              setTimeout(() => {
                setIsLinkCopied(false);
              }, 2000);
            }}
          />
        )}
      </div>
      <div className='lobby-players'>
        {roomData?.players ? (
          roomData?.players.map(player => {
            return (
              <div
                key={player.id}
                className={classnames('lobby-player', {
                  'lobby-player-active': !!player.name,
                })}
              >
                {player.name ? (
                  <p>
                    {player.name} {player.name === playerName && player.id === playerId && ' (You)'}
                  </p>
                ) : (
                  <p>Waiting for player...</p>
                )}
              </div>
            );
          })
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
};
