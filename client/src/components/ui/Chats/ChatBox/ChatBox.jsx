import React, { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form } from "react-bootstrap";
import { BeatLoader } from "react-spinners";
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
import { useSendNotificationMutation } from "../../../../slices/api/notificationSlice";
import { setNotification } from "../../../../slices/state/notificationSlice";
import { useSocket } from "../../../../context/socket";
import CallWindow from "./Media/CallWindow";
import ChatMessages from "./ChatMessages/ChatMessages";
import Loader from "../../Loading/Loader";
import LeftArrow from "../../../../assets/icons/LeftArrow";
import Send from "../../../../assets/icons/Send";
import VideoCall from "../../../../assets/icons/VideoCall";
import { getRemoteUser } from "../../../../utils/chat";
import WebRTCPeer from "../../../../services/WebRTCPeer";
import Avatar from "../../Avatar/Avatar";
import UserWindow from "./Media/UserWindow";
import MediaControllers from "./Media/MediaControllers";
import styles from "./ChatBox.module.css";
import VoiceCall from "../../../../assets/icons/VoiceCall";

export default function ChatBox() {
  // messaging states
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [fetchingMessages, setFetchingMessages] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedChatCompare, setSelectedChatCompare] = useState();

  // calling states
  const [webRTCPeer, setWebRTCPeer] = useState(new WebRTCPeer());
  const [remoteUserID, setRemoteUserID] = useState();
  const [localStream, setLocalStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [isVideoCall, setIsVideoCall] = useState();
  const [videoCallDisplay, setVideoCallDisplay] = useState(false);
  const [incomingVideoCall, setIncomingVideoCall] = useState(false);

  // messaging API channels
  const socket = useSocket();
  const dispatch = useDispatch();
  const [sendMessage] = useSendMessageMutation();
  const [getMessages] = useLazyGetMessageQuery();
  const [sendNotification] = useSendNotificationMutation();
  const { showChatList, chatList, selectedChat } = useSelector(
    (state) => state.chat
  );
  const { userInformation } = useSelector((state) => state.authentication);
  const { notification } = useSelector((state) => state.notification);

  // messaging events
  function hideChatBox() {
    dispatch(setShowChatList(true));
    dispatch(setSelectedChat(null));
  }

  function handleMessageTyping(e) {
    setMessage(() => e.target.value);
  }

  async function handleMessageSubmit(e) {
    e.preventDefault();
    try {
      const body = {
        content: message,
        chatId: selectedChat._id,
      };

      setMessage("");
      const messageResponse = await sendMessage(body).unwrap();

      const remoteUser = getRemoteUser(
        userInformation,
        messageResponse.chat.users
      );

      let notificationResponse;

      if (!remoteUserID) {
        notificationResponse = await sendNotification({
          to: remoteUser._id,
          from: userInformation._id,
          chat: selectedChat._id,
        }).unwrap();
      }

      socket.emit("new-message", {
        message: messageResponse,
        notification: notificationResponse,
      });

      setMessages((previous) => [...previous, messageResponse]);
      const updatedSelectedChat = {
        ...selectedChat,
        latestMessage: messageResponse,
      };

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

  const handleStartTyping = useCallback(() => {
    setIsTyping(true);
  }, [setIsTyping]);

  useEffect(() => {
    if (!socketConnected || !selectedChat) {
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

      if (timeDifference >= TIMER_LENGTH) {
        socket.emit("stop-typing", selectedChat._id);
        setTyping(false);
      }
    }, TIMER_LENGTH);

    return () => {
      clearTimeout(timer);
    };
  }, [message]);

  // Socket connections
  useEffect(() => {
    // Connection setup
    socket.emit("setup", userInformation._id);
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
    ({ message, notification: newNotification }) => {
      if (
        !selectedChatCompare ||
        message.chat._id !== selectedChatCompare._id
      ) {
        // Updating the Chat list based on most recent message
        const messageChatID = message.chat._id;
        const messageChat = chatList.find((chat) => {
          return chat._id === messageChatID;
        });

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

        // Update Notification
        const updatedNotification = notification.slice();
        console.log(newNotification);
        const remoteUserId = newNotification.from._id;
        let notificationIndex;

        updatedNotification.forEach((notify, i) => {
          if (notify.from._id === remoteUserId) {
            notificationIndex = i;
            return;
          }
        });

        if (notificationIndex !== undefined) {
          updatedNotification.splice(notificationIndex, 1);
        }

        updatedNotification.unshift(newNotification);
        dispatch(setNotification(updatedNotification));
      } else {
        setMessages([...messages, message]);
      }
    },
    [
      selectedChatCompare,
      messages,
      message,
      setMessages,
      chatList,
      notification,
    ]
  );

  useEffect(() => {
    socket.on("message-recieved", handleMessageReceived);

    return () => {
      socket.off("message-recieved", handleMessageReceived);
    };
  });

  // Making video call
  const handleError = useCallback(() => {
    socket.emit("error", { to: remoteUserID });
    setVideoCallDisplay(false);
    if (localStream) {
      const tracks = localStream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
      setLocalStream(null);
    }
    webRTCPeer.peer.close();
    setWebRTCPeer(new WebRTCPeer());
    toast.error("Something went wrong, Try again");
  }, [localStream, remoteUserID, webRTCPeer]);

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

  const handleCallRemoteUser = useCallback(
    async (isVideoCall) => {
      if (remoteUserID) {
        setIsVideoCall(isVideoCall);
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: isVideoCall,
            audio: true,
          });
          const audioTrack = stream.getAudioTracks()[0];
          audioTrack.applyConstraints({
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          });
          setLocalStream(stream);
          const offer = await webRTCPeer.getOffer();
          socket.emit("call-remote-user", {
            to: remoteUserID,
            offer,
            isVideoCall,
          });
          setVideoCallDisplay(true);
        } catch (error) {
          handleError();
        }
      } else {
        const currentUser = getRemoteUser(userInformation, selectedChat.users);
        const currentUserId = currentUser._id;

        socket.emit("miss-call", { to: currentUserId, from: userInformation });
        toast.error("User is inactive");
      }
    },
    [
      remoteUserID,
      webRTCPeer,
      localStream,
      selectedChat,
      userInformation,
      handleError,
    ]
  );

  const handleIncomingCall = useCallback(
    async ({ from, offer, isVideoCall }) => {
      setIsVideoCall(isVideoCall);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoCall,
        audio: true,
      });
      const audioTrack = stream.getAudioTracks()[0];
      audioTrack.applyConstraints({
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
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
    toast.error("Call rejected");
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
    setRemoteStream(null);
    socket.emit("call-rejected", { to: remoteUserID });
    webRTCPeer.peer.close();
    setWebRTCPeer(new WebRTCPeer());
    setIncomingVideoCall(false);
  }, [remoteUserID, webRTCPeer, localStream]);

  const handleNegotiationNeeded = useCallback(
    async (e) => {
      try {
        const offer = await webRTCPeer.getOffer();
        socket.emit("nego-needed", { offer, to: remoteUserID });
      } catch (error) {
        handleError();
      }
    },
    [webRTCPeer, remoteUserID, handleError]
  );

  const handleNegotiationIncoming = useCallback(
    async ({ from, offer }) => {
      try {
        const answer = await webRTCPeer.getAnswer(offer);
        socket.emit("nego-done", { to: from, answer });
      } catch (error) {
        handleError;
      }
    },
    [webRTCPeer, handleError]
  );

  const handleNegotiationFinal = useCallback(
    async ({ answer }) => {
      try {
        await webRTCPeer.setLocalDescription(answer);
      } catch (error) {
        handleError;
      }
    },
    [webRTCPeer, handleError]
  );

  const handleIncomingTracks = useCallback(
    (e) => {
      const [stream] = e.streams;
      setRemoteStream(stream);
    },
    [setRemoteStream]
  );

  const handleCallMissed = useCallback(({ from }) => {
    const { name } = from;
    toast.info(`Missed Call from: ${name}`);
  }, []);

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

    toast.info("Call has ended");
  }, [webRTCPeer, localStream, remoteUserID]);

  const handleVideoCallEnded = useCallback(() => {
    const tracks = localStream.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });
    setRemoteStream(null);
    webRTCPeer.peer.close();
    setVideoCallDisplay(false);
    setIncomingVideoCall(false);
    setWebRTCPeer(new WebRTCPeer());

    toast.info("Call has ended");
  }, [webRTCPeer, localStream, remoteUserID]);

  const handleErrorOccured = useCallback(() => {
    if (localStream) {
      const tracks = localStream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
    }

    setRemoteStream(null);
    setVideoCallDisplay(false);
    webRTCPeer.peer.close();
    setWebRTCPeer(new WebRTCPeer());
    toast.error("Something went wrong, Try again");
  }, [webRTCPeer, localStream, remoteUserID]);

  const handleRemoteUserLeft = useCallback(() => {
    setRemoteUserID(null);
  }, []);

  useEffect(() => {
    if (!localStream) return;

    const audioTrack = localStream
      .getTracks()
      .find((track) => track.kind === "audio");
    audioTrack.enabled = !muted;
  }, [muted, localStream]);

  useEffect(() => {
    if (!localStream || !isVideoCall) return;

    const videoTrack = localStream
      .getTracks()
      .find((track) => track.kind === "video");
    videoTrack.enabled = isVideoCall && playing;
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
    socket.on("remote-user-left", handleRemoteUserLeft);
    socket.on("error-occured", handleErrorOccured);
    socket.on("call-missed", handleCallMissed);

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
      socket.off("remote-user-left", handleRemoteUserLeft);
      socket.off("error-occured", handleErrorOccured);
      socket.off("call-missed", handleCallMissed);

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
    handleCallMissed,
    handleNegotiationIncoming,
    handleNegotiationFinal,
    handleNegotiationNeeded,
    handleIncomingTracks,
    handleVideoCallEnded,
    handleRemoteUserLeft,
    handleErrorOccured,
  ]);

  useEffect(() => {
    if (!selectedChat) return;

    return () => {
      console.log("unmounted");
      setRemoteUserID(null);
      socket.emit("leave-chat", selectedChat._id);
    };
  }, [selectedChat]);

  console.log(localStream, remoteStream);

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
              <div
                className="d-flex align-items-center"
                style={{ gap: "0.5em" }}
              >
                {selectedChat && (
                  <Avatar
                    name={
                      getRemoteUser(userInformation, selectedChat.users).name
                    }
                    bgColor={
                      getRemoteUser(userInformation, selectedChat.users).bgColor
                    }
                    size={50}
                  />
                )}
                <Button
                  className="d-block btn-secondary"
                  onClick={handleCallRemoteUser.bind(this, true)}
                  disabled={incomingVideoCall}
                >
                  <VideoCall />
                </Button>
                <Button
                  className="d-block btn-secondary"
                  onClick={handleCallRemoteUser.bind(this, false)}
                  disabled={incomingVideoCall}
                >
                  <VoiceCall />
                </Button>
                {isTyping && (
                  <div
                    className="glass d-flex justify-content-center align-items-center py-1 px-2"
                    style={{
                      borderRadius: "1em",
                    }}
                  >
                    <BeatLoader color="#ffffff" />
                  </div>
                )}
              </div>
              <Button
                className="d-block d-md-none btn-secondary"
                onClick={hideChatBox}
              >
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
      {createPortal(
        selectedChat && (
          <CallWindow display={videoCallDisplay}>
            <div className="d-flex align-items-center justify-content-evenly flex-column flex-md-row">
              <UserWindow
                url={localStream}
                isVideoCall={isVideoCall}
                remoteUser={getRemoteUser(userInformation, selectedChat?.users)}
              />
              <UserWindow url={remoteStream} isVideoCall={isVideoCall} />
            </div>
            <div className="d-flex mt-2" style={{ gap: "1em" }}>
              <MediaControllers
                setMuted={setMuted}
                muted={muted}
                setPlaying={setPlaying}
                playing={playing}
                handleEndVideoCall={handleEndVideoCall}
                isVideoCall={isVideoCall}
              />
            </div>
          </CallWindow>
        ),
        document.getElementById("video-call-window")
      )}
    </>
  );
}
