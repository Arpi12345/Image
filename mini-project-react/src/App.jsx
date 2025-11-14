// mini-project-react/src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import axios from "./api";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ImageApp from "./pages/ImageApp";
import DetailPage from "./pages/DetailPage";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/auth/current-user")
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));

    // extra check for OAuth flow (cookie might arrive shortly)
    const timer = setTimeout(() => {
      axios.get("/auth/current-user")
        .then((res) => {
          if (res.data.user) setUser(res.data.user);
        })
        .catch(()=>{});
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    await axios.get("/auth/logout");
    setUser(null);
    navigate("/login");
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: 50 }}>Loading...</p>;

  return (
    <Routes>
      <Route path="/login" element={<LoginPage setUser={setUser} />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/" element={user ? <ImageApp user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
      <Route path="/show/:id" element={user ? <DetailPage user={user} /> : <Navigate to="/login" replace />} />
    </Routes>
  );
}
