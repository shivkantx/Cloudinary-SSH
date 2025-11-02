"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();
  const MAX_FILE_SIZE = 70 * 1024 * 1024; // 70MB

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please select a video file.");
    if (file.size > MAX_FILE_SIZE) return alert("File size too large.");

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("originalSize", file.size.toString());

    try {
      const response = await axios.post("/api/video-upload", formData);
      if (response.status === 200) {
        console.log("✅ Video uploaded successfully!");
        toast.success("✅ Video uploaded successfully!");
        router.push("/");
      }
    } catch (error) {
      console.error("❌ Upload failed:", error);
      toast.error("❌ Upload failed!");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-300 via-base-200 to-base-100 p-6">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="card w-full max-w-3xl bg-base-100/70 backdrop-blur-lg border border-primary/20 shadow-2xl rounded-3xl transition-all hover:shadow-primary/30">
        <div className="card-body space-y-6">
          {/* 🏷️ Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Upload Your Video
            </h1>
            <p className="text-base-content/70">
              Upload and share your videos seamlessly with Cloudinary.
            </p>
          </div>

          {/* 📄 Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="label">
                <span className="label-text text-base-content/80">Title</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input input-bordered input-primary w-full"
                placeholder="Enter video title"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="label">
                <span className="label-text text-base-content/80">
                  Description
                </span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="textarea textarea-bordered textarea-primary w-full"
                placeholder="Write something about this video..."
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="label">
                <span className="label-text text-base-content/80">
                  Video File
                </span>
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="file-input file-input-bordered file-input-primary w-full"
                required
              />
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <progress className="progress progress-primary w-full mt-3"></progress>
            )}

            {/* ✅ Centered Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                className="btn btn-primary btn-wide text-lg shadow-md hover:shadow-lg hover:scale-[1.05] transition-all"
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Upload Video"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
