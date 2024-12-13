import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";
import userSlice from "./slice/userSlice";
import goalSlice from "./slice/goalSlice";
import progressSlice from "./slice/progressSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    goal: goalSlice,
    progress: progressSlice,
  },
});

export default store;
