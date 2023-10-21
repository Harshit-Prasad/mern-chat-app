import React from "react";
import Avatar from "../../Avatar/Avatar";
import { useSelector } from "react-redux";

export default function ChatListItem({ onClick, remoteUser, chatId }) {
  const { selectedChat } = useSelector((state) => state.chat);
  const { bgColor, name } = remoteUser;
  return (
    <div
      style={{
        borderRadius: "10px",
        gap: "1em",
        outline: chatId === selectedChat?._id ? "2px solid white" : "none",
      }}
      className={
        "glass m-1 p-2 d-flex justify-content-start align-items-center"
      }
      role="button"
      onClick={onClick}
    >
      <Avatar size={40} name={name} bgColor={bgColor} />
      <p className="d-flex justify-content-start align-items-center m-0">
        {name}
      </p>
    </div>
  );
}
