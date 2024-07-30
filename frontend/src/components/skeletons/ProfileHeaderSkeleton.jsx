import React from 'react';
import { FaLink } from 'react-icons/fa';
import { IoCalendarOutline } from 'react-icons/io5';

const ProfileHeaderSkeleton = () => {
  return (
    <div className='flex-[4_4_0] border-r border-gray-700 min-h-screen'>
      {/* Header Skeleton */}
      <div className='animate-pulse'>
        <div className='relative group/cover mt-16'>
          {/* User Avatar Skeleton */}
          <div className='avatar flex justify-center mt-6'>
            <div className='w-32 h-32 rounded-full bg-gray-600 relative group/avatar'></div>
          </div>
        </div>

        <div className='flex justify-center mt-5 px-4'>
          <div className='flex justify-center flex-col gap-2'>
            {/* User Name Skeleton */}
            <div className='h-5 bg-gray-700 rounded w-32'></div>
            <div className='flex flex-row gap-10'>
              {/* Username and Join Date Skeleton */}
              <div className='h-4 bg-gray-700 rounded w-24'></div>
              <div className='flex gap-2 items-center'>
                <IoCalendarOutline className='w-4 h-4 text-gray-500' />
                <div className='h-4 bg-gray-700 rounded w-24'></div>
              </div>
            </div>
            {/* Link Skeleton */}
            <div className='flex gap-1 items-center'>
              <FaLink className='w-3 h-3 text-gray-500' />
              <div className='h-4 bg-gray-700 rounded w-40'></div>
            </div>
            {/* Bio Skeleton */}
            <div className='h-4 bg-gray-700 rounded w-60 my-2'></div>
          </div>
        </div>
        {/* Tabs Skeleton */}
        <div className='flex w-full border-b border-gray-700 mt-4'>
          <div className='flex justify-center flex-1 p-3'>
            <div className='h-4 bg-gray-700 rounded w-12'></div>
          </div>
          <div className='flex justify-center flex-1 p-3'>
            <div className='h-4 bg-gray-700 rounded w-12'></div>
          </div>
        </div>
      </div>
      {/* Events Skeleton */}
      <div className='animate-pulse'>
        <div className='h-24 bg-gray-700 rounded my-4 mx-6'></div>
        <div className='h-24 bg-gray-700 rounded my-4 mx-6'></div>
        <div className='h-24 bg-gray-700 rounded my-4 mx-6'></div>
      </div>
    </div>
  );
};

export default ProfileHeaderSkeleton;
