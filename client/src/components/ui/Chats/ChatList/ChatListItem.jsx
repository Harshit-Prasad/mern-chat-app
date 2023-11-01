import React from "react";
import Avatar from "../../Avatar/Avatar";
import { useSelector } from "react-redux";

export default function ChatListItem({ onClick, remoteUser, chat }) {
  const { selectedChat } = useSelector((state) => state.chat);
  const { bgColor, name } = remoteUser;
  return (
    <div
      style={{
        borderRadius: "10px",
        gap: "1em",
        outline: chat?._id === selectedChat?._id ? "2px solid white" : "none",
      }}
      className={
        "glass m-1 p-2 d-flex justify-content-start align-items-center"
      }
      role="button"
      onClick={onClick}
    >
      <Avatar size={40} name={name} bgColor={bgColor} />
      <div className="d-flex flex-column justify-content-start m-0">
        <p className="m-0">{name}</p>
        {chat.latestMessage && (
          <p className="m-0">
            <strong>
              {chat?.latestMessage?.sender._id === remoteUser._id
                ? remoteUser.name + ": "
                : "You: "}
            </strong>
            {chat?.latestMessage?.content}
          </p>
        )}
      </div>
    </div>
  );
}
