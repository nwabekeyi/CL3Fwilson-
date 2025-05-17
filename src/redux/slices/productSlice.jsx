import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../axios/API";

// Async thunks for all API calls
export const getAllProducts = createAsyncThunk(
  "products/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API({ method: "GET", url: `/products` });
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getProduct = createAsyncThunk(
  "products/getOne",
  async (id, { rejectWithValue }) => {
    try {
      const res = await API({ method: "GET", url: `/products/${id}` });
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getProductsByCategory = createAsyncThunk(
  "products/getByCategory",
  async (category, { rejectWithValue }) => {
    try {
      const res = await API({ method: "GET", url: `/products?category=${category}` });
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const search = createAsyncThunk(
  "products/search",
  async (query, { rejectWithValue }) => {
    try {
      const res = await API({ method: "GET", url: `/search?query=${query}` });
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const applyFilters = createAsyncThunk(
  "products/applyFilters",
  async (filterString, { rejectWithValue }) => {
    try {
      const res = await API({ method: "GET", url: `/products?${filterString}` });
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Initial state for product slice
const initialState = {
  products: [],
  product: null,
  loading: false,
  error: null,
  searchResults: [],
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // You can add sync reducers here if needed
  },
  extraReducers: (builder) => {
    // getAllProducts
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

    // getProduct
    builder
      .addCase(getProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

    // getProductsByCategory
    builder
      .addCase(getProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

    // search
    builder
      .addCase(search.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(search.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(search.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

    // applyFilters
    builder
      .addCase(applyFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(applyFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default productSlice.reducer;
