// src/components/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // clear previous errors
    try {
      const data = await loginUser(username, password);

      // Save token and role in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);


      // Redirect based on role
      if (data.role === "CUSTOMER") {
        navigate("/"); // Home page for customer
      } else if (data.role === "ADMIN") {
        navigate("/admin"); // Admin dashboard
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-form-container">
        <h2>Login</h2>
        {error && <div className="login-error">{error}</div>}
        <form onSubmit={handleLogin}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
          <button type="submit" className="login-btn-form">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
