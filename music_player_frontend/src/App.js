import React from "react";
import "./App.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import SongList from "./components/SongList";
import PlaylistView from "./components/PlaylistView";
import NowPlayingBar from "./components/NowPlayingBar";
import { PlayerProvider } from "./context/PlayerContext";
import { LibraryProvider, useLibrary } from "./context/LibraryContext";

function MainArea() {
  const { activeView } = useLibrary();
  return (
    <main className="main-area">
      {activeView === "library" && <SongList />}
      {activeView === "playlists" && (
        <div className="placeholder">
          <h2>Your Playlists</h2>
          <p className="muted">Select a playlist from the sidebar or create a new one.</p>
        </div>
      )}
      {activeView === "playlist" && <PlaylistView />}
    </main>
  );
}

// PUBLIC_INTERFACE
export default function App() {
  /** Root application component setting up contexts and the UI layout. */
  return (
    <LibraryProvider>
      <PlayerProvider>
        <div className="app-shell" data-theme="light">
          <Header />
          <div className="content">
            <Sidebar />
            <MainArea />
          </div>
          <NowPlayingBar />
        </div>
      </PlayerProvider>
    </LibraryProvider>
  );
}
