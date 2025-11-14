// mini-project-react/src/commponents/SavedImages.jsx
import React, { useEffect, useState } from "react";
import axios from "../api";

export default function SavedImages() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    try {
      const res = await axios.get("/api/save-images");
      setList(res.data.list || []);
    } catch (err) {
      console.error("Load saved error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  if (loading) return <p>Loading saved images...</p>;
  if (!list.length) return <p>No saved images yet.</p>;

  return (
    <div>
      <h3>Saved Images</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, 200px)", gap: 12 }}>
        {list.map((s) => (
          <div key={s._id} style={{ border: "1px solid #ddd", padding: 8 }}>
            <img src={s.url} alt={s.title || "saved"} style={{ width: "100%", height: 120, objectFit: "cover" }} />
            <p style={{ margin: "8px 0 0", fontSize: 14 }}>{s.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
