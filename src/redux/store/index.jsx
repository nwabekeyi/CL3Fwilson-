import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../slices/cartSlice";
import authReducer from "../slices/AuthSlice";
import productReducer from "../slices/productSlice";
import registerReducer from "../slices/RegisterSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    product: productReducer,
    // ...other slices
  },
});
