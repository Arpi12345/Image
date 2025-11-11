import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles/index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* ✅ BrowserRouter must wrap App to make useNavigate() work */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
