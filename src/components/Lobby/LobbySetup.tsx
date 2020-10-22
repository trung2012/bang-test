import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import './LobbySetup.scss';
import { CustomButton } from '..';
import { useInterval } from '../../hooks';
import {
  selectRoomData,
  selectPlayerName,
  selectPlayerId,
  getRoomData,
  setPlayerId,
  joinRoom,
} from '../../store';
import { Spinner } from '../shared/Spinner';

interface ILobbySetupProps {
  startGame: () => void;
  roomId: string;
}

export const LobbySetup: React.FC<ILobbySetupProps> = ({ startGame, roomId }) => {
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const dispatch = useDispatch();
  const isCopyingSupported = !!document.queryCommandSupported('copy');
  const roomData = useSelector(selectRoomData);
  const playerName = useSelector(selectPlayerName);
  const playerId = useSelector(selectPlayerId);
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
    let startGameTimeout: ReturnType<typeof setTimeout>;
    if (isRoomFull) {
      startGameTimeout = setTimeout(() => startGame(), 2000);
    }

    return () => {
      clearTimeout(startGameTimeout);
    };
  }, [startGame, isRoomFull]);

  useEffect(() => {
    const alreadyJoined = roomData?.players.find(player => player.name === playerName);
    if (alreadyJoined) return;

    const emptySeatId = roomData?.players.find(player => !player.name)?.id;
    if (emptySeatId !== undefined) {
      dispatch(setPlayerId(emptySeatId));
      dispatch(joinRoom(roomId, { playerID: emptySeatId, playerName }));
    }
    return;
  }, [dispatch, playerName, roomData, roomId]);

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
