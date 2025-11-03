"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

interface Video {
  id: string;
  title: string;
  description?: string;
  publicId: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

const Home = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🧠 Fetch videos from API
  const fetchVideos = useCallback(async () => {
    try {
      const response = await axios.get("/api/videos");
      if (Array.isArray(response.data)) {
        setVideos(response.data);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error: any) {
      console.error("❌ Error fetching videos:", error);
      setError("Failed to fetch videos. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // 📥 Download handler
  const handleDownload = (url: string, title: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title}.mp4`);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg animate-pulse">Loading videos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        📺 Uploaded Videos
      </h1>

      {videos.length === 0 ? (
        <div className="text-center text-gray-500">
          No videos found. Try uploading one!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-200"
            >
              <video
                src={video.url}
                controls
                className="w-full h-56 object-cover"
              ></video>
              <div className="p-4">
                <h2 className="text-xl font-semibold truncate">
                  {video.title}
                </h2>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                  {video.description || "No description provided."}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => handleDownload(video.url, video.title)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-all"
                  >
                    Download
                  </button>
                  <span className="text-gray-400 text-xs">
                    {new Date(video.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Home;
