// src/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isRegister: false,
  isForgotPassword: false,
};

const authReducer = createSlice({
  name: 'auth',
  initialState,
  reducers: {

    setRegister: (state, action) => {
      state.isRegister = action.payload;
    },
    setForgotPassword: (state, action) => {
      state.isForgotPassword = action.payload;
    },
    toggleRegister: (state) => {
      state.isRegister = !state.isRegister;
    },
    toggleForgotPassword: (state) => {
      state.isForgotPassword = !state.isForgotPassword;
    },
  },

});

// export const { setRegister, setForgotPassword, toggleRegister, toggleForgotPassword } = authSlice.actions;

export default authReducer;
