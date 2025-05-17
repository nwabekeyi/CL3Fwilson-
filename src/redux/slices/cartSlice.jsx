import { createSlice } from "@reduxjs/toolkit";

// Helpers
const CART_KEY = "cart_local";

const loadCart = () => {
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

const initialState = {
  items: loadCart(),
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    getCartBegin(state) {
      state.loading = true;
      state.error = null;
    },
    getCartSuccess(state, action) {
      state.loading = false;
      state.items = action.payload;
    },
    getCartFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    postCartBegin(state) {
      state.loading = true;
      state.error = null;
    },
    postCartSuccess(state, action) {
      state.loading = false;
      state.items = action.payload;
    },
    postCartFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getCartBegin,
  getCartSuccess,
  getCartFail,
  postCartBegin,
  postCartSuccess,
  postCartFail,
} = cartSlice.actions;

export default cartSlice.reducer;

// Thunks

export const getCartByUserId = () => (dispatch) => {
  try {
    dispatch(getCartBegin());
    const cart = loadCart();
    dispatch(getCartSuccess(cart));
  } catch (err) {
    dispatch(getCartFail(err.toString()));
  }
};

export const postCart = (productId, increase = false, decrease = false) => (dispatch, getState) => {
  try {
    dispatch(postCartBegin());

    const state = getState();
    let cart = [...state.cart.items];

    const index = cart.findIndex((item) => item.productId === productId);

    if (index !== -1) {
      // Update existing item
      if (increase) cart[index].quantity += 1;
      if (decrease && cart[index].quantity > 1) cart[index].quantity -= 1;
    } else {
      // Add new item
      cart.push({ productId, quantity: 1 });
    }

    saveCart(cart);
    dispatch(postCartSuccess(cart));
  } catch (err) {
    dispatch(postCartFail(err.toString()));
  }
};
