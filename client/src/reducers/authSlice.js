// src/authSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiGetCurrent, apiLogin, apiRefreshToken } from "../apis/authen";

export const fetchLogin = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiLogin(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const fetchCurrent = createAsyncThunk(
  "auth/current",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiGetCurrent();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiRefreshToken();
      if (response?.success) {
        return response.accessToken;
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
const initialState = {
  isRegister: false,
  isForgotPassword: false,
  isLogged: false,
  accessToken: null,
  user: null,
  errorLogin: null,
  errorCurrent: null, // Lưu lỗi cho fetchCurrent
  loading: false,
};

const authReducer = createSlice({
  name: "auth",
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
    setLogout: (state) => {
      state.isLogged = false;
      state.accessToken = null;
      state.user = null;
    },
    updateAccessToken: (state, action) => {
      state.accessToken = action.payload;
      state.isLogged = true;
      let localStorageData = window.localStorage.getItem("persist:root");
      if (localStorageData && typeof localStorageData === "string") {
        localStorageData = JSON.parse(localStorageData);
        const newAuthData = {
          ...JSON.parse(localStorageData.auth),
          accessToken: action.payload,
        };
        localStorageData.auth = JSON.stringify(newAuthData);
        window.localStorage.setItem(
          "persist:root",
          JSON.stringify(localStorageData)
        );
      }
    },
    updateWishlist: (state, action) => {
      if (state.user && state.user.wishlist) {
        const { wishlistId, updatedData } = action.payload;

        // Tìm và cập nhật wishlist trong state
        state.user.wishlist = state.user.wishlist.map((wishlist) =>
          wishlist._id === wishlistId
            ? { ...wishlist, ...updatedData }
            : wishlist
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(fetchLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.isLogged = true;
        state.errorLogin = null;
        let localStorageData = window.localStorage.getItem("persist:root");
        if (localStorageData && typeof localStorageData === "string") {
          localStorageData = JSON.parse(localStorageData);
          const newAuthData = {
            ...JSON.parse(localStorageData.auth),
            accessToken: action.payload.accessToken,
          };
          localStorageData.auth = JSON.stringify(newAuthData);
          window.localStorage.setItem(
            "persist:root",
            JSON.stringify(localStorageData)
          );
        }
      })

      .addCase(fetchLogin.rejected, (state, action) => {
        state.loading = false;
        state.errorLogin = action.payload;
        state.isLogged = false;
      })

      // Fetch Current User
      .addCase(fetchCurrent.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrent.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.mess;
        state.errorCurrent = null; // Clear error on success
      })
      .addCase(fetchCurrent.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.errorCurrent = action.payload;
      });

    builder
      .addCase(refreshAccessToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload;
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { updateAccessToken, setLogout } = authReducer.actions;

export default authReducer;
