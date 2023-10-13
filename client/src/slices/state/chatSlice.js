import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chatList: [],
  showChatList: true,
  selectedChat: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatList: (state, action) => {
      state.chatList = action.payload;
    },
    setShowChatList: (state, action) => {
      state.showChatList = action.payload;
    },
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
  },
});

export const { setChatList, setShowChatList, setSelectedChat } =
  chatSlice.actions;
export default chatSlice.reducer;
