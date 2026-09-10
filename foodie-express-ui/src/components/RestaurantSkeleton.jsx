import React from 'react';

const RestaurantSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 p-4 animate-pulse">
      {/* Image Box */}
      <div className="w-full h-48 bg-gray-200 rounded-xl mb-4 shimmer-bg"></div>
      
      {/* Title Line */}
      <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-3 shimmer-bg"></div>
      
      {/* Subtitle Line */}
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded-md w-1/4 shimmer-bg"></div>
        <div className="h-4 bg-gray-200 rounded-md w-1/4 shimmer-bg"></div>
      </div>
      
      {/* Bottom Footer Line */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="h-4 bg-gray-100 rounded-md w-1/2 shimmer-bg"></div>
      </div>
    </div>
  );
};

export default RestaurantSkeleton;