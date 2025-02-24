import React from 'react';
import { FaLink } from 'react-icons/fa';
import { IoCalendarOutline } from 'react-icons/io5';

const ProfileHeaderSkeleton = () => {
  return (
    <div className='flex flex-col animate-pulse'>
      <div className='flex justify-start sm:justify-center mb-10 gap-5 px-6 flex-col sm:flex-row'>
        <div className='relative group/cover mt-16'>
          {/* User Avatar Skeleton */}
          <div className='avatar flex'>
            <div className='w-24 sm:w-32 h-24 sm:h-32 rounded-full bg-gray-300'></div>
          </div>
        </div>
        <div className='flex justify-start sm:justify-center mt-1 pl-1'>
          <div className='flex justify-center flex-col gap-2'>
            {/* Name Skeleton */}
            <div className='h-5 bg-gray-300 rounded w-32'></div>
            <div className='flex flex-row gap-5'>
              {/* Username and Join Date Skeleton */}
              <div className='h-4 bg-gray-300 rounded w-24'></div>
              <div className='flex gap-2 items-center'>
                <IoCalendarOutline className='w-4 h-4 text-gray-400' />
                <div className='h-4 bg-gray-300 rounded w-24'></div>
              </div>
            </div>
            {/* Link Skeleton */}
            <div className='flex gap-1 items-center'>
              <FaLink className='w-3 h-3 text-gray-400' />
              <div className='h-4 bg-gray-300 rounded w-40'></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Toggle Buttons Skeleton */}
      <div className='join flex justify-center w-full mt-4'>
        <div className='join-item btn w-32 sm:w-48 lg:w-60 h-10 bg-gray-300 rounded'></div>
        <div className='join-item btn w-32 sm:w-48 lg:w-60 h-10 bg-gray-300 rounded'></div>
      </div>
    </div>
  );
};

export default ProfileHeaderSkeleton;
