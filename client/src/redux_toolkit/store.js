import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../reducers/authSlice';
import moduleReducer from '../reducers/module1Slice';
import module2Reducer from '../reducers/module2Slice';
import module3Reducer from '../reducers/module3Slice';
const store = configureStore({
  reducer: {
    auth: authReducer.reducer, 
    moduleOne: moduleReducer.reducer,
    moduleTwo: module2Reducer.reducer,
    moduleThree: module3Reducer.reducer
  },
});

export default store;
