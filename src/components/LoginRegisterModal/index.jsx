
 import React from "react";
 import { Modal } from "react-bootstrap";
 import LoginForm from "./LoginForm";
 import RegisterForm from "./RegisterForm";
 import "./style.css";
 import PropTypes from "prop-types";
 
 const LoginRegister = ({ login, registerClicked, loginClicked, onHide, ...modalProps }) => {
   return (
     <Modal
       {...modalProps}
       size="sm"
       aria-labelledby="contained-modal-title-vcenter"
       centered
       id="loginModal"
       className="modal fade login"
     >
       <Modal.Body>
         <div className="modal--close--button" onClick={onHide}>
           <i className="fas fa-times"></i>
         </div>
         {login ? (
           <LoginForm registerClicked={registerClicked} />
         ) : (
           <RegisterForm loginClicked={loginClicked} />
         )}
       </Modal.Body>
     </Modal>
   );
 };
 
 LoginRegister.propTypes = {
   login: PropTypes.bool,
   registerClicked: PropTypes.func,
   loginClicked: PropTypes.func,
   onHide: PropTypes.func,
 };
 
 export default LoginRegister;
 