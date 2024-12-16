  // src/authSlice.js
  import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
  import { apiLogin } from '../apis/authen';

  export const fetchLogin = createAsyncThunk('auth/login'
    ,async(credentials,{rejectWithValue})=>{
    try {
      const response = await apiLogin(credentials)
    return response
    } catch (error) {
      return rejectWithValue(error)
    }
  })


  const initialState = {
    isRegister: false,
    isForgotPassword: false,
    isLogged: false,
    accessToken:null,
    user:null,
    errorLogin:null,
    loading:false
  };

  const authReducer = createSlice({
    name: 'auth',
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
      setLogout:(state)=>{
          state.isLogged=false
          state.accessToken=null
          state.user=null
      }
    },
    extraReducers: (builder)=>{

      builder

      .addCase(fetchLogin.pending,(state)=>{
          state.loading=true
      })
      .addCase(fetchLogin.fulfilled,(state,action)=>{
        state.loading=false
        state.accessToken= action.payload.accessToken
        state.user=action.payload.user
        state.isLogged=true
        state.errorLogin= null
      })

      .addCase(fetchLogin.rejected, (state, action) => {
        state.loading = false;
        state.errorLogin = action.payload
        state.isLogged=false
      });
    }

  });

  export default authReducer;
