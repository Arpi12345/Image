import React, { useState } from "react";
import axios from "axios";
import TopBanner from "../commponents/TopBanner";
import SearchBox from "../commponents/SearchBox";
import InfoBox from "../commponents/InfoBox";
import "../styles/SearchBox.css";

export default function ImageApp({ user, onLogout }) {
  const [images, setImages] = useState([]);
  const [showSaved, setShowSaved] = useState(false);

  //  Fetch Unsplash search results
  const fetchImages = async (term) => {
    try {
      const res = await axios.post("/api/search", { term });
      setImages(res.data.results || []);
      setShowSaved(false);
    } catch (err) {
      console.error(" Error fetching images:", err);
    }
  };

  //  Fetch saved images for logged-in user
  const fetchSavedImages = async () => {
    try {
      const res = await axios.get(`/api/save-images/${user._id}`);
      setImages(res.data);
      setShowSaved(true);
      console.log(" Loaded saved images:", res.data.length);
    } catch (err) {
      console.error(" Error fetching saved images:", err);
      alert("Error loading saved photos!");
    }
  };

  // Back to Search button handler
  const backToSearch = () => {
    setImages([]);
    setShowSaved(false);
  };

  return (
    <div>
      {/*  Header Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 30px",
          background: "#f7f7f7",
        }}
      >
        <h2 style={{ color: "#111" }}>ImageFinder</h2>
        <div>
          <span style={{ marginRight: "15px", fontWeight: "500" }}>
            {user?.name || user?.username}
          </span>

          {!showSaved ? (
            <button
              onClick={fetchSavedImages}
              style={{
                backgroundColor: "#ff6f91",
                border: "none",
                color: "white",
                padding: "8px 14px",
                borderRadius: "8px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              Saved Photos
            </button>
          ) : (
            <button
              onClick={backToSearch}
              style={{
                backgroundColor: "#f48fb1",
                border: "none",
                color: "white",
                padding: "8px 14px",
                borderRadius: "8px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              🔙 Back to Search
            </button>
          )}

          <button
            onClick={onLogout}
            style={{
              backgroundColor: "#ff5252",
              border: "none",
              color: "white",
              padding: "8px 14px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/*  Top Banner + Search Box */}
      <TopBanner onTermClick={fetchImages} />
      <SearchBox setImages={setImages} />

      {/*  Title changes dynamically */}
      <h3 style={{ textAlign: "center", marginTop: "1rem", color: "#e91e63" }}>
        {showSaved ? "💖 Your Saved Photos" : ""}
      </h3>

      {/* Display images (search results or saved ones) */}
      <InfoBox images={images} user={user} />
    </div>
  );
}
