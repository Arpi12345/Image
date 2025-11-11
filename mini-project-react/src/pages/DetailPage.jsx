import React from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function DetailPage({ user }) {
  const { state } = useLocation();
  const img = state?.img;

  if (!img) return <p>Image not found</p>;

  const handleSave = async () => {
    try {
      await axios.post("/api/save-images", { images: [img] }, { withCredentials: true });
      alert("Image saved!");
    } catch {
      alert("Error saving image.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <img src={img.urls.regular} alt={img.alt_description} style={{ maxWidth: "80%", borderRadius: "10px" }} />
      <h3>{img.alt_description}</h3>
      <p>By: {img.user.name}</p>
      <button onClick={handleSave}>Save Image</button>
    </div>
  );
}
