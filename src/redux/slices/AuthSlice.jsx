import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Async thunk for user login
export const userLogin = createAsyncThunk(
  "auth/userLogin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      return {
        user: { email: user.email, uid: user.uid },
        token: await user.getIdToken(), // Firebase ID token
      };
    } catch (error) {
      return rejectWithValue(error.message); // Store only the error message
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
    clearError(state) {
      state.error = null;
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
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Stores error message (string)
      });
  },
});

export const { insertTokenSuccess, insertTokenFail, clearError } = authSlice.actions;

export default authSlice.reducer;