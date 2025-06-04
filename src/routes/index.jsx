import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { registerNav } from "../modules/Navigation";
import HomeRoutes from "./HomeRoutes";
import PrivateRoutes from "./PrivateRoutes";
import PageNotFound from "../views/PageNotFound";
import Auth from "../modules/Auth";
import { FaWhatsapp } from "react-icons/fa";

const isAuthenticated = () =>
  Auth.getUserDetails() !== undefined &&
  Auth.getUserDetails() !== null &&
  Auth.getToken() !== undefined;

// Create a wrapper component to render WhatsApp icon based on location
const WhatsAppWrapper = ({ children }) => {
  const location = useLocation();
  const showWhatsApp = !location.pathname.includes("wilster") && !location.pathname.includes("admin");
console.log(showWhatsApp)
  return (
    <>
      {children}
      {showWhatsApp && (
        <a
          href="https://wa.me/message/2YZ3Y7ILSIIAJ1"
          className="whatsapp-icon"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact us on WhatsApp"
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            fontSize: "2.5rem",
            color: "#25D366",
            zIndex: 10000,
            cursor: "pointer",
          }}
        >
          <FaWhatsapp />
        </a>
      )}
    </>
  );
};

const AppRoutes = () => {
  return (
    <Router ref={registerNav}>
      <WhatsAppWrapper>
        <Routes>
          {HomeRoutes.map(({ path, exact, layout: Layout, component: Component }, index) => (
            <Route
              key={index}
              path={path}
              element={
                <Layout>
                  <Component />
                </Layout>
              }
            />
          ))}

          {PrivateRoutes.map(({ path, exact, layout: Layout, component: Component }, index) => (
            <Route
              key={index}
              path={path}
              element={
                isAuthenticated() ? (
                  <Layout>
                    <Component />
                  </Layout>
                ) : (
                  <Navigate to="/PageNotFound" replace />
                )
              }
            />
          ))}

          {/* Catch-all route for 404 */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </WhatsAppWrapper>
    </Router>
  );
};

export default AppRoutes;
