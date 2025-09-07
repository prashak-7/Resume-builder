import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { authStyles as styles } from "../assets/dummystyle";
import { validateEmail } from "../utils/helper";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";
import { Input } from "./Inputs";

const SignUp = ({ setCurrentPage }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!fullName) {
      setError("Please enter fullname");
      return;
    }
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
      const res = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
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
    <div className={styles.signupContainer}>
      <div className={styles.headerWrapper}>
        <h3 className={styles.signupTitle}>Create Account</h3>
        <p className={styles.signupSubtitle}>
          Join thousands of professionals today
        </p>
      </div>

      <form className={styles.signupForm} onSubmit={handleSignup}>
        <Input
          value={fullName}
          onChange={({ target }) => setFullName(target.value)}
          label={"Full Name"}
          placeHolder={"Enter full name"}
          type="text"
        />
        <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label={"Email"}
          placeHolder={"email@example.com"}
          type="email"
        />
        <Input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          label={"Full Name"}
          placeHolder={"Min 8 characters"}
          type="password"
        />

        {error && <div className={styles.errorMessage}>{error}</div>}
        <button type="submit" className={styles.signupSubmit}>
          Create Account
        </button>

        <p className={styles.switchText}>
          Already have an account? {""}
          <button
            onClick={() => setCurrentPage("login")}
            type="button"
            className={styles.signupSwitchButton}
          >
            Sign In
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
