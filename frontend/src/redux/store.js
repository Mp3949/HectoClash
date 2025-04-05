// redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import matchReducer from "./matchSlice";
import userReducer from "./userSlice"; // assuming you have authUser in userSlice

export const store = configureStore({
  reducer: {
    match: matchReducer,  // 👈 this key MUST be "match"
    user: userReducer,
  },
});


export default store;



