import React from 'react'

const HomeSkeleton = () => {
  return (
    <div>
        <div className="join flex justify-center w-full">
            <div className="join-item btn w-28 sm:w-36 md:w-40 bg-gray-400 animate-pulse"></div>
            <div className="join-item btn w-28 sm:w-36 md:w-40 bg-gray-400 animate-pulse"></div>
        </div>
        <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical m-10">
            {Array(2).fill(0).map((_, index) => (
                <li key={index}>
                    <div className="timeline-middle">
                        <div className="h-5 w-5 bg-gray-400 animate-pulse rounded-full"></div>
                    </div>
                    <div className={`relative ${index % 2 === 0 ? "timeline-start" : "timeline-end"} mb-10 ${index % 2 === 0 ? "md:text-end" : ""}`}>
                        <div className="font-mono italic bg-gray-400 animate-pulse h-5 w-72 mb-2"></div>
                        <div className="bg-gray-400 animate-pulse h-60 w-full rounded-md"></div>
                    </div>
                    <hr />
                </li>
            ))}
        </ul>
    </div>
  )
}

export default HomeSkeleton