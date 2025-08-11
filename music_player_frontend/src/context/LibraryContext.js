import React, { createContext, useContext, useMemo, useState } from "react";
import { sampleSongs } from "../data/library";

const LibraryContext = createContext(null);

// PUBLIC_INTERFACE
export function useLibrary() {
  /** Hook to access the LibraryContext safely. */
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used within LibraryProvider");
  return ctx;
}

// PUBLIC_INTERFACE
export function LibraryProvider({ children }) {
  /** Library provider that manages the music library, playlists, and search. */
  const [songs] = useState(sampleSongs);
  const [playlists, setPlaylists] = useState([
    { id: "pl-1", name: "Favorites", songIds: [sampleSongs[0]?.id, sampleSongs[1]?.id].filter(Boolean) },
  ]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [activeView, setActiveView] = useState("library"); // 'library' | 'playlists' | 'playlist'
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSongs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return songs;
    return songs.filter((s) => {
      return (
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q) ||
        s.album.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, songs]);

  // PUBLIC_INTERFACE
  const createPlaylist = (name) => {
    /** Create a new playlist with the given name. */
    const trimmed = (name || "").trim();
    if (!trimmed) return null;
    const id = `pl-${Date.now()}`;
    const pl = { id, name: trimmed, songIds: [] };
    setPlaylists((prev) => [pl, ...prev]);
    return pl;
  };

  // PUBLIC_INTERFACE
  const addToPlaylist = (playlistId, songId) => {
    /** Add songId to the specified playlist if not already present. */
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id !== playlistId) return pl;
        if (pl.songIds.includes(songId)) return pl;
        return { ...pl, songIds: [...pl.songIds, songId] };
      })
    );
  };

  // PUBLIC_INTERFACE
  const removeFromPlaylist = (playlistId, songId) => {
    /** Remove a song from the specified playlist. */
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id !== playlistId) return pl;
        return { ...pl, songIds: pl.songIds.filter((id) => id !== songId) };
      })
    );
  };

  // PUBLIC_INTERFACE
  const deletePlaylist = (playlistId) => {
    /** Delete a playlist by id. */
    setPlaylists((prev) => prev.filter((pl) => pl.id !== playlistId));
    if (selectedPlaylistId === playlistId) {
      setSelectedPlaylistId(null);
      setActiveView("playlists");
    }
  };

  // PUBLIC_INTERFACE
  const selectPlaylist = (playlistId) => {
    /** Select a playlist and activate the playlist view. */
    setSelectedPlaylistId(playlistId);
    setActiveView("playlist");
  };

  const getPlaylist = (playlistId) => playlists.find((pl) => pl.id === playlistId) || null;

  const playlistSongs = useMemo(() => {
    if (!selectedPlaylistId) return [];
    const pl = getPlaylist(selectedPlaylistId);
    if (!pl) return [];
    return pl.songIds.map((sid) => songs.find((s) => s.id === sid)).filter(Boolean);
  }, [selectedPlaylistId, playlists, songs]);

  const value = {
    songs,
    playlists,
    selectedPlaylistId,
    activeView,
    searchQuery,
    setSearchQuery,
    setActiveView,
    createPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    deletePlaylist,
    selectPlaylist,
    filteredSongs,
    getPlaylist,
    playlistSongs,
  };

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}
