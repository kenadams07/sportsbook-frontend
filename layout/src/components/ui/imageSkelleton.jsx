import React from "react";

export default function ImageSkeleton({ width = "100%", height = "230px", className = "" }) {
  return (
    <div
      className={`relative overflow-hidden bg-gray-700 rounded-md ${className}`}
      style={{ width, height }}
    >
      {/* Shimmer effect */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"
        style={{ transform: "translateX(-100%)" }}
      />
    </div>
  );
}
