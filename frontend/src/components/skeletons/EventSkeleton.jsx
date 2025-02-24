import React from "react";

const EventSkeleton = () => {
  return (
    <div className="animate-pulse flex flex-col items-center p-4 border sm:p-6 rounded-xl bg-gray-200">
      {/* Image Skeleton */}
      <div className="w-72 h-72 bg-gray-300rounded-xl"></div>

      {/* Title Skeleton */}
      <div className="w-3/4 h-6 bg-gray-400  rounded mt-4"></div>

      {/* Author Skeleton */}
      <div className="flex items-center mt-2">
        <div className="w-8 h-8 bg-gray-400  rounded-full"></div>
        <div className="w-1/2 h-4 bg-gray-400  rounded ml-3"></div>
      </div>

      {/* Location & Date Skeletons */}
      <div className="w-2/3 h-4 bg-gray-400 rounded mt-2"></div>
      <div className="w-1/2 h-4 bg-gray-400  rounded mt-2"></div>

      {/* Button Skeleton */}
      <div className="w-full h-10 bg-gray-400  rounded mt-4"></div>
    </div>
  );
};

export default EventSkeleton;