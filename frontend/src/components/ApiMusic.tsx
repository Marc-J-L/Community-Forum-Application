import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { getAccessToken } from "./../api/apis/spotifyService.api";

interface PlaylistData {
  id: string;
  name: string;
  description: string;
  tracks: {
    items: Array<{
      track: {
        id: string;
        name: string;
        artists: Array<{ name: string }>;
      };
    }>;
  };
}

export function PlaylistComponent() {
  const [playlistData, setPlaylistData] = useState<PlaylistData | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // get token
    const fetchToken = async () => {
      try {
        const accessToken = await getAccessToken();
        setToken(accessToken); // set token
      } catch (error) {
        console.error("Error fetching access token:", error);
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    const cachedPlaylist = localStorage.getItem("playlistData");

    if (cachedPlaylist) {
      setPlaylistData(JSON.parse(cachedPlaylist));
    } else if (token) {
      fetchWithRetry(
        "https://api.spotify.com/v1/playlists/6NIrf8ILqP2hLpgiOC6VzA",
        token
      )
        .then((data) => {
          setPlaylistData(data);
          localStorage.setItem("playlistData", JSON.stringify(data));
        })
        .catch((error) => {
          console.error("Error fetching playlist data:", error);
        });
    }
  }, [token]);

  return (
    <Box sx={{ p: 1 }}>
      {playlistData ? (
        <iframe
          title="Spotify Embed: Recommendation Playlist"
          src={`https://open.spotify.com/embed/playlist/6NIrf8ILqP2hLpgiOC6VzA?utm_source=generator&theme=0`}
          width="100%"
          height="100%"
          style={{ minHeight: "360px", border: "none" }}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      ) : (
        <p>loading...</p>
      )}
    </Box>
  );
}

async function fetchWithRetry(url: string, token: string, retries: number = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
    }
  }
}
