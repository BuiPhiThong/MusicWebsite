import  { createAsyncThunk, createAction, createSlice} from '@reduxjs/toolkit'

import {apiPopupSearch} from '../apis/public'

export const fetchDataPopupSearch = createAsyncThunk('popupsearch/fetDataPopupSearch'
    , async(text)=>{
        const response = await apiPopupSearch(text)
        // console.log(response);
        
        return response

})

const popupSearchReducer = createSlice({
    name:'popupsearch',
    initialState:{
        loadingPopup:false,
        dataPopup:[],
        errorPopup:null
    },
    reducers:{},
    extraReducers: (builder)=>{
        builder
        .addCase(fetchDataPopupSearch.pending,(state)=>{
            state.loadingPopup=true
        })

        .addCase(fetchDataPopupSearch.fulfilled,(state,action)=>{
            state.loadingPopup=false
            state.dataPopup=action.payload?.dataPopup
            state.errorPopup= null
        })

        .addCase(fetchDataPopupSearch.rejected,(state,action)=>{
            state.loadingPopup=false
            state.errorPopup=action.error.message
        })
    }
})
export default popupSearchReducer