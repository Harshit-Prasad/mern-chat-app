import React, { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form } from "react-bootstrap";
import Lottie from "lottie-react";
import ReactPlayer from "react-player";
import {
  setShowChatList,
  setSelectedChat,
  setChatList,
} from "../../../../slices/state/chatSlice";
import { toast } from "react-toastify";
import {
  useLazyGetMessageQuery,
  useSendMessageMutation,
} from "../../../../slices/api/messageSlice";
import { useSocket } from "../../../../context/socket";
import CallWindow from "../CallWindow/CallWindow";
import ChatMessages from "./ChatMessages";
import ChatUserInfoToggle from "./ChatUserInfoToggle";
import ChatUserInfo from "./ChatUserInfo";
import Loader from "../../Loader/Loader";
import LeftArrow from "../../../../assets/icons/LeftArrow";
import MicMute from "../../../../assets/icons/MicMute";
import MicUnmute from "../../../../assets/icons/MicUnmute";
import CameraOn from "../../../../assets/icons/CameraOn";
import CameraOff from "../../../../assets/icons/CameraOff";
import Send from "../../../../assets/icons/Send";
import VideoCall from "../../../../assets/icons/VideoCall";
import { getRemoteUser } from "../../../../utils/chat";
import typingAnimation from "../../../../assets/animations/typing.json";
import WebRTCPeer from "../../../../services/WebRTCPeer";

import styles from "./ChatBox.module.css";
import Close from "../../../../assets/icons/Close";

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
  const [webRTCPeer, setWebRTCPeer] = useState(new WebRTCPeer());
  const [remoteUserID, setRemoteUserID] = useState();
  const [localStream, setLocalStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [videoCallDisplay, setVideoCallDisplay] = useState(false);
  const [incomingVideoCall, setIncomingVideoCall] = useState(false);

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

  const handleConnected = useCallback(() => {
    setSocketConnected(true);
  }, [setSocketConnected]);

  // Typing indicator logic
  const handleStopTyping = useCallback(() => {
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

  const handleStartTyping = useCallback(() => {
    setIsTyping(true);
  }, [setIsTyping]);

  // Socket connections
  useEffect(() => {
    // Connection setup
    socket.emit("setup", userInformation);
    socket.on("connected", handleConnected);
    // Typing indicator logic
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

  // Real time messaging
  const handleMessageReceived = useCallback(
    (message) => {
      if (
        !selectedChatCompare ||
        message.chat._id !== selectedChatCompare._id
      ) {
        const messageChatID = message.chat._id;
        const messageChat = chatList.find((chat) => {
          return chat._id === messageChatID;
        });
        console.log(messageChat, message);
        const updateMessageChat = { ...messageChat };
        updateMessageChat.latestMessage = { ...message };

        const updateChatList = chatList.slice();
        let updatedChatIndex;

        updateChatList.forEach((chat, i) => {
          if (chat._id === messageChatID) {
            updatedChatIndex = i;
            return;
          }
        });

        updateChatList.splice(updatedChatIndex, 1);
        updateChatList.unshift(updateMessageChat);
        dispatch(setChatList(updateChatList));
      } else {
        setMessages([...messages, message]);
      }
    },
    [selectedChatCompare, messages, message, setMessages, chatList]
  );

  useEffect(() => {
    socket.on("message-recieved", handleMessageReceived);

    return () => {
      socket.off("message-recieved", handleMessageReceived);
    };
  });

  // Making video call
  const handleRemoteUserJoined = useCallback(
    ({ from }) => {
      setRemoteUserID(from);
      socket.emit("local-user-joined", { to: from });
    },
    [setRemoteUserID]
  );

  const handleLocalUserJoined = useCallback(
    ({ from }) => {
      setRemoteUserID(from);
    },
    [setRemoteUserID]
  );

  const handleCallRemoteUser = useCallback(async () => {
    if (remoteUserID) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      const offer = await webRTCPeer.getOffer();
      socket.emit("call-remote-user", { to: remoteUserID, offer });
      setVideoCallDisplay(true);
    } else {
      toast.error("User is inactive");
    }
  }, [remoteUserID, webRTCPeer]);

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      const answer = await webRTCPeer.getAnswer(offer);
      socket.emit("call-accepted", { answer, to: from });
      setIncomingVideoCall(true);
    },
    [setLocalStream, webRTCPeer, setIncomingVideoCall]
  );

  const sendStream = useCallback(() => {
    for (const track of localStream.getTracks()) {
      webRTCPeer.peer.addTrack(track, localStream);
    }
  }, [localStream, webRTCPeer]);

  const handleCallAccepted = useCallback(
    async ({ from, answer }) => {
      await webRTCPeer.setLocalDescription(answer);
      sendStream();
    },
    [sendStream, webRTCPeer]
  );

  const handleCallRejected = useCallback(() => {
    const tracks = localStream.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });

    webRTCPeer.peer.close();
    setWebRTCPeer(new WebRTCPeer());
    setVideoCallDisplay(false);
  }, [webRTCPeer, localStream]);

  const handleAnswerCall = useCallback(() => {
    sendStream();
    setVideoCallDisplay(true);
    setIncomingVideoCall(false);
  }, [sendStream, setVideoCallDisplay]);

  const handleRejectCall = useCallback(() => {
    const tracks = localStream.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });
    socket.emit("call-rejected", { to: remoteUserID });
    webRTCPeer.peer.close();
    setWebRTCPeer(new WebRTCPeer());
    setIncomingVideoCall(false);
  }, [remoteUserID, webRTCPeer, localStream]);

  const handleNegotiationNeeded = useCallback(
    async (e) => {
      const offer = await webRTCPeer.getOffer();
      socket.emit("nego-needed", { offer, to: remoteUserID });
    },
    [webRTCPeer, remoteUserID]
  );

  const handleNegotiationIncoming = useCallback(
    async ({ from, offer }) => {
      const answer = await webRTCPeer.getAnswer(offer);
      socket.emit("nego-done", { to: from, answer });
    },
    [webRTCPeer]
  );

  const handleNegotiationFinal = useCallback(
    async ({ answer }) => {
      await webRTCPeer.setLocalDescription(answer);
    },
    [webRTCPeer]
  );

  const handleIncomingTracks = useCallback(
    (e) => {
      const [stream] = e.streams;
      setRemoteStream(stream);
    },
    [setRemoteStream]
  );

  // Media Controls
  const handleEndVideoCall = useCallback(() => {
    const tracks = localStream.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });
    setRemoteStream(null);
    webRTCPeer.peer.close();
    setVideoCallDisplay(false);
    socket.emit("end-call", { to: remoteUserID });
    setWebRTCPeer(new WebRTCPeer());
  }, [webRTCPeer, localStream, remoteUserID]);

  const handleVideoCallEnded = useCallback(() => {
    const tracks = localStream.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });
    setRemoteStream(null);
    webRTCPeer.peer.close();
    setVideoCallDisplay(false);
    setWebRTCPeer(new WebRTCPeer());
  }, [webRTCPeer, localStream, remoteUserID]);

  useEffect(() => {
    if (!localStream) return;

    const audioTrack = localStream
      .getTracks()
      .find((track) => track.kind === "audio");
    audioTrack.enabled = !muted;
  }, [muted, localStream]);

  useEffect(() => {
    if (!localStream) return;

    const videoTrack = localStream
      .getTracks()
      .find((track) => track.kind === "video");
    videoTrack.enabled = playing;
  }, [localStream, playing]);

  useEffect(() => {
    socket.on("remote-user-joined", handleRemoteUserJoined);
    socket.on("local-user-joined", handleLocalUserJoined);
    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted", handleCallAccepted);
    socket.on("call-rejected", handleCallRejected);
    socket.on("nego-incoming", handleNegotiationIncoming);
    socket.on("nego-final", handleNegotiationFinal);
    socket.on("call-ended", handleVideoCallEnded);

    webRTCPeer.peer.addEventListener(
      "negotiationneeded",
      handleNegotiationNeeded
    );

    webRTCPeer.peer.addEventListener("track", handleIncomingTracks);

    return () => {
      socket.off("remote-user-joined", handleRemoteUserJoined);
      socket.off("local-user-joined", handleLocalUserJoined);
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-accepted", handleCallAccepted);
      socket.off("call-rejected", handleCallRejected);
      socket.off("nego-incoming", handleNegotiationIncoming);
      socket.off("nego-final", handleNegotiationFinal);
      socket.off("call-ended", handleVideoCallEnded);

      webRTCPeer.peer.removeEventListener(
        "negotiationneeded",
        handleNegotiationNeeded
      );

      webRTCPeer.peer.removeEventListener("track", handleIncomingTracks);
    };
  }, [
    handleRemoteUserJoined,
    handleLocalUserJoined,
    handleIncomingCall,
    handleCallAccepted,
    handleCallRejected,
    handleNegotiationIncoming,
    handleNegotiationFinal,
    handleNegotiationNeeded,
    handleIncomingTracks,
    handleVideoCallEnded,
  ]);

  useEffect(() => {
    return () => {
      setRemoteUserID(null);
    };
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
                : "Start a conversation..."}
            </h2>
          </div>
        ) : (
          <div className="h-100 w-100 d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center mt-1 mx-1">
              <div className="d-flex" style={{ gap: "0.5em" }}>
                <ChatUserInfoToggle setShowUserInfo={setShowUserInfo} />
                <Button
                  className="d-block btn-secondary"
                  onClick={handleCallRemoteUser}
                  disabled={incomingVideoCall}
                >
                  <VideoCall />
                </Button>
                {isTyping && (
                  <Lottie loop={true} animationData={typingAnimation} />
                )}
              </div>
              <Button className="d-block btn-secondary" onClick={hideChatBox}>
                <LeftArrow />
              </Button>
            </div>
            {incomingVideoCall && (
              <div
                style={{ borderRadius: "0.5em" }}
                className="glass m-1 mb-0 p-1 d-flex justify-content-evenly align-items-center"
              >
                <Button className="btn-primary" onClick={handleRejectCall}>
                  Reject
                </Button>
                <Button className="btn-secondary" onClick={handleAnswerCall}>
                  Answer
                </Button>
              </div>
            )}
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
        <CallWindow display={videoCallDisplay}>
          <div className="d-flex align-items-center justify-content-evenly flex-column flex-md-row">
            <div
              style={{
                maxWidth: "min(100%, 400px)",
                aspectRatio: "4 / 3",
                borderRadius: "1em",
                overflow: "hidden",
              }}
            >
              <>
                {localStream && (
                  <ReactPlayer
                    height="100%"
                    width="100%"
                    playing
                    playsinline
                    url={localStream}
                  />
                )}
              </>
            </div>
            {"You"}
            <div
              style={{
                maxWidth: "min(100%, 400px)",
                aspectRatio: "4 / 3",
                overflow: "hidden",
                borderRadius: "1em",
              }}
            >
              {remoteStream && (
                <>
                  <ReactPlayer
                    height="100%"
                    width="100%"
                    playing
                    playsinline
                    url={remoteStream}
                  />
                  {"Remote User"}
                </>
              )}
            </div>
          </div>
          <div>
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
          </div>
        </CallWindow>,
        document.getElementById("video-call-window")
      )}
    </>
  );
}
