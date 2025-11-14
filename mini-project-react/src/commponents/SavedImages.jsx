// src/commponents/SavedImages.jsx
import React, { useEffect, useState } from "react";
import axios from "../api";

export default function SavedImages({ user }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) return;
    axios.get(`/api/save-images/${user._id}`)
      .then(res => setImages(res.data))
      .catch(err => console.error("Error fetching saved images:", err))
      .finally(()=>setLoading(false));
  }, [user]);

  if (!user) return <p>Please login</p>;
  if (loading) return <p>Loading...</p>;
  if (!images.length) return <p>No saved images yet.</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Your Saved Images</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
        {images.map(img => (
          <div key={img._id}><img src={img.imageUrl} alt={img.description} style={{ width: "100%", borderRadius: 8 }} /></div>
        ))}
      </div>
    </div>
  );
}
