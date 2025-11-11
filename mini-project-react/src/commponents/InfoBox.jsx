import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/InfoBox.css";

export default function InfoBox({ images, user }) {
  const navigate = useNavigate();
  const [savedIds, setSavedIds] = useState([]);

  //  Single, clean save handler
  const handleSave = async (img) => {
  if (!user?._id) {
    alert("Please log in first!");
    return;
  }

  try {
    const title =
      img.alt_description ||
      img.description ||
      img.user?.name ||
      "Beautiful image";

    const res = await axios.post("/api/save-images", {
      imageUrl: img.urls.small,
      description: title,
      userId: user._id,
    });

    setSavedIds((prev) => [...prev, img.id]);
    console.log(" Image saved:", res.data);
    alert(" Image saved successfully!");
  } catch (error) {
    console.error(" Error saving image:", error);
    alert("Error saving image!");
  }
};


  if (!images?.length)
    return (
      <p style={{ textAlign: "center", marginTop: "2rem" }}>No images yet!</p>
    );

  return (
    <div className="card-grid">
      {images.map((img) => (
        <div
          key={img.id}
          className="listing-card"
          onClick={() => navigate(`/show/${img.id}`, { state: { img } })}
        >
          <div className="image-wrapper">
            <img
              src={img.urls ? img.urls.small : img.imageUrl}
              alt={img.alt_description || img.description || "saved image"}
              className="listing-img"
            />

            {/*  Save Button Overlay */}
            <button
              className={`save-icon ${
                savedIds.includes(img.id) ? "saved" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleSave(img);
              }}
            >
              {savedIds.includes(img.id) ? "💖" : "🤍"}
            </button>
          </div>

          <div className="listing-body">
            <p className="listing-text">
              <b>{img.alt_description || img.description || "Beautiful Image"}</b>

              {img.user?.name && <span>By {img.user.name}</span>}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
