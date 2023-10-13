import React from "react";

export default function ChatListItem({ onClick, remoteUser }) {
  return (
    <div
      style={{ borderRadius: "1em" }}
      className={"glass m-1 p-2"}
      role="button"
      onClick={onClick}
    >
      {remoteUser.name}
    </div>
  );
}
