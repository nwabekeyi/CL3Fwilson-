import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Helpers
const CART_KEY = "cart_local";

const loadCart = () => {
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

// Initial state
const initialState = {
  items: loadCart(),
  loading: false,
  error: null,
};

// Async thunks
export const getCartByUserId = createAsyncThunk(
  "cart/getCartByUserId",
  async (_, { rejectWithValue }) => {
    try {
      const cart = loadCart();
      return cart;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

export const postCart = createAsyncThunk(
  "cart/postCart",
  async ({ productId, quantity = 1, increase = false, decrease = false, variantDetails = {} }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      let cart = [...state.cart.items];

      const index = cart.findIndex((item) => item.productId === productId);

      if (index !== -1) {
        // Update existing item
        if (increase) {
          cart[index].quantity += 1;
        } else if (decrease && cart[index].quantity > 1) {
          cart[index].quantity -= 1;
        } else {
          // Add to cart with specified quantity
          cart[index].quantity += quantity;
        }
      } else if (!decrease) {
        // Add new item with specified quantity
        cart.push({
          productId,
          quantity,
          ...variantDetails,
        });
      }

      saveCart(cart);
      return cart;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (productId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      let cart = [...state.cart.items];
      cart = cart.filter((item) => item.productId !== productId);
      saveCart(cart);
      return cart;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      saveCart([]);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCartByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCartByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getCartByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(postCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(postCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;