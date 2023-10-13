import React from "react";
import ChatList from "./ChatList/ChatList";
import ChatBox from "./ChatBox/ChatBox";

export default function Chats() {
  return (
    <div className="h-100 d-flex justify-content-center align-items-center flex-row">
      <ChatList />
      <ChatBox />
    </div>
  );
}
