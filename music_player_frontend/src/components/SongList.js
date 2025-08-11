import React from "react";
import { useLibrary } from "../context/LibraryContext";
import { usePlayer } from "../context/PlayerContext";

// PUBLIC_INTERFACE
export default function SongList() {
  /** Main library song list with search filtering and quick actions. */
  const { filteredSongs, playlists, addToPlaylist } = useLibrary();
  const { playTrack } = usePlayer();

  return (
    <div className="list-wrap">
      <div className="list-head">
        <h2>Songs</h2>
        <span className="muted">{filteredSongs.length} tracks</span>
      </div>
      <ul className="song-list">
        {filteredSongs.map((song, idx) => (
          <li className="song-row" key={song.id}>
            <button
              className="icon-btn play"
              aria-label={`Play ${song.title} by ${song.artist}`}
              onClick={() => playTrack(song, filteredSongs)}
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
              <select
                aria-label={`Add ${song.title} to playlist`}
                defaultValue=""
                onChange={(e) => {
                  const plId = e.target.value;
                  if (plId) addToPlaylist(plId, song.id);
                  e.target.value = "";
                }}
              >
                <option value="" disabled>
                  Add to playlist
                </option>
                {playlists.map((pl) => (
                  <option key={pl.id} value={pl.id}>
                    {pl.name}
                  </option>
                ))}
              </select>
              <span className="duration">{formatDuration(song.duration)}</span>
            </div>
          </li>
        ))}
        {filteredSongs.length === 0 && (
          <li className="empty-state">No songs match your search.</li>
        )}
      </ul>
    </div>
  );
}

function formatDuration(secs) {
  if (!secs) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
