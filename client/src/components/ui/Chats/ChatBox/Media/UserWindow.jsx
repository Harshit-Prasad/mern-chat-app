import React from "react";
import ReactPlayer from "react-player";

export default function UserWindow({ url }) {
  return (
    <div
      style={{
        maxWidth: "min(100%, 400px)",
        aspectRatio: "4 / 3",
        overflow: "hidden",
        borderRadius: "1em",
      }}
    >
      {url && (
        <>
          <ReactPlayer
            height="100%"
            width="100%"
            playing
            playsinline
            url={url}
          />
        </>
      )}
    </div>
  );
}
