import React, { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form } from "react-bootstrap";
import {
  setShowChatList,
  setSelectedChat,
  setChatList,
} from "../../../../slices/state/chatSlice";
import { toast } from "react-toastify";
import Lottie from "lottie-react";
import {
  useLazyGetMessageQuery,
  useSendMessageMutation,
} from "../../../../slices/api/messageSlice";
import LeftArrow from "../../../../assets/icons/LeftArrow";
import Loader from "../../Loader/Loader";
import Send from "../../../../assets/icons/Send";
import VideoCall from "../../../../assets/icons/VideoCall";
import ChatMessages from "./ChatMessages";
import ChatUserInfoToggle from "./ChatUserInfoToggle";
import styles from "./ChatBox.module.css";
import ChatUserInfo from "./ChatUserInfo";
import { getRemoteUser } from "../../../../utils/chat";
import { useSocket } from "../../../../context/socket";
import typingAnimation from "../../../../assets/animations/typing.json";
import MediaCallOverlay from "./MediaCallOverlay";

export default function ChatBox() {
  // messaging states
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [fetchingMessages, setFetchingMessages] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedChatCompare, setSelectedChatCompare] = useState();

  // video-calling states
  const [videoCallDisplay, setVideoCallDisplay] = useState(false);

  // messaging API channels
  const socket = useSocket();
  const [sendMessage] = useSendMessageMutation();
  const [getMessages] = useLazyGetMessageQuery();
  const { showChatList, chatList, selectedChat } = useSelector(
    (state) => state.chat
  );
  const { userInformation } = useSelector((state) => state.authentication);
  const dispatch = useDispatch();

  // messaging events
  function hideChatBox() {
    dispatch(setShowChatList(true));
    dispatch(setSelectedChat(null));
  }

  function handleMessageTyping(e) {
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
      socket.emit("new-message", response);
      setMessages((previous) => [...previous, response]);

      const updatedSelectedChat = { ...selectedChat, latestMessage: response };

      const updatedChatList = chatList.slice();
      let updatedChatIndex;

      updatedChatList.forEach((chat, i) => {
        if (chat._id === updatedSelectedChat._id) {
          updatedChatIndex = i;
          return;
        }
      });

      updatedChatList.splice(updatedChatIndex, 1);
      updatedChatList.unshift(updatedSelectedChat);
      console.log(chatList);
      dispatch(setChatList(updatedChatList));
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

      socket.emit("join-chat", selectedChat._id);
    } catch (error) {
      toast.error(error?.data?.message);
    }
  }

  const handleStopTyping = useCallback(() => {
    console.log("typing stopped");
    setIsTyping(false);
  }, [setIsTyping]);

  useEffect(() => {
    if (!socketConnected || !selectedChat) {
      return;
    }

    if (!message) {
      socket.emit("stop-typing", selectedChat._id);
      return;
    }

    console.log(message);

    console.log(message);

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    const TIMER_LENGTH = 3000;
    const lastTypingTime = new Date().getTime();

    const timer = setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDifference = timeNow - lastTypingTime;

      if (timeDifference >= TIMER_LENGTH && typing) {
        socket.emit("stop-typing", selectedChat._id);
        setTyping(false);
      }
    }, TIMER_LENGTH);

    return () => {
      clearTimeout(timer);
    };
  }, [message]);

  const handleConnected = useCallback(() => {
    setSocketConnected(true);
  }, [setSocketConnected]);

  const handleStartTyping = useCallback(() => {
    setIsTyping(true);
  }, [setIsTyping]);

  useEffect(() => {
    socket.emit("setup", userInformation);
    socket.on("connected", handleConnected);
    socket.on("typing", handleStartTyping);
    socket.on("stop-typing", handleStopTyping);

    return () => {
      socket.off("connected", handleConnected);
      socket.off("typing", handleStartTyping);
      socket.off("stop-typing", handleStopTyping);
    };
  }, [userInformation, handleConnected, handleStartTyping, handleStopTyping]);

  useEffect(() => {
    fetchMessages();

    setSelectedChatCompare(selectedChat);
  }, [selectedChat]);

  const handleMessageReceived = useCallback(
    (message) => {
      if (
        !selectedChatCompare ||
        message.chat._id !== selectedChatCompare._id
      ) {
        // Notify
      } else {
        setMessages([...messages, message]);
      }
    },
    [selectedChatCompare, messages, message, setMessages]
  );

  useEffect(() => {
    socket.on("message-recieved", handleMessageReceived);

    return () => {
      socket.off("message-recieved", handleMessageReceived);
    };
  }, [handleMessageReceived]);

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
                : "Start a conversation..."}
            </h2>
          </div>
        ) : (
          <div className="h-100 w-100 d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center mt-1 mx-1">
              <div className="d-flex" style={{ gap: "0.5em" }}>
                <ChatUserInfoToggle setShowUserInfo={setShowUserInfo} />
                <Button
                  className="d-block d-md-none btn-secondary"
                  onClick={() => {
                    setVideoCallDisplay(true);
                  }}
                >
                  <VideoCall />
                </Button>
                {isTyping && (
                  <Lottie loop={true} animationData={typingAnimation} />
                )}
              </div>
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
                  onChange={handleMessageTyping}
                  type="text"
                  placeholder="Enter a message"
                  required={true}
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
      {createPortal(
        <MediaCallOverlay display={videoCallDisplay}></MediaCallOverlay>,
        document.getElementById("video-call-window")
      )}
    </>
  );
}
