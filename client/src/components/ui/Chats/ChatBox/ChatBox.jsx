import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form } from "react-bootstrap";
import {
  setShowChatList,
  setSelectedChat,
} from "../../../../slices/state/chatSlice";
import { toast } from "react-toastify";
import {
  useLazyGetMessageQuery,
  useSendMessageMutation,
} from "../../../../slices/api/messageSlice";
import LeftArrow from "../../../../assets/icons/LeftArrow";
import Loader from "../../Loader/Loader";
import Send from "../../../../assets/icons/Send";
import ChatMessages from "./ChatMessages";
import ChatUserInfoToggle from "./ChatUserInfoToggle";
import styles from "./ChatBox.module.css";
import ChatUserInfo from "./ChatUserInfo";
import { getRemoteUser } from "../../../../utils/chat";

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(null);
  const [fetchingMessages, setFetchingMessages] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);

  const [sendMessage] = useSendMessageMutation();
  const [getMessages] = useLazyGetMessageQuery();
  const { showChatList, chatList, selectedChat } = useSelector(
    (state) => state.chat
  );
  const { userInformation } = useSelector((state) => state.authentication);
  const dispatch = useDispatch();

  function hideChatBox() {
    dispatch(setShowChatList(true));
    dispatch(setSelectedChat(null));
  }

  function handleTyping(e) {
    setMessage(e.target.value);
  }

  async function handleMessageSubmit(e) {
    e.preventDefault();
    try {
      const body = {
        content: message,
        chatId: selectedChat._id,
      };

      setMessage("");
      const response = await sendMessage(body).unwrap();
      console.log(response);
      setMessages((previous) => [...previous, response]);
    } catch (error) {
      toast.error(error?.data?.message);
    }
  }

  async function fetchMessages() {
    if (!selectedChat) return;
    try {
      setFetchingMessages(true);
      const response = await getMessages(selectedChat._id).unwrap();
      setMessages(response);
      setFetchingMessages(false);
    } catch (error) {
      toast.error(error?.data?.message);
    }
  }

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  return (
    <>
      <div
        className={`glass d-${
          showChatList ? "none" : "flex"
        } flex-column d-md-flex ${styles.chats}`}
      >
        {showChatList ? (
          <div className="h-100 d-flex justify-content-center align-items-center">
            <h2>
              {chatList.length === 0
                ? "Find a user and connect..."
                : "Select a chat..."}
            </h2>
          </div>
        ) : (
          <div className="h-100 w-100 d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center mt-1 mx-1">
              <ChatUserInfoToggle setShowUserInfo={setShowUserInfo} />
              <Button
                className="d-block d-md-none btn-secondary"
                onClick={hideChatBox}
              >
                <LeftArrow />
              </Button>
            </div>
            {fetchingMessages ? (
              <div className="h-100 d-flex justify-content-center align-items-center">
                <Loader />
              </div>
            ) : (
              <ChatMessages messages={messages} message={message} />
            )}
            <Form
              className="d-flex w-100 p-1 pt-0"
              style={{ gap: "0.5rem", minHeight: "min-content" }}
              onSubmit={handleMessageSubmit}
            >
              <Form.Group className="flex-grow-1" controlId="message">
                <Form.Control
                  value={message}
                  onChange={handleTyping}
                  type="text"
                  placeholder="Enter a message"
                  required={true}
                  className="glass"
                />
              </Form.Group>
              <Button className="btn-secondary" type="submit">
                <Send />
              </Button>
            </Form>
          </div>
        )}
      </div>
      {selectedChat && (
        <ChatUserInfo
          setShowUserInfo={setShowUserInfo}
          showUserInfo={showUserInfo}
          selectedChat={getRemoteUser(userInformation, selectedChat.users)}
        />
      )}
    </>
  );
}
