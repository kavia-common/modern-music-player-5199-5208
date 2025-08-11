import React from "react";
import { useLibrary } from "../context/LibraryContext";

// PUBLIC_INTERFACE
export default function Header() {
  /** App header with title and global search input. */
  const { searchQuery, setSearchQuery } = useLibrary();

  return (
    <header className="app-header" role="banner">
      <div className="brand">
        <div className="logo-dot" aria-hidden />
        <h1 className="app-title">Music Player</h1>
      </div>
      <div className="search">
        <input
          aria-label="Search songs, artists, albums"
          type="search"
          placeholder="Search songs, artists, albums"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </header>
  );
}
