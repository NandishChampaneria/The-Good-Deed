import Event from "./Event";
import EventSkeleton from "../skeletons/EventSkeleton";
import { useQuery } from "@tanstack/react-query";

const Events = () => {
  const{ data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/events/all");
        const data = await res.json();

        if(!res.ok) {
          throw new Error(data.error || "Failed to fetch events");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  })

  return (
    <>
      {isLoading && (
        <div className="container mx-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <EventSkeleton />
            <EventSkeleton />
            <EventSkeleton />
          </div>
        </div>
      )}
      {!isLoading && events?.length === 0 && (
        <p className="text-center my-4">No events in this tab. Switch 👻</p>
      )}
      {!isLoading && events && (
        <div className="container mx-auto p-4">
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
