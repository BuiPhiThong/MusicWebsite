import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGetModule } from "../apis/public";

export const fetchModuleOneByType = createAsyncThunk(
  "module1/fetchModuleOneByType",
  async (tid) => {
    const response = await apiGetModule(tid)

    return response
  }
);

const moduleReducer = createSlice({
    name: 'module1',
    initialState: {
        module1: [],  // Mảng trống là giá trị mặc định
        loading: false,
        error: null  // null là giá trị mặc định của lỗi
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchModuleOneByType.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchModuleOneByType.fulfilled, (state, action) => {
            state.loading = false;
            state.module1 = action.payload.mess;
            state.error = null;
        })
        .addCase(fetchModuleOneByType.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    }
});


  
export default moduleReducer