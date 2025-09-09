import React from 'react';

// Generic skeleton loader component
export const SkeletonLoader = ({ type = 'row', count = 1, className = '' }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'row':
        return (
          <div className={`flex items-center justify-between gap-3 px-3 py-2 m-1 rounded-md bg-[#505050] animate-pulse ${className}`}>
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="flex items-center gap-1 flex-shrink-0">
                <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                <div className="h-3 bg-gray-600 rounded w-16"></div>
              </div>
              <div className="h-5 w-px bg-gray-600 opacity-30 hidden sm:block"></div>
              <div className="flex-1 min-w-0">
                <div className="h-3 bg-gray-600 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-600 rounded w-1/2"></div>
              </div>
              <div className="h-3 bg-gray-600 rounded w-16 hidden md:block"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-10 sm:w-16 bg-gray-600 rounded"></div>
              <div className="h-8 w-10 sm:w-16 bg-gray-600 rounded"></div>
            </div>
          </div>
        );
      
      case 'game-card':
        return (
          <div className={`bg-live-primary rounded-md p-2 mb-2 animate-pulse ${className}`}>
            <div className="flex flex-col items-start mb-1 gap-1">
              <div className="h-3 bg-gray-600 rounded w-3/4"></div>
              <div className="h-3 bg-gray-600 rounded w-1/2"></div>
              <div className="h-3 bg-gray-600 rounded w-1/3"></div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="h-4 bg-gray-600 rounded w-2/5"></div>
              <div className="h-4 bg-gray-600 rounded w-1/5"></div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="h-4 bg-gray-600 rounded w-2/5"></div>
              <div className="h-4 bg-gray-600 rounded w-1/5"></div>
            </div>
          </div>
        );
      
      case 'sport-icon':
        return (
          <div className={`snap-start flex-shrink-0 sm:flex-1 flex flex-col items-center justify-center gap-1 border rounded-md sport-icon-box bg-gray-700 border-gray-600 animate-pulse ${className}`}
            style={{ padding: "0.45rem 0.7rem", minWidth: "64px" }}>
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-600 rounded-full"></div>
            <div className="h-3 bg-gray-600 rounded w-3/4"></div>
          </div>
        );
      
      case 'featured-game':
        return (
          <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-md border border-gray-600 bg-[#505050] animate-pulse ${className}`}>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                <div className="h-3 bg-gray-600 rounded w-16"></div>
              </div>
              <div className="h-4 bg-gray-600 rounded w-40"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-10 sm:w-16 bg-gray-600 rounded"></div>
              <div className="h-8 w-10 sm:w-16 bg-gray-600 rounded"></div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className={`bg-gray-700 rounded animate-pulse ${className}`}></div>
        );
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <React.Fragment key={index}>
          {renderSkeleton()}
        </React.Fragment>
      ))}
    </>
  );
};

export default SkeletonLoader;