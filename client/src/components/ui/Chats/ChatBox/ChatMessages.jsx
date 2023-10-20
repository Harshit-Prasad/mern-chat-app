import React from "react";
import { isSameUser } from "../../../../utils/chat";
import { useSelector } from "react-redux";
import Avatar from "../../Avatar/Avatar";

export default function ChatMessages({ messages }) {
  const { userInformation } = useSelector((state) => state.authentication);
  return (
    <div
      style={{ borderRadius: "1em", overflowY: "auto" }}
      className={`flex-grow-1 glass d-flex flex-grow-1 flex-column m-1 p-1`}
    >
      {messages &&
        messages.map((m, i) => {
          const addAvatar = isSameUser(messages, m, i, userInformation._id);
          const isRemoteUser =
            m.sender._id !== userInformation._id && m.sender._id;

          return (
            <div
              className="d-flex my-1 w-100"
              style={{ gap: "0.25em" }}
              key={m._id}
            >
              {addAvatar && (
                <Avatar
                  name={m.sender.name}
                  bgColor={m.sender.bgColor}
                  size={40}
                />
              )}
              <p
                style={{
                  margin: "0",
                  backgroundColor: isRemoteUser
                    ? "var(--bs-pink)"
                    : "var(--bs-blue)",
                  borderRadius: "1em",
                  marginLeft:
                    isRemoteUser && addAvatar
                      ? "0"
                      : isRemoteUser && !addAvatar
                      ? "calc(40px + 0.25em"
                      : "auto",
                }}
                className="px-2 py-1"
              >
                {m.content}
              </p>
            </div>
          );
        })}
    </div>
  );
}
