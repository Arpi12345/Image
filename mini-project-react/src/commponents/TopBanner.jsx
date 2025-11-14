import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/SearchBox.css";

export default function TopBanner({ onTermClick }) {
  const [popular, setPopular] = useState([]);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await axios.get(`${API}/api/search/popular`, {
          withCredentials: true,
        });
        setPopular(res.data);
      } catch (error) {
        console.error("Error loading popular searches:", error);
      }
    };
    fetchPopular();
  }, [API]);

  return (
    <div className="top-banner">
      <h3>Popular Searches:</h3>
      <div className="top-terms">
        {popular.length > 0 ? (
          popular.map((item, index) => (
            <span
              key={index}
              className="clickable-term"
              onClick={() => onTermClick(item.term)}
            >
              {item.term}
            </span>
          ))
        ) : (
          <p style={{ color: "#777" }}>Loading...</p>
        )}
      </div>
    </div>
  );
}
