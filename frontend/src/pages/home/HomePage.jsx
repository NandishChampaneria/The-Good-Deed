import { useMutation, useQuery } from "@tanstack/react-query";
import Events from "../../components/common/Events.jsx";
import Navbar from "../../components/common/Navbar.jsx";
import { format } from "date-fns";
import EventHome from "../../components/common/EventHome.jsx";
import { useState } from "react";
import { SlCalender } from "react-icons/sl";
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
  });
  
  
  // Handle loading and error states
  if (isLoading) return <div><HomeSkeleton /></div>;
  if (error) return <div>Error: {error.message}</div>;

  // Ensure 'events' is an array before mapping
  return (
    <div>
      <div className="join flex justify-center w-full">
        <input className="join-item btn w-28 sm:w-36 md:w-40" type="radio" name="options" aria-label="Upcoming" defaultChecked onClick={() => setFeedType("upcoming")} />
        {feedType === "upcoming"}
      
        <input className="join-item btn w-28 sm:w-36 md:w-40" type="radio" name="options" aria-label="Past" onClick={() => setFeedType("past")} />
        {feedType === "past"}
      </div>
      <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical m-10">
        {filteredEvents && filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => (
            <li 
              key={event._id}
              
            >
              <div className="timeline-middle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className={`relative ${index % 2 === 0 ? "timeline-start" : "timeline-end"} mb-10 ${index % 2 === 0 ? "md:text-end": ""}`}>
                <time className="font-mono italic">{format(new Date(event.startDate), 'MMM d, yyyy')}</time>
                <EventHome key={event._id} event={event} mutate={updateEventMutation} />
              </div>
              <hr />
            </li>
          ))
        ) : (
          <div></div>
        )}
      </ul>
      <div className="items-center">
        { filteredEvents.length <= 0 &&
          <div className="flex justify-center flex-col gap-10">
            <div className="flex justify-center">
              <SlCalender className="text-9xl flex"/>
            </div>
            <h1 className="flex justify-center font-bold text-3xl">No Upcoming Events</h1>
          </div>
        }   
      </div>
    </div>
  );
};

export default HomePage;
