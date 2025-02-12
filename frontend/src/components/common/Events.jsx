import Event from "./Event";
import EventSkeleton from "../skeletons/EventSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

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
        <div className="container mx-auto p-6">
          <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 xl:grid-cols-3">
            <EventSkeleton />
            <EventSkeleton />
            <EventSkeleton />
          </div>
        </div>
      )}
      {!isLoading && events?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-6 px-6">
          <div className="text-lg ">
            {feedType === "joined" ? 
              <div className="flex justify-center flex-col gap-3 text-center">
                <span>
                  You haven't joined any events yet. <br />
                </span>
                <Link to="/discover" className="btn btn-primary">Explore</Link>
              </div> 
              : 
              <div> 
                <span>
                  You haven't created any events yet. <br />              
                </span>
                <Link to="/createevent" className="btn btn-primary">Create Event</Link>
              </div>
            }
          </div>
        </div>
      )}
      {!isLoading && events && (
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 xl:grid-cols-3">
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
