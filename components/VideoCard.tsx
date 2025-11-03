"use client";

import { Play, Heart, Share2, Eye } from "lucide-react";
import { motion } from "framer-motion";

interface Video {
  thumbnail?: string;
  title?: string;
  description?: string;
  views?: number | string;
  duration?: string;
}

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  return (
    <motion.div
      className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border border-gray-800"
      whileHover={{ scale: 1.03 }}
    >
      {/* Thumbnail */}
      <div className="relative">
        <img
          src={video.thumbnail || "/default-thumb.jpg"}
          alt={video.title}
          className="w-full h-56 object-cover transition-all duration-300 group-hover:brightness-75"
        />

        {/* Overlay Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40">
          <div className="bg-white/20 backdrop-blur-lg p-4 rounded-full">
            <Play className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Top-right icons */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button className="p-2 bg-black/60 rounded-full hover:bg-black/80 transition">
            <Heart className="w-4 h-4 text-white" />
          </button>
          <button className="p-2 bg-black/60 rounded-full hover:bg-black/80 transition">
            <Share2 className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Video Info */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-white line-clamp-1">
          {video.title || "Untitled Video"}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-2">
          {video.description || "No description available."}
        </p>

        {/* Views and duration */}
        <div className="flex justify-between items-center mt-3 text-gray-400 text-sm">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" /> <span>{video.views || "0"} views</span>
          </div>
          <span className="bg-gray-800 px-3 py-1 rounded-full text-xs">
            {video.duration || "00:00"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoCard;
