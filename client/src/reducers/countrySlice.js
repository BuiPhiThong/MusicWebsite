import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiGetTop3Country } from "../apis/public";

// Tạo async thunk để fetch danh sách quốc gia
export const fetchCountries = createAsyncThunk(
  'countries/fetchCountries',
  async () => {
    const response = await apiGetTop3Country(); 
    return response;  
  }
);


const countriesReducer = createSlice({
    name: 'countries',
    initialState: {
      countries: [],  // Danh sách quốc gia
      loadingCountry: false,  // Trạng thái loadingCountry
      errorCountry: null,  // Lỗi khi fetch dữ liệu
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchCountries.pending, (state) => {
          state.loadingCountry = true;  // Đang fetch
        })
        .addCase(fetchCountries.fulfilled, (state, action) => {
          state.loadingCountry = false;  // Fetch thành công
          state.countries = action.payload.mess;  // Cập nhật danh sách quốc gia
        })
        .addCase(fetchCountries.rejected, (state, action) => {
          state.loadingCountry = false;  // Fetch thất bại
          state.errorCountry = action.error.message;  // Cập nhật lỗi
        });
    },
  });
  
  export default countriesReducer;
  