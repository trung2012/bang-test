import React from "react";
import { useDispatch } from "react-redux";
import { CustomButton } from "./CustomButton";
import { createGameRoom } from "../store/lobbyStore";

export const CreateGameButton = ({ numPlayers }) => {
  const dispatch = useDispatch();

  return (
    <CustomButton
      text={numPlayers.toString()}
      onClick={() => {
        dispatch(createGameRoom(numPlayers));
      }}
    />
  );
};
