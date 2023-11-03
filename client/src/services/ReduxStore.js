import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../slices/api/apiSlice";
import authentication from "../slices/state/authenticationSlice";
import chat from "../slices/state/chatSlice";

const store = configureStore({
  reducer: {
    authentication,
    chat,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),

  devTools: true,
});

export default store;
