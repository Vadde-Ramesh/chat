import React, { useState, useContext } from "react";
import { registerUser } from "../../api/auth.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import { FaUser, FaLock } from "react-icons/fa";

const RegisterForm = ({ switchToLogin }) => {
  const { loginUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser(username, password);
      loginUser({ username, token: null });
      switchToLogin();
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-form">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleRegister}>
        <div className="input-icon">
          <FaUser />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-icon">
          <FaLock />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <span onClick={switchToLogin}>Login</span>
      </p>
    </div>
  );
};

export default RegisterForm;
