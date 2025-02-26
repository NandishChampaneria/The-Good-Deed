import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Organization from './Organization';
import OrganizationSkeleton from '../skeletons/OrganizationSkeleton';

const Organizations = () => {
  // Fetch organizations data using useQuery
  const { data: organizations, isLoading, error } = useQuery({
    queryKey: ['organizations'], // Unique query key
    queryFn: async () => {
      try {
        const res = await fetch('/api/users/organizations'); // Replace with your actual API endpoint
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch organizations');
        }

        return data;
      } catch (error) {
        throw new Error(error.message || 'Error fetching organizations');
      }
    },
    enabled: true, // This will fetch immediately when component mounts
  });
  

  return (
    <div>
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="container mx-auto p-6">
          <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 xl:grid-cols-3">
            {/* Add skeletons here if needed */}
                <OrganizationSkeleton />
                <OrganizationSkeleton />
                <OrganizationSkeleton />
          </div>
        </div>
      )}

      {/* Handle Errors */}
      {error && !isLoading && (
        <div className="container mx-auto p-6">
          <p>Error loading organizations: {error.message}</p>
        </div>
      )}

      {/* Render organizations once data is fetched */}
      {!isLoading && organizations && organizations.length > 0 && (
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-4 mt-8 lg:grid-cols-2 xl:grid-cols-3 justify-center items-center">
            {organizations.map((organization) => (
                <Organization key={organization._id} organization={organization} />
            ))}
          </div>
        </div>
      )}

      {/* Handle case if no organizations found */}
      {!isLoading && organizations && organizations.length === 0 && (
        <div className="container mx-auto p-6">
          <p>No organizations found.</p>
        </div>
      )}
    </div>
  );
};

export default Organizations;