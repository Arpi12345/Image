import React, { useState } from "react";
import api from "../api";   // using your api.js

export default function SearchBox({ setImages, user }) {
  const [term, setTerm] = useState("");

 const handleSearch = async (e) => {
  e.preventDefault();

  if (!term.trim()) return;

  try {
    const res = await api.post("/api/search", { term });

    if (res.data?.results) {
      setImages(res.data.results);
      setTerm(""); // 🔹 clear the input after search
    }
  } catch (err) {
    console.error("Search error:", err);
    alert("Error fetching search results");
  }
};


  return (
    <form onSubmit={handleSearch} className="search-form">
      <input
        type="text"
        placeholder="Search images..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}
