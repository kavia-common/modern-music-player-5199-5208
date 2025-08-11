import React, { useState } from "react";
import { useLibrary } from "../context/LibraryContext";

// PUBLIC_INTERFACE
export default function Sidebar() {
  /** Sidebar navigation with quick actions and playlist list. */
  const {
    playlists,
    setActiveView,
    createPlaylist,
    selectPlaylist,
    activeView,
  } = useLibrary();

  const [newPlName, setNewPlName] = useState("");

  const onCreate = () => {
    const created = createPlaylist(newPlName);
    setNewPlName("");
    if (created) {
      selectPlaylist(created.id);
    }
  };

  return (
    <aside className="sidebar" aria-label="Sidebar navigation">
      <nav className="nav">
        <button
          className={`nav-item ${activeView === "library" ? "active" : ""}`}
          onClick={() => setActiveView("library")}
        >
          Browse
        </button>
        <button
          className={`nav-item ${activeView === "playlists" ? "active" : ""}`}
          onClick={() => setActiveView("playlists")}
        >
          Playlists
        </button>
      </nav>

      <div className="sidebar-section">
        <h3 className="section-title">New Playlist</h3>
        <div className="playlist-create">
          <input
            type="text"
            placeholder="Playlist name"
            value={newPlName}
            onChange={(e) => setNewPlName(e.target.value)}
          />
          <button className="btn primary" onClick={onCreate} disabled={!newPlName.trim()}>
            Create
          </button>
        </div>
      </div>

      <div className="sidebar-section grow">
        <h3 className="section-title">Your Playlists</h3>
        <ul className="playlist-list">
          {playlists.length === 0 && <li className="muted">No playlists yet</li>}
          {playlists.map((pl) => (
            <li key={pl.id}>
              <button
                className="playlist-link"
                onClick={() => selectPlaylist(pl.id)}
                title={`${pl.name}`}
              >
                <span className="pl-icon" aria-hidden>♪</span>
                <span className="pl-name">{pl.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
