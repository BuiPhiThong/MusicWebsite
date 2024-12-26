import { createSlice } from "@reduxjs/toolkit";


const themeReducer = createSlice({
    name:'theme',
    initialState:{
        isDarkMode:false
    },
    reducers:{
        toggleDarkMode:(state)=>{
            state.isDarkMode=!state.isDarkMode
        }
    }
})

export default themeReducer