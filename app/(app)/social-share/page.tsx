"use client";

import React, { useState, useEffect, useRef } from "react";
import { CldImage } from "next-cloudinary";

const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
  "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
};

type SocialFormat = keyof typeof socialFormats;

export default function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>(
    "Instagram Square (1:1)"
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (uploadedImage) setIsTransforming(true);
  }, [selectedFormat, uploadedImage]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload image");

      const data = await response.json();
      setUploadedImage(data.publicId);
    } catch (error) {
      console.log(error);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (!imageRef.current) return;

    fetch(imageRef.current.src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${selectedFormat
          .replace(/\s+/g, "_")
          .toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-300 to-base-100 flex items-center justify-center p-6">
      <div className="card w-full max-w-3xl bg-base-100/70 backdrop-blur-lg border border-primary/20 shadow-2xl rounded-3xl transition-all hover:shadow-primary/30">
        <div className="card-body space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Social Media Image Creator
            </h1>
            <p className="text-base-content/70">
              Upload, resize, and download images perfectly optimized for each
              platform.
            </p>
          </div>

          {/* Upload Section */}
          <div className="space-y-3">
            <label className="font-medium text-sm text-base-content/70">
              Upload Image
            </label>
            <input
              type="file"
              onChange={handleFileUpload}
              className="file-input file-input-bordered file-input-primary w-full"
            />
            {isUploading && (
              <progress className="progress progress-primary w-full mt-2"></progress>
            )}
          </div>

          {/* Show transformation options after upload */}
          {uploadedImage && (
            <>
              <div className="divider my-4"></div>

              {/* Format Selection */}
              <div className="space-y-3">
                <label className="font-medium text-sm text-base-content/70">
                  Choose Social Media Format
                </label>
                <select
                  className="select select-bordered select-primary w-full"
                  value={selectedFormat}
                  onChange={(e) =>
                    setSelectedFormat(e.target.value as SocialFormat)
                  }
                >
                  {Object.keys(socialFormats).map((format) => (
                    <option key={format} value={format}>
                      {format}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preview Section */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Preview</h3>
                <div className="relative rounded-2xl overflow-hidden border border-base-300 bg-base-200 flex justify-center items-center p-3 shadow-inner">
                  {isTransforming && (
                    <div className="absolute inset-0 flex items-center justify-center bg-base-100/70 backdrop-blur-sm z-10">
                      <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                  )}
                  <CldImage
                    width={socialFormats[selectedFormat].width}
                    height={socialFormats[selectedFormat].height}
                    src={uploadedImage}
                    sizes="100vw"
                    alt="transformed image"
                    crop="fill"
                    aspectRatio={socialFormats[selectedFormat].aspectRatio}
                    gravity="auto"
                    ref={imageRef}
                    onLoad={() => setIsTransforming(false)}
                    className="rounded-xl max-h-[400px] object-contain transition-all hover:scale-[1.02] duration-300"
                  />
                </div>
              </div>

              {/* Download Button */}
              <div className="card-actions justify-end mt-6">
                <button
                  className="btn btn-primary btn-wide shadow-md hover:shadow-lg hover:scale-[1.03] transition-all"
                  onClick={handleDownload}
                >
                  Download for {selectedFormat}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
