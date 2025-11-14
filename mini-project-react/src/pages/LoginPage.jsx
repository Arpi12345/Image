// mini-project-react/src/pages/LoginPage.jsx
import React, { useState } from "react";
import axios from "../api";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("/auth/login", { email, password });
      setUser(res.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleGoogle = () => {
    // redirect browser to backend Google route (uses axios baseURL)
    const backendBase = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
    window.location.href = `${backendBase}/auth/google`;
  };

  return (
    <div style={{ textAlign: "center", marginTop: 60 }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      <hr style={{ width: 300, margin: "20px auto" }} />
      <button onClick={handleGoogle}>Login with Google</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
