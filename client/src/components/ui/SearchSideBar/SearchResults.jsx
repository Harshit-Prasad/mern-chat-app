import React, { useState } from "react";
import { toast } from "react-toastify";
import { useCreateChatMutation } from "../../../slices/api/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { setChatList } from "../../../slices/state/chatSlice";
import Loader from "../Loading/Loader";
import Avatar from "../Avatar/Avatar";

export default function SearchResults({ searchResult }) {
  const [createNewChat, { isLoading }, error] = useCreateChatMutation();
  const [addNewChatId, setAddNewChatId] = useState(null);
  const disptach = useDispatch();
  const { chatList } = useSelector((state) => state.chat);

  async function createChat(userId) {
    try {
      const response = await createNewChat({ userId }).unwrap();
      if (!chatList.find((c) => c._id === response._id)) {
        disptach(setChatList([...chatList, response]));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  return searchResult ? (
    searchResult.map((result) => {
      const { name, email, bgColor, _id } = result;
      return (
        <React.Fragment key={_id}>
          <div
            style={{
              borderRadius: "1em",
              cursor: "pointer",
              gap: "1em",
            }}
            className="glass p-1 d-flex align-items-center mt-1"
            onClick={() => {
              createChat(_id);
              setAddNewChatId(_id);
            }}
          >
            <Avatar size={40} name={name} bgColor={bgColor} />
            <div>
              <p style={{ fontSize: "1.2em", margin: "0" }}>{name}</p>
              <p style={{ fontSize: "1em", margin: "0" }}>{email}</p>
            </div>
          </div>
          {isLoading && addNewChatId === _id && <Loader />}
        </React.Fragment>
      );
    })
  ) : (
    <h2 className="text-center" style={{ fontSize: "1.1em" }}>
      Type the name of the user you are searching for...
    </h2>
  );
}
