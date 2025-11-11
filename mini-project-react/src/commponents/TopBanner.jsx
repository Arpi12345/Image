import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/SearchBox.css"; // ✅ or wherever your tag styles are stored

export default function TopBanner({ onTermClick }) {
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/search/popular");
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
