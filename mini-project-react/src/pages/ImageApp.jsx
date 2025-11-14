// mini-project-react/src/pages/ImageApp.jsx
import React from "react";
import SavedImages from "../commponents/SavedImages";

export default function ImageApp({ user, onLogout }) {
  return (
    <div style={{ padding: 20 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Welcome, {user?.username || user?.email}</h2>
        <div>
          <button onClick={onLogout}>Logout</button>
        </div>
      </header>

      <main style={{ marginTop: 24 }}>
        {/* put your search and galleries here */}
        <SavedImages />
      </main>
    </div>
  );
}
