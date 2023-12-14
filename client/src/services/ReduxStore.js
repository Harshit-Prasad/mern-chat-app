import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../slices/api/apiSlice";
import authentication from "../slices/state/authenticationSlice";
import chat from "../slices/state/chatSlice";
import notification from "../slices/state/notificationSlice";

const store = configureStore({
  reducer: {
    authentication,
    chat,
    notification,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),

  devTools: false,
});

export default store;
