import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { register } from "../../ServerRequest";

// Async thunk for user registration
export const userRegister = createAsyncThunk(
  "auth/userRegister",
  async ({ fullname, email, password, verifyPassword }, { rejectWithValue }) => {
    try {
      const res = await register(fullname, email, password, verifyPassword);
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  loading: false,
  user: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // You can add sync reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(userRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(userRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default authSlice.reducer;
