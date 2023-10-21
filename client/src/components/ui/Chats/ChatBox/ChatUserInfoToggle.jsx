import React from "react";
import { Button } from "react-bootstrap";
import Info from "../../../../assets/icons/Info";

export default function ChatUserInfoToggle({ setShowUserInfo }) {
  function showUserInfo() {
    setShowUserInfo(true);
  }
  return (
    <Button onClick={showUserInfo} className="btn-secondary d-inline">
      <Info />
    </Button>
  );
}
