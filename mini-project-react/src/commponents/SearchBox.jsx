import React, { useState } from "react";
import axios from "axios";
import "../styles/SearchBox.css";

export default function SearchBox({ setImages }) {
  const [term, setTerm] = useState("");

  //  Handle Search
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!term.trim()) {
      alert("Please enter a search term!");
      return;
    }

    try {
      const res = await axios.post("/api/search", { term });
      setImages(res.data.results || []);
      console.log(" Images fetched:", res.data.results?.length);
    } catch (err) {
      console.error(" Error fetching images:", err);
      alert("Error fetching images. Please try again!");
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search beautiful images..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </div>
  );
}
