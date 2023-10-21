import React from "react";
import { Modal, Button, Badge } from "react-bootstrap";
import Close from "../../../../assets/icons/Close";
import Avatar from "../../Avatar/Avatar";

export default function ChatUserInfo({
  showUserInfo,
  setShowUserInfo,
  selectedChat,
}) {
  function hideUserInfo() {
    setShowUserInfo(false);
  }
  const { name, email, bgColor, createdAt } = selectedChat;
  const time = new Date(createdAt);
  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const date = time.getDate();

  return (
    <Modal
      onHide={hideUserInfo}
      keyboard={true}
      backdrop={true}
      centered={true}
      size="sm"
      show={showUserInfo}
    >
      <Modal.Header className="py-2">
        <Avatar size={40} bgColor={bgColor} name={name} />
        <Button size="sm" variant="primary" onClick={hideUserInfo}>
          <Close />
        </Button>
      </Modal.Header>
      <Modal.Body className="py-2">
        <h2> {name}</h2>
        <h3>{email}</h3>
        <h4>
          <Badge bg="secondary">
            User since -{year}-{month}-{date}
          </Badge>
        </h4>
      </Modal.Body>
    </Modal>
  );
}
