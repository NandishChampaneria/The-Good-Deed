import React from "react";

const OrganizationSkeleton = () => {
  return (
    <div className="flex gap-5 p-4 rounded-[2rem] border-2 border-transparent animate-pulse">
      <div className="w-28 h-28 rounded-full bg-gray-400"></div>
      <div className="flex flex-col items-start justify-center">
        <div className="w-40 h-6 bg-gray-400 rounded-md mb-2"></div>
        <div className="w-24 h-4 bg-gray-400 rounded-md"></div>
      </div>
    </div>
  );
};

export default OrganizationSkeleton;