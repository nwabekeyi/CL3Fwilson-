// components/LoginForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Auth from "../../modules/Auth";
import Validator from "../../utils/Validator";
import { DEFAULT_RULE, EMAIL_RULE } from "../../utils/Validator/rule";
import PropTypes from "prop-types";
import LoadingButton from "../LoadingButton";

const LoginForm = ({ forgotPasswordClicked, registerClicked }) => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed: ${name}=${value}`);
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const { email, password } = formState;
    console.log("Submitting:", { email, password });

    if (!Validator(email, EMAIL_RULE)) {
      setError("Invalid email format");
      setShowErrorModal(true);
      return;
    }

    if (!Validator(password, DEFAULT_RULE)) {
      setError("Password is required");
      setShowErrorModal(true);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const auth = getAuth();
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const token = await user.getIdToken();
      Auth.setUserToken({
        token,
        user_id: user.uid,
        user_name: user.displayName || email,
        email,
      });
      console.log("Login success:", { email, user_id: user.uid });

      window.dispatchEvent(new Event("storage"));
      localStorage.setItem(
        "auth",
        JSON.stringify({
          token,
          user_id: user.uid,
          user_name: user.displayName || email,
          email,
        })
      );

      setLoading(false);
      navigate("/admin");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Failed to log in. Check your email or password.");
      setShowErrorModal(true);
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowErrorModal(false);
    setError("");
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      <div className="form-group">
        <input
          type="email"
          className="form-control"
          placeholder="Email"
          id="UserName"
          name="email"
          value={formState.email}
          onChange={handleChange}
          autoComplete="off"
        />
        <i className="fa fa-user"></i>
      </div>
      <div className="form-group log-status">
        <input
          type="password"
          className="form-control"
          placeholder="Password"
          id="Password"
          name="password"
          value={formState.password}
          onChange={handleChange}
          autoComplete="off"
        />
        <i className="fa fa-lock"></i>
      </div>
      <a className="link" href="#" onClick={forgotPasswordClicked}>
        Lost your password?
      </a>
      <LoadingButton
        type="button"
        className="log-btn"
        loading={loading}
        onClick={handleSubmit}
      >
        Log in
      </LoadingButton>
      <div
        onClick={registerClicked}
        style={{
          textAlign: "center",
          fontSize: 12,
          color: "#c4c4c4",
          cursor: "pointer",
        }}
      >
        New user? Please Register
      </div>

      {/* Bootstrap Error Modal */}
      <div
        className={`modal fade ${showErrorModal ? "show d-block" : ""}`}
        tabIndex="-1"
        role="dialog"
        style={{ backgroundColor: showErrorModal ? "rgba(0,0,0,0.5)" : "transparent" }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Login Error</h5>
            </div>
            <div className="modal-body">
              <p>Invalid login credentials</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

LoginForm.propTypes = {
  forgotPasswordClicked: PropTypes.func,
  registerClicked: PropTypes.func,
};

export default LoginForm;