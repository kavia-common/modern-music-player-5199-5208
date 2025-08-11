import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

/**
 * PlayerContext provides a single audio element and exposes playback controls and state.
 * It is responsible for play/pause, next/prev track, seeking, and volume management.
 */
const PlayerContext = createContext(null);

/**
 * Format seconds to mm:ss
 * @param {number} secs
 * @returns {string}
 */
function formatTime(secs) {
  if (!secs || Number.isNaN(secs)) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// PUBLIC_INTERFACE
export function usePlayer() {
  /** Hook to access the PlayerContext safely. */
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}

// PUBLIC_INTERFACE
export function PlayerProvider({ children }) {
  /** Context provider that owns the audio element and playback state. */
  const audioRef = useRef(new Audio());
  const [queue, setQueue] = useState([]); // [{id, title, url, ...}]
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  const currentTrack = queue[currentIndex] || null;

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
    const onLoaded = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      next();
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const _loadAndPlay = async () => {
    const audio = audioRef.current;
    if (!currentTrack) return;
    if (audio.src !== currentTrack.url) {
      audio.src = currentTrack.url;
    }
    try {
      await audio.play();
      setIsPlaying(true);
    } catch (e) {
      // Autoplay might be blocked; keep state consistent
      setIsPlaying(false);
      // eslint-disable-next-line no-console
      console.warn("Play attempt was prevented by the browser:", e?.message || e);
    }
  };

  // PUBLIC_INTERFACE
  const playTrack = async (track, queueList = null) => {
    /** Play a specific track, optionally updating the queue used for next/prev. */
    if (queueList && Array.isArray(queueList)) {
      setQueue(queueList);
      const i = queueList.findIndex((t) => t.id === track.id);
      setCurrentIndex(i >= 0 ? i : 0);
      // Wait for state to update
      setTimeout(_loadAndPlay, 0);
    } else {
      // Use existing queue
      const i = queue.findIndex((t) => t.id === track.id);
      if (i >= 0) {
        setCurrentIndex(i);
        setTimeout(_loadAndPlay, 0);
      } else {
        // If not in queue, append and play
        const nextQueue = [...queue, track];
        setQueue(nextQueue);
        setCurrentIndex(nextQueue.length - 1);
        setTimeout(_loadAndPlay, 0);
      }
    }
  };

  // PUBLIC_INTERFACE
  const play = async () => {
    /** Resume playback. */
    if (!currentTrack) return;
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (e) {
      setIsPlaying(false);
    }
  };

  // PUBLIC_INTERFACE
  const pause = () => {
    /** Pause playback. */
    audioRef.current.pause();
    setIsPlaying(false);
  };

  // PUBLIC_INTERFACE
  const togglePlay = () => {
    /** Toggle between play and pause states. */
    if (!currentTrack) return;
    if (isPlaying) pause();
    else play();
  };

  // PUBLIC_INTERFACE
  const next = () => {
    /** Go to the next track in the queue. */
    if (queue.length === 0) return;
    const nextIndex = currentIndex + 1;
    if (nextIndex < queue.length) {
      setCurrentIndex(nextIndex);
      setTimeout(_loadAndPlay, 0);
    } else {
      // End of queue
      setIsPlaying(false);
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // PUBLIC_INTERFACE
  const prev = () => {
    /** Go to the previous track in the queue or restart current if elapsed > 3s. */
    if (queue.length === 0) return;
    if (currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setCurrentIndex(prevIndex);
      setTimeout(_loadAndPlay, 0);
    } else {
      // Start of queue: restart
      audioRef.current.currentTime = 0;
    }
  };

  // PUBLIC_INTERFACE
  const seekTo = (time) => {
    /** Seek to a specific time in seconds. */
    const audio = audioRef.current;
    const target = Math.min(Math.max(time, 0), duration || 0);
    audio.currentTime = target;
    setCurrentTime(target);
  };

  // PUBLIC_INTERFACE
  const setPlayerVolume = (v) => {
    /** Set player volume from 0 to 1. */
    const clamped = Math.min(Math.max(v, 0), 1);
    setVolume(clamped);
  };

  const value = useMemo(
    () => ({
      audioRef,
      queue,
      currentIndex,
      currentTrack,
      isPlaying,
      currentTime,
      duration,
      volume,
      // controls
      playTrack,
      play,
      pause,
      togglePlay,
      next,
      prev,
      seekTo,
      setPlayerVolume,
      formatTime,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [queue, currentIndex, currentTrack, isPlaying, currentTime, duration, volume]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}
