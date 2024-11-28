import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../reducers/authSlice';
const store = configureStore({
  reducer: {
    auth: authReducer.reducer, // Chèn reducer của auth vào store
  },
});

export default store;
