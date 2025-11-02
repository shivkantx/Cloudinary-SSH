"use client";
import React, { useState, useEffect, useCallback } from "react";
import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary";
import { Download, Clock, FileDown, FileUp } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { filesize } from "filesize";
import { Video } from "@/app/generated/prisma/wasm";

dayjs.extend(relativeTime);

interface VideoCardProps {
  video: Video;
  onDownload: (url: string, title: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onDownload }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const getThumbnailUrl = useCallback((publicId: string) => {
    return getCldImageUrl({
      src: publicId,
      width: 400,
      height: 225,
      crop: "fill",
      gravity: "auto",
      format: "jpg",
      quality: "auto",
      assetType: "video",
    });
  }, []);

  const getFullVideoUrl = useCallback((publicId: string) => {
    return getCldVideoUrl({
      src: publicId,
      width: 1920,
      height: 1080,
    });
  }, []);

  const getPreviewUrl = useCallback((publicId: string) => {
    return getCldVideoUrl({
      src: publicId,
      width: 400,
      height: 225,
      rawTransformations: [
        "e_preview:duration_15:max_segments_9:min_segment_duration_1",
      ],
    });
  }, []);

  const formatSize = useCallback((size: number) => filesize(size), []);
  const formatDuration = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, []);

  const compressionPercentage = Math.round(
    (1 - Number(video.compressedSize) / Number(video.originalSize)) * 100
  );

  useEffect(() => {
    setPreviewError(false);
  }, [isHovered]);

  const handlePreviewError = () => {
    setPreviewError(true);
  };

  return (
    <div
      className="card bg-base-100/10 backdrop-blur-lg border border-primary/30 shadow-lg hover:shadow-primary/40 transition-all duration-300 rounded-2xl overflow-hidden hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 🎥 Video Preview / Thumbnail */}
      <figure className="aspect-video relative overflow-hidden">
        {isHovered ? (
          previewError ? (
            <div className="w-full h-full flex items-center justify-center bg-base-200 text-error">
              Preview not available
            </div>
          ) : (
            <video
              src={getPreviewUrl(video.publicId)}
              autoPlay
              muted
              loop
              className="w-full h-full object-cover"
              onError={handlePreviewError}
            />
          )
        ) : (
          <img
            src={getThumbnailUrl(video.publicId)}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded-md flex items-center gap-1 text-xs">
          <Clock size={14} />{" "}
          {formatDuration(video.duration as unknown as number)}
        </div>
      </figure>

      {/* 🧾 Card Content */}
      <div className="card-body p-4 space-y-3">
        <h2 className="card-title text-lg font-bold text-white/90">
          {video.title}
        </h2>
        <p className="text-sm text-gray-400 line-clamp-2">
          {video.description || "No description available."}
        </p>
        <p className="text-xs text-gray-500">
          Uploaded {dayjs(video.createdAt).fromNow()}
        </p>

        {/* 📊 File Info */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <FileUp size={18} className="text-primary" />
            <div>
              <div className="font-semibold text-white/80">Original</div>
              <div className="text-gray-400">
                {formatSize(Number(video.originalSize))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FileDown size={18} className="text-secondary" />
            <div>
              <div className="font-semibold text-white/80">Compressed</div>
              <div className="text-gray-400">
                {formatSize(Number(video.compressedSize))}
              </div>
            </div>
          </div>
        </div>

        {/* 📦 Compression Info + Download */}
        <div className="flex justify-between items-center pt-3 border-t border-white/10">
          <div className="text-sm font-medium text-white/80">
            Compression:{" "}
            <span className="text-accent">{compressionPercentage}%</span>
          </div>
          <button
            onClick={() =>
              onDownload(getFullVideoUrl(video.publicId), video.title)
            }
            className="btn btn-primary btn-sm btn-glass hover:scale-105 transition-transform"
          >
            <Download size={16} />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
