import { apiSlice } from "./apiSlice";
const USER_URL = "/api/user";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}`,
        method: "POST",
        body: data,
      }),
    }),

    login: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),

    allUsers: builder.query({
      query: (search) => ({
        url: `${USER_URL}?search=${search}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useLazyAllUsersQuery } =
  userApiSlice;
