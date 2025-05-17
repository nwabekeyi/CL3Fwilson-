/*
 ** Author: Santosh Kumar Dash
 ** Author URL: http://santoshdash.epizy.com/
 ** Github URL: https://github.com/quintuslabs/fashion-cube
 */

 import React from "react";
 import {
   BrowserRouter as Router,
   Routes,
   Route,
   Navigate,
 } from "react-router-dom";
 import { registerNav } from "../modules/Navigation";
 import HomeRoutes from "./HomeRoutes";
 import PrivateRoutes from "./PrivateRoutes";
 import PageNotFound from "../views/PageNotFound";
 import Auth from "../modules/Auth";
 
 const isAuthenticated = () =>
   Auth.getUserDetails() !== undefined &&
   Auth.getUserDetails() !== null &&
   Auth.getToken() !== undefined;
 
 const AppRoutes = () => {
   return (
     <Router ref={registerNav}>
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
     </Router>
   );
 };
 
 export default AppRoutes;
 