// src/commponents/TopBanner.jsx
import React, { useEffect, useState } from "react";
import axios from "../api";
import "../styles/SearchBox.css";

export default function TopBanner({ onTermClick }) {
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await axios.get("/api/search/top-searches");
        setPopular(res.data);
      } catch (error) {
        console.error("Error loading popular searches:", error);
      }
    };
    fetchPopular();
  }, []);

  return (
    <div className="top-banner">
      <h3>Popular Searches:</h3>
      <div className="top-terms">
        {popular.length > 0 ? popular.map((item, idx) => (
          <span key={idx} className="clickable-term" onClick={() => onTermClick(item.term)}>
            {item.term}
          </span>
        )) : <p style={{ color: "#777" }}>Loading...</p>}
      </div>
    </div>
  );
}
