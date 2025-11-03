"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Download, CalendarDays, VideoIcon } from "lucide-react";

interface Video {
  id: string;
  title: string;
  description?: string;
  publicId: string;
  videoUrl: string;
  createdAt: string;
  updatedAt: string;
}

const Home = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    try {
      const response = await axios.get("/api/videos");
      if (Array.isArray(response.data)) setVideos(response.data);
      else throw new Error("Unexpected response format");
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

  const handleDownload = (url: string, title: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title}.mp4`);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500 text-lg animate-pulse">
        Loading videos...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );

  return (
    <main className="container mx-auto px-6 py-10 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-10 text-blue-400 drop-shadow-lg">
        📹 Uploaded Videos
      </h1>

      {videos.length === 0 ? (
        <p className="text-center text-gray-400">
          No videos found. Try uploading one!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <div
              key={video.id}
              onMouseEnter={() => setHoveredVideo(video.id)}
              onMouseLeave={() => setHoveredVideo(null)}
              className="rounded-2xl overflow-hidden shadow-lg border border-white/10 hover:border-blue-500/60 transition-all duration-300 hover:shadow-blue-500/30 bg-white/5 backdrop-blur-xl"
            >
              <div className="relative w-full h-64 overflow-hidden">
                {hoveredVideo === video.id ? (
                  <video
                    src={video.videoUrl}
                    autoPlay
                    muted
                    loop
                    className="w-full h-full object-cover transition-opacity duration-500"
                  />
                ) : (
                  <img
                    src={`https://res.cloudinary.com/dlsei4qni/video/upload/${video.publicId}.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover transition-opacity duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* 🧊 Glassmorphic Content */}
              <div className="p-4 bg-white/10 backdrop-blur-md border-t border-white/10">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <VideoIcon size={18} className="text-blue-400" />
                  {video.title}
                </h2>
                <p className="text-sm text-gray-300 mt-2 line-clamp-2">
                  {video.description || "No description provided."}
                </p>

                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => handleDownload(video.videoUrl, video.title)}
                    className="flex items-center gap-2 text-sm bg-blue-500/80 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md transition-all shadow-sm hover:shadow-blue-400/40"
                  >
                    <Download size={16} />
                    Download
                  </button>
                  <span className="flex items-center gap-1 text-gray-400 text-xs">
                    <CalendarDays size={14} />
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
