import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ImageApp from "./pages/ImageApp";
import DetailPage from "./pages/DetailPage";

axios.defaults.baseURL = import.meta.env.VITE_API_URL ;
axios.defaults.withCredentials = true;

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // fetch current user session on load
 useEffect(() => {
  // First check (normal load)
  axios.get("/auth/current-user")
    .then((res) => {
      setUser(res.data.user);
      setLoading(false);
    })
    .catch(() => {
      setUser(null);
      setLoading(false);
    });

  // Second check (supports Google OAuth)
  const timer = setTimeout(() => {
    axios.get("/auth/current-user")
      .then((res) => {
        if (res.data.user) {
          setUser(res.data.user);
        }
      })
      .catch(() => {});
  }, 800); // wait 0.8 sec for cookie

  return () => clearTimeout(timer);
}, []);


  const handleLogout = async () => {
    await axios.get("/auth/logout");
    setUser(null);
    navigate("/login");
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;

  return (
    <Routes>
      <Route path="/login" element={<LoginPage setUser={setUser} />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/"
        element={
          user ? (
            <ImageApp user={user} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/show/:id"
        element={
          user ? (
            <DetailPage user={user} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}
