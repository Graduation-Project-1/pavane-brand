import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    AdminToken: localStorage.getItem("AdminToken")
  },
  reducers: {
    login(state, action) {
      localStorage.setItem("AdminToken", action.payload.AdminToken);

      state.AdminToken = localStorage.getItem("AdminToken");
    },

    logout(state) {
      state.AdminToken = localStorage.getItem("AdminToken");
    }
  }
})

export const authActions = authSlice.actions;
export default authSlice.reducer;