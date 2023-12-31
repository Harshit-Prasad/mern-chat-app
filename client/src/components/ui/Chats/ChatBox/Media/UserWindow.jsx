import React from "react";
import ReactPlayer from "react-player";
import Avatar from "../../../Avatar/Avatar";
import styles from "./UserWindow.module.css";

export default function UserWindow({
  url,
  isVideoCall = false,
  remoteUser = false,
}) {
  return (
    <div
      style={{
        aspectRatio: isVideoCall && "4 / 3",
      }}
      className={`${styles["user-window"]} mt-1`}
    >
      {isVideoCall ? (
        <>
          <ReactPlayer
            height="100%"
            width="100%"
            playing
            playsinline
            url={url}
          />
        </>
      ) : remoteUser ? (
        <>
          <Avatar
            name={remoteUser.name}
            bgColor={remoteUser.bgColor}
            size={150}
          />
          <>
            <ReactPlayer height="0%" width="0%" playing playsinline url={url} />
          </>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
