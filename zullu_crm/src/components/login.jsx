import React, { useState, useEffect } from "react";
import "./login.scss";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const DUMMY_EMAIL = "info@fitoja.in";
  const DUMMY_PASSWORD = "Newyork78@";

  useEffect(() => {
    const token = localStorage.getItem("crm_token");
    if (token) navigate("/home");
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === DUMMY_EMAIL && password === DUMMY_PASSWORD) {
      localStorage.setItem("crm_token", "dummy_token_123");
      navigate("/home");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-wrapper">
      {/* Left Branding Section */}
      <div className="login-left">
        <h1>Zullu CRM</h1>
        <p>Manage your business smarter, faster & better.</p>
      </div>

      {/* Right Form Section */}
      <div className="login-right">
        <div className="login-card">
          <h2>Welcome Back 👋</h2>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="error">{error}</p>}

            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
