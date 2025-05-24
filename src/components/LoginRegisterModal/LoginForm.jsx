import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userLogin } from "../../redux/slices/AuthSlice";
import Validator from "../../utils/Validator";
import { DEFAULT_RULE, EMAIL_RULE } from "../../utils/Validator/rule";
import PropTypes from "prop-types";
import LoadingButton from "../LoadingButton";

const LoginForm = ({ forgotPasswordClicked, registerClicked }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed: ${name}=${value}`); // Debug form inputs
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const { email, password } = formState;
    console.log("Submitting:", { email, password }); // Debug form state

    if (!Validator(email, EMAIL_RULE)) {
      setError("Invalid email format");
      return;
    }

    if (!Validator(password, DEFAULT_RULE)) {
      setError("Password is required");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const result = await dispatch(userLogin({ email, password })).unwrap();
      console.log("Login success:", result); // Debug success
      localStorage.setItem("auth", JSON.stringify(result.token));
      setLoading(false);
      navigate("/admin");
    } catch (error) {
      console.error("Login error:", error);
      setError(error || "Failed to log in. Check your email or password.");
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="login-form">
        <h2>Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
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
      </div>
    </div>
  );
};

LoginForm.propTypes = {
  forgotPasswordClicked: PropTypes.func,
  registerClicked: PropTypes.func,
};

export default LoginForm;