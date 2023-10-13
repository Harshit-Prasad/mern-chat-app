import { apiSlice } from "./apiSlice";
const USER_URL = "/api/chat";

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createChat: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    getChat: builder.query({
      query: () => ({
        url: `${USER_URL}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useCreateChatMutation, useLazyGetChatQuery } = chatApiSlice;
