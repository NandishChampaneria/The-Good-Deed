import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MdDateRange, MdLocationOn } from 'react-icons/md'; 
import { FaCheck } from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EventPage = () => {
    const { eventId } = useParams();
    const queryClient = useQueryClient();
    const [isJoined, setIsJoined] = useState(false);

    // Fetch event details
    const { data: event, isLoading } = useQuery({
        queryKey: ["event", eventId],
        queryFn: async () => {
            try {
                const res = await fetch(`/api/events/${eventId}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to fetch event");
                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
    });

    // Fetch authUser (if logged in)
    const { data: authUser } = useQuery({
        queryKey: ["authUser"],
        enabled: true,  // or false if you want to load it conditionally
    });

    // Join/Unjoin event
    const { mutate: joinEvent, isPending: isJoining } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch(`/api/events/join/${eventId}`, {
                    method: 'POST',
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Something went wrong");
                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
        onSuccess: (updatedJoins) => {
            toast.success(`Successfully ${isJoined ? 'unjoined' : 'joined'} the event!`);
            queryClient.setQueryData(["event", eventId], (oldEvent) => ({
                ...oldEvent,
                joins: updatedJoins,
            }));
            if (authUser) {
                queryClient.setQueryData(["authUser"], (oldAuthUser) => ({
                    ...oldAuthUser,
                    joinedEvents: isJoined
                        ? oldAuthUser.joinedEvents.filter(id => id !== eventId)
                        : [...oldAuthUser.joinedEvents, eventId],
                }));
                setIsJoined(!isJoined);
            }
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    useEffect(() => {
        if (authUser) {
            setIsJoined(authUser.joinedEvents.includes(eventId));
        }
    }, [authUser, eventId]);

    if (isLoading) return <LoadingSpinner />;

    if (!event) {
        return <div className="p-4">Event not found</div>;
    }

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="card lg:card-side bg-base-100  p-4">
                <div className='flex flex-col gap-10'>
                    <figure>
                        <img
                            className="w-96 h-96 object-cover rounded-lg"
                            src={event.img}
                            alt={event.title}
                        />
                    </figure>
                    <div className='ep'>
                        <p className="text-gray-500 mb-3">Organiser</p>
                        <hr className='opacity-20' />
                        <p className="text-white-800 mt-3">{event.user.fullName}</p>
                    </div>
                </div>
                <div className="card-body">
                    <h2 className="card-title text-7xl font-bold mb-10">{event.title}</h2>
                    <div className='mb-6 ep1'>
                        <p className="text-white-800 text-3xl mt-3">{event.user.fullName}</p>
                    </div>
                    <p className="flex flex-col gap-5">
                        <div className='flex flex-row'>
                            <MdDateRange className="mr-2 text-2xl" /> {event.startDate}
                        </div>
                        <div className='flex flex-row'>
                            <MdLocationOn className="mr-2 text-2xl" /> {event.location}
                        </div>
                    </p>
                    <div className="card-actions mt-4 mb-5">
                        <button 
                            className="btn w-full btn-primary" 
                            onClick={() => joinEvent()} 
                            disabled={isJoining || !authUser}
                        >
                            {isJoining ? <LoadingSpinner size="sm" /> : (isJoined ? <FaCheck /> : "Join")}
                        </button>
                    </div>
                    <div className=''>
                        <p className="text-gray-500 mb-3">About the Event</p>
                        <hr className='opacity-20' />
                        <p className="text-white-800 mt-3">{event.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventPage;
