// songSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiGetTop1SongsByCountry, apiGetTop2SongsByCountry, apiGetTop3SongsByCountry, apiGetTop4to10SongsByCountry } from "../apis/public";

// Fetch các bài hát top theo quốc gia
export const fetchTop1Songs = createAsyncThunk('songs/fetchTop1songs', async (cid) => {
  const response = await apiGetTop1SongsByCountry(cid);
  return response;
});

export const fetchTop2Songs = createAsyncThunk('songs/fetchTop2songs', async (cid) => {
  const response = await apiGetTop2SongsByCountry(cid);
  return response;
});

export const fetchTop3Songs = createAsyncThunk('songs/fetchTop3songs', async (cid) => {
  const response = await apiGetTop3SongsByCountry(cid);
  return response;
});

export const fetchTop4to10Songs = createAsyncThunk('songs/fetchTop4to10songs', async (cid) => {
  const response = await apiGetTop4to10SongsByCountry(cid);
  return response;
});

// Reducer quản lý bài hát
const songsSlice = createSlice({
  name: 'songs',
  initialState: {
    top1Songs: [],
    top2Songs: [],
    top3Songs: [],
    top4to10Songs: [],
    loadingTop1: false,
    loadingTop2: false,
    loadingTop3: false,
    loadingTop4to10: false,
    errorTop1: null,
    errorTop2: null,
    errorTop3: null,
    errorTop4to10: null,
  },
  extraReducers: (builder) => {
    // Các hành động cho Top 1
    builder
      .addCase(fetchTop1Songs.pending, (state) => {
        state.loadingTop1 = true;
      })
      .addCase(fetchTop1Songs.fulfilled, (state, action) => {
        state.loadingTop1 = false;
        state.top1Songs = action.payload.mess;
        state.errorTop1 = null;
      })
      .addCase(fetchTop1Songs.rejected, (state, action) => {
        state.loadingTop1 = false;
        state.errorTop1 = action.error.message;
      });

    // Các hành động cho Top 2
    builder
      .addCase(fetchTop2Songs.pending, (state) => {
        state.loadingTop2 = true;
      })
      .addCase(fetchTop2Songs.fulfilled, (state, action) => {
        state.loadingTop2 = false;
        state.top2Songs = action.payload.mess;
        state.errorTop2 = null;
      })
      .addCase(fetchTop2Songs.rejected, (state, action) => {
        state.loadingTop2 = false;
        state.errorTop2 = action.error.message;
      });

    // Các hành động cho Top 3
    builder
      .addCase(fetchTop3Songs.pending, (state) => {
        state.loadingTop3 = true;
      })
      .addCase(fetchTop3Songs.fulfilled, (state, action) => {
        state.loadingTop3 = false;
        state.top3Songs = action.payload.mess;
        state.errorTop3 = null;
      })
      .addCase(fetchTop3Songs.rejected, (state, action) => {
        state.loadingTop3 = false;
        state.errorTop3 = action.error.message;
      });

    // Các hành động cho Top 4-10
    builder
      .addCase(fetchTop4to10Songs.pending, (state) => {
        state.loadingTop4to10 = true;
      })
      .addCase(fetchTop4to10Songs.fulfilled, (state, action) => {
        state.loadingTop4to10 = false;
        state.top4to10Songs = action.payload.mess;
        state.errorTop4to10 = null;
      })
      .addCase(fetchTop4to10Songs.rejected, (state, action) => {
        state.loadingTop4to10 = false;
        state.errorTop4to10 = action.error.message;
      });
  },
});

export default songsSlice;
