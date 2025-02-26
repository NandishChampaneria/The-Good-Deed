import { useMutation, useQuery } from "@tanstack/react-query";
import Events from "../../components/common/Events.jsx";
import Navbar from "../../components/common/Navbar.jsx";
import { format } from "date-fns";
import EventHome from "../../components/common/EventHome.jsx";
import { useState } from "react";
import { MdEventBusy} from "react-icons/md";
import { GoHourglass } from "react-icons/go";
import HomeSkeleton from "../../components/skeletons/HomeSkeleton.jsx";

const HomePage = () => {
  const [feedType, setFeedType] = useState("upcoming");
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });

  // Check if authUser is available before accessing its properties
  const userId = authUser?._id;
  const username = authUser?.username;
  

  const { data: events, isLoading, error } = useQuery({
    queryKey: ["myEvents"],
    queryFn: async () => {
      if (!userId || !username) {
        throw new Error("User ID or username is not available");
      }

      try {
        // Fetch joined events
        const joinedEventsRes = await fetch(`/api/events/joined/${userId}`);
        const joinedEvents = await joinedEventsRes.json();
        if (!joinedEventsRes.ok) throw new Error(joinedEvents.error || "Failed to fetch joined events");

        // Fetch created events
        const createdEventsRes = await fetch(`/api/events/user/${username}`);
        const createdEvents = await createdEventsRes.json();
        if (!createdEventsRes.ok) throw new Error(createdEvents.error || "Failed to fetch created events");

        // Combine the results
        return [...joinedEvents, ...createdEvents];
      } catch (error) {
        throw new Error(error.message || "An error occurred while fetching events");
      }
    },
  });
  const updateEventMutation = useMutation({
    mutationFn: async (eventId) => {
      try {
        const res = await fetch(`/api/events/join/${eventId}`, {
          method: 'POST',
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update event");
        return data;
      } catch (error) {
        throw new Error(error.message || "An error occurred while updating event");
      }
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["myEvents"]);
    },
    onError: (error) => {
      console.error("Error updating event:", error.message);
    },
  });

  // Filter events based on feedType
  const now = new Date();
  const filteredEvents = events?.filter(event => {
    const eventDate = new Date(event.endDate);
    return feedType === "upcoming" ? eventDate >= now : eventDate < now;
  }).sort((a,b) => new Date(a.startDate) - new Date(b.startDate));

  
  // Handle loading and error states
  if (isLoading) return <div><HomeSkeleton /></div>;
  if (error) return <div>Error: {error.message}</div>;

  // Ensure 'events' is an array before mapping
  return (
    <div>
      <div className="join flex justify-center w-full">
        <input className="join-item hover:bg-base-200 hover:text-black hover:border-none border-none btn w-28 sm:w-36 md:w-40" type="radio" name="options" aria-label="Upcoming" defaultChecked onClick={() => setFeedType("upcoming")} />
        {feedType === "upcoming"}
      
        <input className="join-item hover:bg-base-200 hover:text-black hover:border-none border-none btn w-28 sm:w-36 md:w-40" type="radio" name="options" aria-label="Past" onClick={() => setFeedType("past")} />
        {feedType === "past"}
      </div>
      

      <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical m-2 md:m-10">
        {filteredEvents && filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => (
            <li 
              key={event._id}
              
            >
              <div className="timeline-middle">
                {feedType === "past" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5 text-accent"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                      
                    />
                  </svg>
                )}
                {feedType === "upcoming" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5 text-accent"
                  >
                    <circle cx="10" cy="10" r="8" />
                  </svg>
                )}
              </div>
              <div className={`max-md:w-full max-md:pr-7 relative md:${index % 2 === 0 ? "timeline-start" : "timeline-end"} ${index % 1 === 0 ? "timeline-start" : "timeline-end"} mb-10 ${index % 2 === 0 ? "md:text-end": ""}`}>
                <time className="font-semibold text-purple-600">{format(new Date(event.startDate), 'MMM d, yyyy')}</time>
                <EventHome key={event._id} event={event} mutate={updateEventMutation} />
              </div>
              <hr className="bg-accent opacity-30"/>
            </li>
          ))
        ) : (
          <div></div>
        )}
      </ul>

      <div className="items-center">
        { filteredEvents.length <= 0 && feedType === "upcoming" &&
          <div className="flex justify-center flex-col px-4 text-center gap-10 text-accent">
            <div className="flex justify-center">
              <MdEventBusy className="text-9xl flex"/>
            </div>
            <h1 className="flex justify-center font-bold text-3xl">No Upcoming Events</h1>
          </div>
        }   
      </div>
      <div className="items-center">
        { filteredEvents.length <= 0 && feedType === "past" &&
          <div className="flex justify-center flex-col px-4 text-center gap-10 text-accent">
            <div className="flex justify-center">
              <GoHourglass className="text-9xl flex"/>
            </div>
            <h1 className="flex justify-center font-bold text-3xl">You have no past Events</h1>
          </div>
        }   
      </div>
    </div>
  );
};

export default HomePage;
