import { apiSlice } from "./apiSlice";
const USER_URL = "/api/notification";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendNotification: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}`,
        method: "POST",
        body: data,
      }),
    }),

    getAllNotifications: builder.query({
      query: () => ({
        url: `${USER_URL}`,
        method: "GET",
      }),
      invalidatesTags: ["Notification"],
    }),

    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `${USER_URL}/${id}`,
        method: "DELETE",
      }),
      providesTags: ["Notification"],
    }),

    deleteAllNotifications: builder.mutation({
      query: () => ({
        url: `${USER_URL}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useSendNotificationMutation,
  useLazyGetAllNotificationsQuery,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
} = userApiSlice;
