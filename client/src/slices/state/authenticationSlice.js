import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInformation: localStorage.getItem("userInformation")
    ? JSON.parse(localStorage.getItem("userInformation"))
    : null,
};

const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInformation = action.payload;
      localStorage.setItem("userInformation", JSON.stringify(action.payload));
    },
    removeCredentials: (state) => {
      state.userInformation = null;
      localStorage.removeItem("userInformation");
    },
  },
});

export const { setCredentials, removeCredentials } =
  authenticationSlice.actions;
export default authenticationSlice.reducer;
