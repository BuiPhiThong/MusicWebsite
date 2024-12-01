import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../reducers/authSlice';
import moduleReducer from '../reducers/module1Slice';
import module2Reducer from '../reducers/module2Slice';
import module3Reducer from '../reducers/module3Slice';
import top10SongsReducer from '../reducers/topSongSlice';
import countriesReducer from '../reducers/countrySlice';
import songsSlice from '../reducers/topSongSlice';
import popupSearchReducer from '../reducers/popupSearchSlice';
const store = configureStore({
  reducer: {
    auth: authReducer.reducer, 
    moduleOne: moduleReducer.reducer,
    moduleTwo: module2Reducer.reducer,
    moduleThree: module3Reducer.reducer,
    top3Country: countriesReducer.reducer,
    songs: songsSlice.reducer,
    popupSearch:popupSearchReducer.reducer,
  },
});

export default store;
