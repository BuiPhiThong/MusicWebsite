// src/redux_toolkit/store.js

import { configureStore, combineReducers } from "@reduxjs/toolkit"; // import combineReducers
import authReducer from "../reducers/authSlice";
import moduleReducer from "../reducers/module1Slice";
import module2Reducer from "../reducers/module2Slice";
import module3Reducer from "../reducers/module3Slice";
import top10SongsReducer from "../reducers/topSongSlice";
import countriesReducer from "../reducers/countrySlice";
import songsSlice from "../reducers/topSongSlice";
import popupSearchReducer from "../reducers/popupSearchSlice";
import dataSearchReducer from "../reducers/dataSearchSlice";
import listenPlaylistReducer from "../reducers/listenPlaylistSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Local storage

// Cấu hình redux-persist
const persistConfig = {
  key: "root",
  storage, // Lưu trữ bằng localStorage
  whitelist: ["auth"], // Chỉ lưu reducer auth (có thể thêm các reducer khác nếu cần)
  transforms: [
    // Chỉ lưu các giá trị cần thiết trong auth
    {
      in: (state) => ({
        ...state,
        // Lọc chỉ lưu các state cần thiết
        user: state.user,
        accessToken: state.accessToken,
        isLogged: state.isLogged,
        // Không lưu các thuộc tính không cần thiết
        isRegister: undefined,
        isForgotPassword: undefined,
        errorLogin: undefined,
        loading: undefined,
      }),
      out: (state) => state, // Trả về state nguyên vẹn khi load lại
    },
  ],
};

// Combine reducers của bạn
const rootReducer = combineReducers({
  auth: authReducer.reducer, // Sử dụng .reducer ở đây vì bạn không export reducer trực tiếp từ slice
  moduleOne: moduleReducer.reducer,
  moduleTwo: module2Reducer.reducer,
  moduleThree: module3Reducer.reducer,
  top3Country: countriesReducer.reducer,
  songs: songsSlice.reducer,
  popupSearch: popupSearchReducer.reducer,
  dataSearch: dataSearchReducer.reducer,
  listenPlaylist: listenPlaylistReducer.reducer,
});

// Áp dụng persistReducer cho rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Tạo store với persistedReducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Tắt kiểm tra tuần tự hóa để không bị lỗi với redux-persist
    }),
});

export const persistor = persistStore(store); // Khởi tạo Persistor
export default store;
