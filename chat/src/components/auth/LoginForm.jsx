import React, { useState, useContext } from "react";
import { loginUser as loginAPI } from "../../api/auth.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import { FaUser, FaLock } from "react-icons/fa";

const LoginForm = ({ switchToRegister }) => {
  const { loginUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginAPI(username, password);
      const token = res.data.token;
      loginUser({ username, token });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-form">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <span onClick={switchToRegister}>Register</span>
      </p>
    </div>
  );
};

export default LoginForm;
