import React from "react";
import { useDispatch } from "react-redux";
import SingleProduct from "./SingleProduct";
import { postCart } from "../../redux/slices/cartSlice";

const SingleProductContainer = () => {
  const dispatch = useDispatch();

  // Retrieve product from sessionStorage
  const selectedProduct = JSON.parse(sessionStorage.getItem("selectedProduct") || "{}");
console.log(selectedProduct)
  // Pass postCart as a prop, dispatching the action when called
  const handlePostCart = (cartData) => {
    dispatch(postCart(cartData));
  };

  return <SingleProduct product={selectedProduct} postCart={handlePostCart} />;
};

export default SingleProductContainer;