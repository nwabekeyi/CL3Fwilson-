import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

// Layout Types
import BaseLayout from "../layouts/BaseLayout";

// Lazy-loaded Components
const WomensProducts = lazy(() => import("../components/Products/WomensProduct.jsx"));
const MensProducts = lazy(() => import("../components/Products/MensProducts.jsx"));
const Home = lazy(() => import("../views/Home/HomeContainer"));
const SingleProductContainer = lazy(() => import("../views/Product/SingleProductContainer"));
const CategoryContainer = lazy(() => import("../views/Category/CategoryContainer"));
const ContactPage = lazy(() => import("../views/Contact"));
const FAQPage = lazy(() => import("../views/FAQ"));
const AboutUsPage = lazy(() => import("../views/About"));
const PageantRegistrationPage = lazy(() => import("../views/pageantryregistrationPage.jsx"));
const PageantVotingPage = lazy(() => import("../views/pageantryVotingpage/index.jsx"));
const Wilster = lazy(() => import("../views/Wilster/index.jsx"));
const AdminPage = lazy(() => import("../views/Admin/adminPage.jsx"));
const LoginForm = lazy(() => import("../components/LoginRegisterModal/LoginForm.jsx"));

// Suspense fallback (can be a spinner or loading UI)
const withSuspense = (Component) => (props) => (
  <Suspense fallback={<div>Loading...</div>}>
    <Component {...props} />
  </Suspense>
);

const routes = [
  {
    path: "/",
    layout: BaseLayout,
    component: withSuspense(Home),
  },
  {
    path: "/admin",
    layout: BaseLayout,
    component: withSuspense(AdminPage),
  },
  {
    path: "/home",
    layout: BaseLayout,
    component: () => <Navigate to="/fashion-cube" replace />,
  },
  {
    path: "/fashion-cube/single-product/:id",
    layout: BaseLayout,
    component: withSuspense(SingleProductContainer),
  },
  {
    path: "/fashion-cube/shops/:category",
    layout: BaseLayout,
    component: withSuspense(CategoryContainer),
  },
  {
    path: "/contact",
    layout: BaseLayout,
    component: withSuspense(ContactPage),
  },
  {
    path: "/faq",
    layout: BaseLayout,
    component: withSuspense(FAQPage),
  },
  {
    path: "/about/cl3fwilson",
    layout: BaseLayout,
    component: withSuspense(AboutUsPage),
  },
  {
    path: "/workshop",
    layout: BaseLayout,
    component: withSuspense(PageantRegistrationPage),
  },
  {
    path: "/workshop/vote",
    layout: BaseLayout,
    component: withSuspense(PageantVotingPage),
  },
  {
    path: "/wilster",
    layout: BaseLayout,
    component: withSuspense(Wilster),
  },
  {
    path: "/mensProduct",
    layout: BaseLayout,
    component: withSuspense(MensProducts),
  },
  {
    path: "/womensProduct",
    layout: BaseLayout,
    component: withSuspense(WomensProducts),
  },
  {
    path: "/sign-in",
    layout: BaseLayout,
    component: withSuspense(LoginForm),
  },
];

export default routes;
