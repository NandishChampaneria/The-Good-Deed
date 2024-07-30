import Event from "./Event";
import EventSkeleton from "../skeletons/EventSkeleton";
import { EVENTS } from "../../utils/db/dummy";

const Events = () => {
  const isLoading = false;

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
      {!isLoading && EVENTS?.length === 0 && (
        <p className="text-center my-4">No events in this tab. Switch 👻</p>
      )}
      {!isLoading && EVENTS && (
        <div className="container mx-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {EVENTS.map((event) => (
              <Event key={event._id} event={event} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Events;
