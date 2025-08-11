import React from "react";
import { usePlayer } from "../context/PlayerContext";

// PUBLIC_INTERFACE
export default function NowPlayingBar() {
  /** Footer now playing bar with transport controls, progress, and volume. */
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    next,
    prev,
    currentTime,
    duration,
    seekTo,
    volume,
    setPlayerVolume,
    formatTime,
  } = usePlayer();

  const onSeek = (e) => {
    const val = Number(e.target.value);
    seekTo(val);
  };

  const onVolume = (e) => {
    const v = Number(e.target.value);
    setPlayerVolume(v);
  };

  return (
    <footer className="player-bar" role="contentinfo" aria-label="Now playing bar">
      <div className="track-info">
        <div className="cover" aria-hidden>
          <div className="disc" />
        </div>
        <div className="titles">
          <div className="t-primary">{currentTrack ? currentTrack.title : "Nothing playing"}</div>
          <div className="t-secondary">
            {currentTrack ? `${currentTrack.artist} • ${currentTrack.album}` : "Select a track to start listening"}
          </div>
        </div>
      </div>
      <div className="controls">
        <button className="icon-btn" onClick={prev} aria-label="Previous">⏮</button>
        <button className="icon-btn primary" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? "⏸" : "▶"}
        </button>
        <button className="icon-btn" onClick={next} aria-label="Next">⏭</button>
      </div>
      <div className="timeline">
        <span className="time">{formatTime(currentTime)}</span>
        <input
          className="seek"
          type="range"
          min={0}
          max={duration || 0}
          step={1}
          value={Math.min(currentTime, duration || 0)}
          onChange={onSeek}
          disabled={!duration}
        />
        <span className="time">{formatTime(duration)}</span>
      </div>
      <div className="volume">
        <span aria-hidden>🔊</span>
        <input
          className="vol"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={onVolume}
        />
      </div>
    </footer>
  );
}
