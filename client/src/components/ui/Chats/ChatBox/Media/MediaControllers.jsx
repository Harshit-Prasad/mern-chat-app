import React from "react";
import { Button } from "react-bootstrap";
import MicMute from "../../../../../assets/icons/MicMute";
import MicUnmute from "../../../../../assets/icons/MicUnmute";
import CameraOn from "../../../../../assets/icons/CameraOn";
import CameraOff from "../../../../../assets/icons/CameraOff";
import Close from "../../../../../assets/icons/Close";

export default function MediaControllers({
  setMuted,
  muted,
  setPlaying,
  playing,
  handleEndVideoCall,
  isVideoCall = false,
}) {
  return (
    <>
      <Button
        style={{
          height: "75px",
          width: "75px",
          borderRadius: "50%",
        }}
        onClick={() => {
          setMuted((previous) => !previous);
        }}
      >
        {muted ? <MicMute /> : <MicUnmute />}
      </Button>
      {isVideoCall && (
        <Button
          style={{
            height: "75px",
            width: "75px",
            borderRadius: "50%",
          }}
          onClick={() => {
            setPlaying((previous) => !previous);
          }}
        >
          {playing ? <CameraOn /> : <CameraOff />}
        </Button>
      )}
      <Button
        style={{
          height: "75px",
          width: "75px",
          borderRadius: "50%",
          backgroundColor: "red",
        }}
        onClick={handleEndVideoCall}
      >
        <Close full />
      </Button>
    </>
  );
}
