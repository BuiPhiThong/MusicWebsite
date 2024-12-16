import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiGetListenSong } from "../apis/listen";

export const fetchDataListenPlaylist = createAsyncThunk(
  "listenplaylist",
  async (slug) => {
    const response = await apiGetListenSong(slug);
    return response;
  }
);

const listenPlaylistReducer = createSlice({
  name: "listenplaylist",
  initialState: {
    isPlaying: false,
    songProgress: 0,
    volume: 100,
    currentTime: 0,
    duration: 0,
    savedTime: 0,
    showMusicPlayer: false,
    playlistData: [],
    currentSongIndex: 0, // chỉ mục bài hát hiện tại
    audioUrl: "", // Thêm trường audioUrl để lưu trữ URL bài hát
    isLoading: false,
    error: null,
  },
  reducers: {
    togglePlay: (state, action) => {
      state.isPlaying = action.payload ?? !state.isPlaying;
    },
    setSongProgress: (state, action) => {
      state.songProgress = action.payload;
    },
    setVolume: (state, action) => {
      state.volume = action.payload;
    },
    setCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
    },
    setSavedTime: (state, action) => {
      state.savedTime = action.payload;
    },
    toggleMusicPlayer: (state) => {
      state.showMusicPlayer = !state.showMusicPlayer;
    },
    setCurrentSongIndex: (state, action) => {
      state.currentSongIndex = action.payload;
    },
    setAudioUrl: (state, action) => {
      state.audioUrl = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchDataListenPlaylist.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(fetchDataListenPlaylist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.playlistData = action.payload.data;
        state.error = null;
      })
      .addCase(fetchDataListenPlaylist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default listenPlaylistReducer;
