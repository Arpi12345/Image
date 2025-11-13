import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/InfoBox.css";

export default function InfoBox({ images, user }) {
  const navigate = useNavigate();
  const [savedIds, setSavedIds] = useState([]);

  const handleSave = async (img) => {
    if (!user?._id) {
      alert("Please log in first!");
      return;
    }

    try {
      const title = img.alt_description || img.description || img.user?.name || "Beautiful image";

      const payload = {
        imageUrl: img.urls?.small || img.imageUrl,
        description: title,
        userId: user._id,
        unsplashId: img.id || img.unsplashId || null,
      };

      const res = await axios.post("/api/save-images/", payload, { withCredentials: true });
      const cardId = img.id || img._id || res.data._id || payload.unsplashId;
      setSavedIds((prev) => [...new Set([...prev, cardId])]);
      alert("Image saved successfully!");
    } catch (error) {
      console.error("Error saving image:", error);
      alert("Error saving image!");
    }
  };

  if (!images?.length)
    return (
      <p style={{ textAlign: "center", marginTop: "2rem" }}>No images yet!</p>
    );

  return (
    <div className="card-grid">
      {images.map((img) => {
        const cardId = img.id || img._id;
        return (
          <div
            key={cardId}
            className="listing-card"
            onClick={() => navigate(`/show/${img.id || img._id}`, { state: { img } })}
          >
            <div className="image-wrapper">
              <img
                src={img.urls ? img.urls.small : img.imageUrl}
                alt={img.alt_description || img.description || "saved image"}
                className="listing-img"
              />

              <button
                className={`save-icon ${savedIds.includes(cardId) ? "saved" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave(img);
                }}
              >
                {savedIds.includes(cardId) ? "💖" : "🤍"}
              </button>
            </div>

            <div className="listing-body">
              <p className="listing-text">
                <b>{img.alt_description || img.description || "Beautiful Image"}</b>
                {img.user?.name && <span>By {img.user.name}</span>}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
