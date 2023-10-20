import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/api/apiSlice";
import authentication from "./slices/state/authenticationSlice";
import chat from "./slices/state/chatSlice";
import message from "./slices/state/messageSlice";

const store = configureStore({
  reducer: {
    authentication,
    chat,
    message,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),

  devTools: true,
});

export default store;
