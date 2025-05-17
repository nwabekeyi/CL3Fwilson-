import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login } from "../../ServerRequest";

// Async thunk for user login
export const userLogin = createAsyncThunk(
  "auth/userLogin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await login(email, password);
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Thunk for inserting token from localStorage
export const insertToken = () => (dispatch) => {
  const storedAuth = localStorage.getItem("auth");
  if (storedAuth) {
    const token = JSON.parse(storedAuth);
    dispatch(insertTokenSuccess(token));
  } else {
    dispatch(insertTokenFail());
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
    token: null,
    error: null,
    tokenInserted: false,
  },
  reducers: {
    insertTokenSuccess(state, action) {
      state.token = action.payload;
      state.tokenInserted = true;
    },
    insertTokenFail(state) {
      state.token = null;
      state.tokenInserted = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
        state.token = action.payload.token || null;
        state.error = null;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { insertTokenSuccess, insertTokenFail } = authSlice.actions;

export default authSlice.reducer;
