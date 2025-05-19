import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../axios/API";

// Async thunks for all API calls
export const getAllProducts = createAsyncThunk(
  "products/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API({ method: "GET", url: `/products` });
      return res.data; // Ensure only data is returned
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch products");
    }
  }
);

export const getProduct = createAsyncThunk(
  "products/getOne",
  async (id, { rejectWithValue }) => {
    try {
      const res = await API({ method: "GET", url: `/products/${id}` });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || `Failed to fetch product ${id}`);
    }
  }
);

export const getProductsByCategory = createAsyncThunk(
  "products/getByCategory",
  async (category, { rejectWithValue }) => {
    try {
      const res = await API({ method: "GET", url: `/products?category=${category}` });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || `Failed to fetch category ${category}`);
    }
  }
);

export const search = createAsyncThunk(
  "products/search",
  async (query, { rejectWithValue }) => {
    try {
      const res = await API({ method: "GET", url: `/search?query=${query}` });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || `Search failed for query ${query}`);
    }
  }
);

export const applyFilters = createAsyncThunk(
  "products/applyFilters",
  async (filterString, { rejectWithValue }) => {
    try {
      const res = await API({ method: "GET", url: `/products?${filterString}` });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to apply filters");
    }
  }
);

// Initial state for product slice
const initialState = {
  products: [],
  product: null,
  selectedProduct: null,
  loading: false,
  error: null,
  searchResults: [],
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
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
        state.error = action.payload;
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
        state.error = action.payload;
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
        state.error = action.payload;
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
        state.error = action.payload;
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
        state.error = action.payload;
      });
  },
});

export const { setSelectedProduct, clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;