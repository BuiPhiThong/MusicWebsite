import { createAsyncThunk , createSlice } from "@reduxjs/toolkit";


import { apiGetModule } from "../apis/public";

export const fetchModuleThreeById = createAsyncThunk('module3/fetchModuleThreeById'
    ,async (tid) =>{
        const response = await apiGetModule(tid)

        return response
})

const module3Reducer = createSlice({
    name:'module3',
    initialState:{
        module3:[],
        loading:false,
        error:null
    },
    reducers:{

    },
    extraReducers:(builder) =>{
        builder

        .addCase(fetchModuleThreeById.pending, (state) =>{
            state.loading= true
        })

        .addCase(fetchModuleThreeById.fulfilled,(state,action)=>{
            state.loading=false
            state.module3= action.payload.mess
            state.error=null
        })

        .addCase(fetchModuleThreeById.rejected, (state, action)=>{
            state.loading = false
            state.error= action.error.message

        })
    }
})

export default module3Reducer