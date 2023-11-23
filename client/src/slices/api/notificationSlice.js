import { apiSlice } from "./apiSlice";
const USER_URL = "/api/notification";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    send: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}`,
        method: "POST",
        body: data,
      }),
    }),

    getAllNotifications: builder.query({
      query: (search) => ({
        url: `${USER_URL}?search=${search}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useSendMutation, useLazyGetAllNotificationsQuery } =
  userApiSlice;
