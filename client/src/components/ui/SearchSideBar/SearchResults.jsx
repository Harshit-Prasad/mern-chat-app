import React from "react";
import { toast } from "react-toastify";
import { useCreateChatMutation } from "../../../slices/api/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { setChatList } from "../../../slices/state/chatSlice";

export default function SearchResults({ searchResult }) {
  const [createNewChat, { isLoading }, error] = useCreateChatMutation();
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
      const [avatar] = name.toUpperCase();
      return (
        <div
          style={{
            borderRadius: "1em",
            cursor: "pointer",
          }}
          className="glass p-1 d-flex align-items-center"
          key={_id}
          onClick={() => {
            createChat(_id);
          }}
        >
          <div
            style={{
              height: "40px",
              width: "40px",
              borderRadius: "50%",
              backgroundColor: bgColor,
            }}
            className="d-flex m-1 justify-content-center align-items-center"
          >
            {avatar}
          </div>
          <div>
            <p style={{ fontSize: "1.2em", margin: "0" }}>{name}</p>
            <p style={{ fontSize: "1em", margin: "0" }}>{email}</p>
          </div>
        </div>
      );
    })
  ) : (
    <h2 className="text-center" style={{ fontSize: "1.1em" }}>
      Type the name of the user you are searching for...
    </h2>
  );
}
