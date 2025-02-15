import { configureStore, createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: localStorage.getItem("userId") ? true : false,
    userId: localStorage.getItem("userId") || null, 
  },
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.userId = action.payload;  
    },
    logout(state) {
      localStorage.removeItem("userId");
      state.isLoggedIn = false;
      state.userId = null;  
    },
  },
});

const adminSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: localStorage.getItem("adminId") ? true : false,
  },
  reducers: {
    login(state) {
      state.isLoggedIn = true;
    },
    logout(state) {
      localStorage.removeItem("adminId");
      localStorage.removeItem("token");
      state.isLoggedIn = false;
      window.dispatchEvent(new Event("storage"));
    },
  },
});

export const userActions = userSlice.actions;
export const adminActions = adminSlice.actions;

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    admin: adminSlice.reducer,
  },
});
