// components/common/NavBarContainer.js (or NavBar.jsx directly if no need for a container)

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "./NavBar";
import { getCartByUserId } from "../../redux/slices/cartSlice";

const NavBarContainer = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items); // updated: state.cart.items instead of cart.cart

  useEffect(() => {
    dispatch(getCartByUserId());
  }, [dispatch]);

  return <NavBar cart={cart} />;
};

export default NavBarContainer;
