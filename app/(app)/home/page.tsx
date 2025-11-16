"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Download,
  CalendarDays,
  VideoIcon,
  FolderOpen,
  PlayCircle,
} from "lucide-react";
import { motion } from "framer-motion";

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

  // -----------------------------
  // 🔄 Loading State
  // -----------------------------
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-300 gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full"
        />
        <p className="text-lg opacity-70">Loading your videos...</p>
      </div>
    );

  // -----------------------------
  // ❌ Error State
  // -----------------------------
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-400 text-lg font-semibold">
        {error}
      </div>
    );

  return (
    <main className="container mx-auto px-6 py-12 min-h-screen">
      {/* 🔥 Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-5xl font-extrabold text-center mb-12 
        bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent 
        drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]"
      >
        Your Video Library
      </motion.h1>

      {/* 📁 Empty State */}
      {videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-400">
          <FolderOpen className="w-16 h-16 mb-4 text-blue-400 opacity-70" />
          <p className="text-lg">No videos uploaded yet.</p>
          <p className="text-sm opacity-60">Try uploading one!</p>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.08 },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {videos.map((video) => (
            <motion.div
              key={video.id}
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              onMouseEnter={() => setHoveredVideo(video.id)}
              onMouseLeave={() => setHoveredVideo(null)}
              className="rounded-2xl overflow-hidden border border-white/10 
              bg-white/5 backdrop-blur-xl shadow-lg 
              hover:shadow-blue-500/40 hover:border-blue-400/50 
              transition-all duration-300 cursor-pointer"
            >
              {/* 🎥 Video / Thumbnail */}
              <div className="relative w-full h-64 overflow-hidden group">
                {hoveredVideo === video.id ? (
                  <video
                    src={video.videoUrl}
                    autoPlay
                    muted
                    loop
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={`https://res.cloudinary.com/dlsei4qni/video/upload/${video.publicId}.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}

                {/* Top gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />

                {/* Play icon */}
                <PlayCircle className="absolute bottom-3 right-3 text-white/80 w-8 h-8 opacity-0 group-hover:opacity-100 transition duration-300" />
              </div>

              {/* 🧊 Bottom content */}
              <div className="p-4 bg-white/10 backdrop-blur-md border-t border-white/10">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
                  <VideoIcon size={18} className="text-blue-400" />
                  {video.title}
                </h2>

                <p className="text-sm text-gray-300 mt-1 line-clamp-2">
                  {video.description || "No description provided."}
                </p>

                {/* Footer Row */}
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => handleDownload(video.videoUrl, video.title)}
                    className="flex items-center gap-2 text-sm bg-blue-500/80 hover:bg-blue-600 
                    text-white px-3 py-1.5 rounded-md transition-all shadow-sm hover:shadow-blue-400/40"
                  >
                    <Download size={16} />
                    Download
                  </button>

                  <span className="flex items-center gap-1 text-gray-400 text-xs">
                    <CalendarDays size={14} />
                    {new Date(video.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </main>
  );
};

export default Home;
