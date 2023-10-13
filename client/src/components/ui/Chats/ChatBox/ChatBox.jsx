import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import LeftArrow from "../../../../assets/icons/LeftArrow";
import {
  setShowChatList,
  setSelectedChat,
} from "../../../../slices/state/chatSlice";

import styles from "./ChatBox.module.css";

export default function ChatBox() {
  const { showChatList, chatList, selectedChat } = useSelector(
    (state) => state.chat
  );
  const dispatch = useDispatch();

  function hideChatBox() {
    dispatch(setShowChatList(true));
    dispatch(setSelectedChat(null));
  }

  return (
    <div
      className={`glass d-${showChatList ? "none" : "block"} d-md-block ${
        styles.chats
      }`}
    >
      {showChatList ? (
        <div className="h-100 d-flex justify-content-center align-items-center">
          <h2>
            {chatList.length === 0
              ? "Find a user and connect..."
              : "Select a chat..."}
          </h2>
        </div>
      ) : (
        <>
          <Button
            className="d-block d-md-none ms-auto btn-secondary"
            onClick={hideChatBox}
          >
            <LeftArrow />
          </Button>
          <div>{JSON.stringify(selectedChat._id)}</div>
        </>
      )}
    </div>
  );
}
