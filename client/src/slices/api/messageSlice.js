import { apiSlice } from "./apiSlice";
const USER_URL = "/api/message";

export const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}`,
        method: "POST",
        body: data,
      }),
    }),

    getMessage: builder.query({
      query: (param) => ({
        url: `${USER_URL}/${param}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useSendMessageMutation, useLazyGetMessageQuery } =
  messageApiSlice;
