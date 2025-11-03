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
    if (!file) return toast.error("Please select a video file.");
    if (file.size > MAX_FILE_SIZE) return toast.error("File size too large.");

    setIsUploading(true);
    try {
      // STEP 1️⃣ — Upload to Cloudinary
      const cloudinaryData = new FormData();
      cloudinaryData.append("file", file);
      cloudinaryData.append("upload_preset", "ml_default"); // create one in Cloudinary if needed
      cloudinaryData.append("resource_type", "video");

      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
        {
          method: "POST",
          body: cloudinaryData,
        }
      );

      const uploaded = await cloudinaryResponse.json();

      if (!uploaded.public_id) throw new Error("Cloudinary upload failed");

      // STEP 2️⃣ — Save metadata to DB (Prisma API)
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("publicId", uploaded.public_id);
      formData.append("originalSize", file.size.toString());
      formData.append("compressedSize", file.size.toString()); // same for now
      formData.append("duration", uploaded.duration?.toString() || "0");

      const response = await axios.post("/api/video-upload", formData);

      if (response.status === 200) {
        toast.success("✅ Video uploaded successfully!");
        router.push("/home");
      } else {
        throw new Error("Server responded with error");
      }
    } catch (error: any) {
      console.error("❌ Upload failed:", error);
      toast.error(`Upload failed: ${error.message || "Unknown error"}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-300 via-base-200 to-base-100 p-6">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="card w-full max-w-3xl bg-base-100/70 backdrop-blur-lg border border-primary/20 shadow-2xl rounded-3xl transition-all hover:shadow-primary/30">
        <div className="card-body space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Upload Your Video
            </h1>
            <p className="text-base-content/70">
              Upload and share your videos seamlessly with Cloudinary.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            {isUploading && (
              <progress className="progress progress-primary w-full mt-3"></progress>
            )}

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
