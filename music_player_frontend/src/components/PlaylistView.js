import React from "react";
import { useLibrary } from "../context/LibraryContext";
import { usePlayer } from "../context/PlayerContext";

// PUBLIC_INTERFACE
export default function PlaylistView() {
  /** View for a single selected playlist with play controls. */
  const {
    selectedPlaylistId,
    getPlaylist,
    playlistSongs,
    removeFromPlaylist,
    deletePlaylist,
    setActiveView,
  } = useLibrary();
  const { playTrack } = usePlayer();

  if (!selectedPlaylistId) {
    setActiveView("playlists");
    return null;
  }

  const playlist = getPlaylist(selectedPlaylistId);
  if (!playlist) {
    setActiveView("playlists");
    return null;
  }

  const onDelete = () => {
    // Confirm deletion
    // eslint-disable-next-line no-alert
    if (window.confirm(`Delete playlist "${playlist.name}"?`)) {
      deletePlaylist(playlist.id);
    }
  };

  const playAll = () => {
    if (playlistSongs.length > 0) {
      playTrack(playlistSongs[0], playlistSongs);
    }
  };

  return (
    <div className="list-wrap">
      <div className="list-head">
        <div className="left">
          <h2>{playlist.name}</h2>
          <span className="muted">{playlistSongs.length} tracks</span>
        </div>
        <div className="right">
          <button className="btn primary" onClick={playAll} disabled={playlistSongs.length === 0}>
            Play All
          </button>
          <button className="btn danger-outline" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>

      <ul className="song-list">
        {playlistSongs.map((song) => (
          <li className="song-row" key={song.id}>
            <button
              className="icon-btn play"
              aria-label={`Play ${song.title} by ${song.artist}`}
              onClick={() => playTrack(song, playlistSongs)}
              title="Play"
            >
              ▶
            </button>
            <div className="meta">
              <div className="title">{song.title}</div>
              <div className="sub">
                <span className="artist">{song.artist}</span> •{" "}
                <span className="album">{song.album}</span>
              </div>
            </div>
            <div className="grow" />
            <div className="actions">
              <button
                className="btn text danger"
                onClick={() => removeFromPlaylist(playlist.id, song.id)}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
        {playlistSongs.length === 0 && (
          <li className="empty-state">This playlist has no songs yet.</li>
        )}
      </ul>
    </div>
  );
}
