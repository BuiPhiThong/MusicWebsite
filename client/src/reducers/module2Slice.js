import { createAsyncThunk , createSlice } from "@reduxjs/toolkit";
import { apiGetModule } from "../apis/public";


export const fetchModuleTwoById = createAsyncThunk('module2/fetchModuleTwoById'
    , async (tid)=>{
        const response = await apiGetModule(tid)
        return response
    })

    const module2Reducer = createSlice({
        name:'module2',
        initialState:{
            module2:[],
            loading:false,
            error:null
        },
        reducers:{

        },
        extraReducers:(builder) =>{
            builder
            .addCase(fetchModuleTwoById.pending, (state)=>{
                state.loading=true
            })

            .addCase(fetchModuleTwoById.fulfilled, (state,action)=>{
                state.loading= false
                state.module2= action.payload.mess
                state.error=null
            })

            .addCase(fetchModuleTwoById.rejected, (state,action)=>{
                state.loading=false
                state.error= action.error.message
            })
        }

    })

    export default module2Reducer
