import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useLazyGetChatQuery } from "../../../../slices/api/chatSlice";
import {
  setChatList,
  setSelectedChat,
  setShowChatList,
} from "../../../../slices/state/chatSlice";
import { getRemoteUser } from "../../../../utils/chat";
import Skeleton from "../../Skeleton/Skeleton";

import styles from "./ChatList.module.css";
import ChatListItem from "./ChatListItem";

export default function ChatList() {
  const [getChats, { isLoading }] = useLazyGetChatQuery();

  const { chatList, showChatList } = useSelector((state) => state.chat);
  const { userInformation } = useSelector((state) => state.authentication);
  const dispatch = useDispatch();

  function selectChat(chat) {
    dispatch(setSelectedChat(chat));
    dispatch(setShowChatList(false));
  }

  useEffect(() => {
    (async () => {
      try {
        const response = await getChats().unwrap();
        dispatch(setChatList([...response]));
      } catch (error) {
        toast.error(error?.data?.message);
      }
    })();
  }, []);

  return (
    <div
      className={`glass d-${showChatList ? "block" : "none"} d-md-block ${
        styles["chat-list"]
      } p-1`}
    >
      {isLoading ? (
        <Skeleton length={8} />
      ) : (
        chatList.map((chat) => {
          const remoteUser = getRemoteUser(userInformation, chat?.users);

          return (
            <ChatListItem
              key={chat?._id}
              onClick={() => selectChat(chat)}
              remoteUser={remoteUser}
              chat={chat}
            />
          );
        })
      )}
    </div>
  );
}
