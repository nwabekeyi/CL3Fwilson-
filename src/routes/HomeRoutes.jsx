import React from "react";
import { Navigate } from "react-router-dom";

// Layout Types
import BaseLayout from "../layouts/BaseLayout";

// Route Views
import Home from "../views/Home/HomeContainer";
import SingleProductContainer from "../views/Product/SingleProductContainer";
import CategoryContainer from "../views/Category/CategoryContainer";
import ContactPage from "../views/Contact";
import FAQPage from "../views/FAQ";
import AboutUsPage from "../views/About";
import PageantRegistrationPage from "../views/pageantryregistrationPage.jsx";
import PageantVotingPage from "../views/pageantryVotingpage/index.jsx";

const routes = [
  {
    path: "/",
    layout: BaseLayout,
    component: Home, // ✅ Pass reference, not JSX
  },
  {
    path: "/admin",
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
  {
    path: "/contact",
    layout: BaseLayout,
    component: ContactPage,
  },
  {
    path: "/faq",
    layout: BaseLayout,
    component: FAQPage,
  },
  {
    path: "/about/cl3fwilson",
    layout: BaseLayout,
    component: AboutUsPage,
  },
  {
    path: "/workshop/register",
    layout: BaseLayout,
    component: PageantRegistrationPage,
  },
  {
    path: "/workshop/vote",
    layout: BaseLayout,
    component: PageantVotingPage,
  },
];

export default routes;
