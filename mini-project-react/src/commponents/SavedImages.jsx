import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SavedImages({ user }) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (!user?._id) return;
    axios.get(`http://localhost:5000/api/save-images/${user._id}`, { withCredentials: true })
      .then(res => setImages(res.data))
      .catch(err => console.error("Error fetching saved images:", err));
  }, [user]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Your saved images</h2>
      {images.length === 0 ? <p>No saved images yet</p> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
          {images.map(img => <img key={img._id} src={img.imageUrl} alt={img.description} style={{ width: "100%", borderRadius: 8 }} />)}
        </div>
      )}
    </div>
  );
}
