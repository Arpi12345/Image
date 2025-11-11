import React, { useState } from "react";

export default function Header({ user, onLogout }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div style={styles.header}>
      <h2>ImageFinder</h2>
      {user && (
        <div style={styles.profile}>
          <div
            onClick={() => setShowMenu(!showMenu)}
            style={styles.avatarContainer}
          >
            <img
              src={user.photo || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
              alt="profile"
              style={styles.avatar}
            />
            <span style={{ marginLeft: "8px" }}>{user.username || user.email}</span>
          </div>

          {showMenu && (
            <div style={styles.dropdown}>
              <button onClick={onLogout}>Logout</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 20px",
    background: "#f4f4f4",
    alignItems: "center",
  },
  profile: { position: "relative" },
  avatarContainer: { display: "flex", alignItems: "center", cursor: "pointer" },
  avatar: { width: "35px", height: "35px", borderRadius: "50%" },
  dropdown: {
    position: "absolute",
    top: "40px",
    right: 0,
    background: "white",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "10px",
    zIndex: 10,
  },
};
