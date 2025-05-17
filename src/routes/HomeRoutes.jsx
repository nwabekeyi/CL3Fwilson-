import React from "react";
import { Navigate } from "react-router-dom";

// Layout Types
import BaseLayout from "../layouts/BaseLayout";

// Route Views
import Home from "../views/Home/HomeContainer";
import SingleProductContainer from "../views/Product/SingleProductContainer";
import CategoryContainer from "../views/Category/CategoryContainer";

const routes = [
  {
    path: "/",
    layout: BaseLayout,
    component: Home, // ✅ Pass reference, not JSX
  },
  {
    path: "/home",
    layout: BaseLayout,
    component: () => <Navigate to="/fashion-cube" replace />, // ✅ use function for redirection
  },
  {
    path: "/fashion-cube/single-product/:id",
    layout: BaseLayout,
    component: SingleProductContainer,
  },
  {
    path: "/fashion-cube/shops/:category",
    layout: BaseLayout,
    component: CategoryContainer,
  },
];

export default routes;
