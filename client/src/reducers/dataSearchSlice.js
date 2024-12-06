import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiGetDataSearchAll, apiGetDataSongSearch, apiGetDataSingerSearch, apiGetDataPlaylistSearch } from "../apis/search";

// Thunk action để lấy dữ liệu tìm kiếm
export const fetchDataSearchAll = createAsyncThunk(
  'dataSearch/fetchDataSearchAll',
  async (text) => {
    const response = await apiGetDataSearchAll(text);
    return response.data;
  }
);

export const fetchDataSongSearch = createAsyncThunk(
  'dataSearch/fetchDataSongSearch',
  async ({ text, page = 1, limit = 5 }) => {
    const response = await apiGetDataSongSearch(text, page, limit);
    return response.data;
  }
);


export const fetchDataSingerSearch = createAsyncThunk(
  'dataSearch/fetchDataSingerSearch',
  async (text) => {
    const response = await apiGetDataSingerSearch(text);
    return response.data;
  }
);

export const fetchDataPlaylistSearch = createAsyncThunk(
  'dataSearch/fetchDataPlaylistSearch',
  async (text) => {
    const response = await apiGetDataPlaylistSearch(text);
    return response.data;
  }
);

const dataSearchReducer = createSlice({
  name: 'dataSearch',
  initialState: {
    dataAllSearch: { countSongAll: 0,counPlaylistAll:0,countPlaylistSingerAll:0,sumPlaylistAll:0, dataSongAll: [],dataPlaylistAll:[] },
    loadingSearchAll: false,
    errorSearchAll: null,

    dataSongSearch: { countSongSearch: 0, listSongSearch: [] },
    loadingSongSearch: false,
    errorSongSearch: null,
    currentPageSong:1,
    totalPageSong:0,
    countSong:0,

    dataSingerSearch: { countSingerSearch: 0, listSingerSearch: [] },
    loadingSingerSearch: false,
    errorSingerSearch: null,

    dataPlaylistSearch: { countPlaylistSearch: 0, listPlaylistSearch: [] },
    loadingPlaylistSearch: false,
    errorPlaylistSearch: null,
  },
  reducers: {
    setCurrentPageSong: (state, action) => {
      state.currentPageSong = action.payload;
    },
  },
  extraReducers: (builder) => {
   
    builder
    
    .addCase(fetchDataSearchAll.pending,(state)=>{
        state.loadingSearchAll= true
    })
    .addCase(fetchDataSearchAll.fulfilled, (state,action)=>{
      state.loadingSearchAll= false
      state.dataAllSearch={
        countSongAll:action.payload.countDataSongAll,
        counPlaylistAll:action.payload.countDataPlaylistAll,
        countPlaylistSingerAll: action.payload.countDataPlaylistSingerAll,
        dataSongAll:action.payload.dataSongAll,
        sumPlaylistAll:action.payload.countplaylistAll,
        dataPlaylistAll:action.payload.playlistAll
      }
      state.errorSearchAll=null
    })
    .addCase(fetchDataSearchAll.rejected,(state,action)=>{
      state.loadingSearchAll=false
      state.errorSearchAll=action.error.message
    })


    //fetch data Bài Hát
    builder
    .addCase(fetchDataSongSearch.pending,(state)=>{
      state.loadingSongSearch = true
    })

    // .addCase(fetchDataSongSearch.fulfilled,(state,action)=>{
    //   state.loadingSongSearch =false
    //   state.dataSongSearch={
    //     countSongSearch:action.payload.count,
    //     listSongSearch:action.payload.dataSongSearch
    //   }
    //   state.totalPageSong=action.payload.totalPage
    //   state.countSong=action.payload.count
    //   state.currentPageSong=action.payload.page
    //   state.errorSongSearch=null
    // })
    .addCase(fetchDataSongSearch.fulfilled, (state, action) => {
      state.loadingSongSearch = false;
      state.dataSongSearch = {
        countSongSearch: action.payload.count,
        listSongSearch: action.payload.dataSongSearch,
      };
      state.totalPageSong = action.payload.totalPage;
      state.countSong = action.payload.count;
      state.currentPageSong = action.payload.page; // Đảm bảo cập nhật đúng page hiện tại
      state.errorSongSearch = null;
    })
    
    .addCase(fetchDataSongSearch.rejected,(state,action)=>{
      state.loadingSongSearch=false
      state.errorSongSearch= action.error.message
    })


    builder

    .addCase(fetchDataPlaylistSearch.pending,(state)=>{
      state.loadingPlaylistSearch = true
    })
    .addCase(fetchDataPlaylistSearch.fulfilled,(state,action)=>{
      state.loadingPlaylistSearch =false
      state.dataPlaylistSearch={
        countPlaylistSearch:action.payload.count,
        listPlaylistSearch:action.payload.dataPlaylistSearch
      }
      state.errorPlaylistSearch=null
    })
    .addCase(fetchDataPlaylistSearch.rejected,(state,action)=>{
      state.loadingPlaylistSearch=false
      state.errorPlaylistSearch= action.error.message
    })


    builder

    .addCase(fetchDataSingerSearch.pending,(state)=>{
      state.loadingSingerSearch = true
    })
    .addCase(fetchDataSingerSearch.fulfilled,(state,action)=>{
      state.loadingSingerSearch =false
      state.dataSingerSearch={
        countSingerSearch:action.payload.count,
        listSingerSearch:action.payload.dataSingerSearch
      }
      state.errorSingerSearch=null
    })
    .addCase(fetchDataSingerSearch.rejected,(state,action)=>{
      state.loadingSingerSearch=false
      state.errorSingerSearch= action.error.message
    })
  }
});

export default dataSearchReducer;
