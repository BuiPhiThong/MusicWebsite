import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiGetCurrent } from "../apis/authen";

export const fetchCurrentPlaylist = createAsyncThunk(
    "tool/current",
    async (_, { rejectWithValue }) => {
      try {
        const response = await apiGetCurrent();
        return response;
      } catch (error) {
        return rejectWithValue(error);
      }
    }
  );
const actionUserReducer = createSlice({
    name:'tool',
    initialState:{
        profile:[],
        errorCurrent:null,
        loadingCurrent:false
    },
    extraReducers: (builder)=>{
        builder

        .addCase(fetchCurrentPlaylist.pending,(state)=>{
            state.loadingCurrent=true
        })

        .addCase(fetchCurrentPlaylist.fulfilled,(state,action)=>{
            state.loadingCurrent=false
            state.profile=action.payload.mess
            state.errorCurrent=null
        })

        .addCase(fetchCurrentPlaylist.rejected,(state,action)=>{
            state.loadingCurrent=false
            state.errorCurrent=action.payload
        })
    }
})

export default actionUserReducer