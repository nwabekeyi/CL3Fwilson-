

 import React, { useState } from "react";
 import { useLocation } from "react-router-dom";
 import LoginRegister from "../LoginRegisterModal";
 import Auth from "../../modules/Auth";
 import { Link } from "react-router-dom";
 
 const TopNavBar = ({ className }) => {
   const [modalShow, setModalShow] = useState(false);
   const [login, setLogin] = useState(true);
   const location = useLocation();
 
   const showHideModal = () => setModalShow(false);
   const loginClicked = () => {
     setModalShow(true);
     setLogin(true);
   };
   const registerClicked = () => {
     setModalShow(true);
     setLogin(false);
   };
 
   const logout = () => {
     Auth.logout();
     window.location.reload();
   };
 
   const user = Auth.getUserDetails();
   const token = Auth.getToken();
   return (
     <div className={`top_nav ${className}`}>
       <div className="container">
         <div className="row">
           <div className="col-md-6">
             <div className="top_nav_left">order from any location</div>
           </div>
           <div className="col-md-6 text-right">
             <div className="top_nav_right">
               <ul className="top_nav_menu">
                 <li className="currency">
                   <a href="#">
                     ngn
                     <i className="fa fa-angle-down"></i>
                   </a>
                   <ul className="currency_selection">
                     <li>
                       <a href="#">eur</a>
                     </li>
                   </ul>
                 </li>
                 {user && token ? (
                   <li className="account">
                     <a href="#">
                       {`Welcome ${user.user_name}`}
                       <i className="fa fa-angle-down"></i>
                     </a>
                     <ul className="account_selection">
                       <li>
                         <a href="#" onClick={logout}>
                           <i
                             className="fas fa-sign-in-alt"
                             aria-hidden="true"
                           ></i>
                           Logout
                         </a>
                       </li>
                     </ul>
                   </li>
                 ) : location.pathname === "/admin" ? (
                   <li className="account">
                     <a href="#">
                       Admin portal
                       <i className="fa fa-angle-down"></i>
                     </a>
                     <ul className="account_selection">
                       <li>
                         <Link to='/sign-in'>
                           <i
                             className="fas fa-sign-in-alt"
                             aria-hidden="true"
                           ></i>
                           Sign In
                         </Link>
                       </li>
                     </ul>
                   </li>
                 ) : null}
               </ul>
             </div>
           </div>
         </div>
       </div>
       {modalShow && (
         <LoginRegister
           show={modalShow}
           login={login}
           registerClicked={registerClicked}
           loginClicked={loginClicked}
           onHide={showHideModal}
         />
       )}
     </div>
   );
 };
 
 export default TopNavBar;
 