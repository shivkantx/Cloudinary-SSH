"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Video } from "@/app/generated/prisma"; // adjust path if needed
import VideoCard from "@/components/VideoCard";

export default function HomePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await axios.get("/api/videos");
        setVideos(response.data);
      } catch (error) {
        console.error("❌ Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-base-300 via-base-200 to-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 via-base-200 to-base-100 p-8">
      <h1 className="text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        All Uploaded Videos
      </h1>

      {videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-center space-y-4">
          <p className="text-xl font-medium text-base-content/70">
            No videos uploaded yet.
          </p>
          <p className="text-base-content/50">
            Upload a video and it’ll show up here!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onDownload={(url, title) => {
                // you might handle download logic here
                window.open(url, "_blank");
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
