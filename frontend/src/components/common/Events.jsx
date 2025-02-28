import Event from "./Event";
import EventSkeleton from "../skeletons/EventSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const Events = ({ feedType, username, userId, limit }) => {
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

  const limitedEvents = limit ? events?.slice(0, limit) : events;

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
              <div className="flex justify-center text-white flex-col gap-3 text-center">
                <span>
                  No Events joined. <br />
                </span>
              </div> 
              : 
              <div className="flex justify-center text-white flex-col gap-3 text-center"> 
                <span>
                  No Events created. <br />              
                </span>
              </div>
            }
          </div>
        </div>
      )}
      {!isLoading && limitedEvents && (
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center items-center">
            {limitedEvents.map((event) => (
              <Event key={event._id} event={event} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Events;
