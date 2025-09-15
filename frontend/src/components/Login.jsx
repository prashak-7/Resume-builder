import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../utils/helper";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";

import { authStyles as styles } from "../assets/dummystyle";
import { Input } from "./Inputs";

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Please enter password");
      return;
    }
    setError("");

    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      const { token } = res.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(res.data);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again"
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerWrapper}>
        <h3 className={styles.title}>Welcome Back</h3>
        <p className={styles.subtitle}>
          Signin to continue building amazing resumes
        </p>
      </div>

      <form onSubmit={handleLogin} className={styles.form}>
        <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label={"Email"}
          placeHolder={"you@example.com"}
          type="email"
        />
        <Input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          label="Password"
          placeHolder="Password"
          type="password"
        />

        {error && <div className={styles.errorMessage}>{error}</div>}
        <button type="submit" className={styles.submitButton}>
          Sign In
        </button>
        <p className={styles.switchText}>
          Don't have an account?{" "}
          <button
            className={styles.switchButton}
            type="button"
            onClick={() => setCurrentPage("signup")}
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
