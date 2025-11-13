import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SavedImages({ user }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?._id) {
      setLoading(false);
      return;
    }

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    setLoading(true);
    axios
      .get(`${API_URL}/api/save-images/${user._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setImages(res.data || []);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching saved images:", err);
        setError("Failed to load saved images. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (!user?._id) {
    return <p style={{ textAlign: "center" }}>Please log in to view saved images.</p>;
  }

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading your saved images...</p>;
  }

  if (error) {
    return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Your Saved Images</h2>
      {images.length === 0 ? (
        <p>No saved images yet.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 12,
          }}
        >
          {images.map((img) => (
            <div key={img._id}>
              <img
                src={img.imageUrl}
                alt={img.description || "Saved image"}
                style={{
                  width: "100%",
                  borderRadius: 8,
                  objectFit: "cover",
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
