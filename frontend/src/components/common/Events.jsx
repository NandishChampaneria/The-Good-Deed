import Event from "./Event";
import EventSkeleton from "../skeletons/EventSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Events = ({ feedType, username, userId }) => {
  const getEventEndpoint = () => {
    switch(feedType) {
      case "events":
        return `/api/events/user/${username}`;
      case "joined":
        return `/api/events/joined/${userId}`;
      case "active":
        return "/api/events/all/active";
      default:
        return "/api/events/all";
    }
  };

  const EVENT_ENDPOINT = getEventEndpoint();

  const{ data: events, isLoading, refetch } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      try {
        const res = await fetch(EVENT_ENDPOINT);
        const data = await res.json();

        if(!res.ok) {
          throw new Error(data.error || "Failed to fetch events");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    enabled: !!username && !!userId,
  });

  useEffect(() => {
    refetch();
  }, [feedType, refetch]);


  return (
    <>
      {isLoading && (
        <div className="container mx-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <EventSkeleton />
            <EventSkeleton />
            <EventSkeleton />
            <EventSkeleton />
          </div>
        </div>
      )}
      {!isLoading && events?.length === 0 && (
        <p className="text-center my-4">No events in this tab</p>
      )}
      {!isLoading && events && (
        <div className="container mx-auto ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((event) => (
              <Event key={event._id} event={event} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Events;
