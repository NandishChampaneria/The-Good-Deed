import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

const Organization = ({ organization }) => {
  const { username } = organization;
  const{ data: events, isLoading } = useQuery({
    queryKey: ["events", username],
    queryFn: async () => {
      if(!username) return [];
      try {
        const res = await fetch(`/api/events/user/${username}`);
        const data = await res.json();

        if(!res.ok) {
          throw new Error(data.error || "Failed to fetch events");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    enabled: !!username
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Link to={`/profile/${organization.username}`} className="flex gap-5 p-3 rounded-[2rem] cursor-pointer border-2 border-transparent hover:border-accent transition-all duration-300 ease-in-out">
      <div>
        <img
          src={organization.profileImg || '/avatar-placeholder.png'}
          alt={organization.fullName}
          className="w-28 rounded-[1.25rem] object-cover aspect-square"
        />
      </div>
      <div className="flex flex-col items-start justify-center">
        <h3 className="text-xl text-black font-semibold">{organization.fullName}</h3>
        <h2 className="text-sm text-gray-700">{events?.length} events</h2>
      </div>
    </Link>
  );
};

export default Organization;