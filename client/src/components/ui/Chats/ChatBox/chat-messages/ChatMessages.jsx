import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { isSameUser } from "../../../../../utils/chat";
import Avatar from "../../../Avatar/Avatar";

export default function ChatMessages({ message, messages }) {
  const chatMessagesRef = useRef(null);
  const { userInformation } = useSelector((state) => state.authentication);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [message, messages]);

  return (
    <div
      ref={chatMessagesRef}
      style={{
        borderRadius: "10px",
        overflowY: "auto",
        scrollBehavior: "smooth",
      }}
      className={`flex-grow-1 glass d-flex flex-grow-1 flex-column m-1 p-1`}
    >
      {messages &&
        messages.map((m, i) => {
          const addAvatar = isSameUser(messages, m, i, userInformation._id);
          const isRemoteUser =
            m.sender._id !== userInformation._id && m.sender._id;

          // Message timestamp
          const time = new Date(m.createdAt);
          const hours = time.getHours();
          const minutes = time.getMinutes();
          const isPM = hours > 12;
          const addZero = minutes < 10;
          const timeStamp = isPM
            ? `${hours - 12}:${addZero ? "0" + minutes : minutes} PM`
            : `${hours}:${minutes} AM`;

          return (
            <div
              key={m._id}
              className="d-flex my-1 w-100"
              style={{ gap: "0.25em" }}
            >
              {addAvatar && (
                <Avatar
                  name={m.sender.name}
                  bgColor={m.sender.bgColor}
                  size={40}
                />
              )}
              <OverlayTrigger
                className="glass"
                placement={isRemoteUser ? "right" : "left"}
                overlay={
                  <Tooltip id={m._id}>
                    <strong>{timeStamp}</strong>
                  </Tooltip>
                }
              >
                <p
                  style={{
                    margin: "0",
                    maxWidth: "60%",
                    backgroundColor: isRemoteUser
                      ? "var(--bs-pink)"
                      : "var(--bs-blue)",
                    borderRadius: "10px",
                    marginLeft:
                      isRemoteUser && addAvatar
                        ? "0"
                        : isRemoteUser && !addAvatar
                        ? "calc(40px + 0.25em)"
                        : "auto",
                  }}
                  className="px-2 py-1"
                >
                  {m.content}
                </p>
              </OverlayTrigger>
            </div>
          );
        })}
    </div>
  );
}
