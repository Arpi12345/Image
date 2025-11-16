import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./styles/index.css"; 
import "./styles/App.css";
import "./styles/SearchBox.css";
import "./styles/InfoBox.css";
  // ⬅️ add this line (old project CSS)

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
