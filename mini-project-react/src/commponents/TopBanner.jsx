import React, { useEffect, useState } from "react";
import api from "../api";
import "../styles/SearchBox.css";

export default function TopBanner({ onTermClick }) {
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await api.get("/api/search/popular");
        setPopular(res.data);
      } catch (error) {
        console.log("Popular load error:", error);
      }
    };
    fetchPopular();
  }, []);

  return (
    <div className="top-container">
      <h3 className="popular-title">Popular Searches:</h3>

      <div className="popular-tags">
        {popular.map((item, index) => (
          <span
            key={index}
            className="tag-pill"
            onClick={() => onTermClick(item.term)}
          >
            {item.term}
          </span>
        ))}
      </div>
    </div>
  );
}
