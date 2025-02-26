import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
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


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true, // Use 12-hour clock
        });
        return `${formattedDate} at ${formattedTime}`;
    };

    const formatGoogleCalendarDate = (startDate, endDate) => {
        const toISOStringWithoutMs = (date) => new Date(date).toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";
        
        const formattedStart = toISOStringWithoutMs(startDate);
        const formattedEnd = toISOStringWithoutMs(endDate);
        
        return `${formattedStart}/${formattedEnd}`;
    };

    useEffect(() => {
        if (authUser) {
            setIsJoined(authUser.joinedEvents.includes(eventId));
        }
    }, [authUser, eventId]);

    if (isLoading) return <LoadingSpinner />;

    if (!event) {
        return <div className="p-4">Event not found</div>;
    }

    const isOwner = authUser._id === event.user._id;
    const now = new Date();
    const isEventInFuture = new Date(event.startDate) >= now;

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="card lg:card-side bg-transparent">
                <div className='flex flex-col items-center sm:p-4 px-0 py-4 lg:items-start gap-10'>
                    <figure className='max-w-xs'>
                        <img
                            className="w-full h-full object-cover rounded-[1rem]"
                            src={event.img}
                            alt={event.title}
                        />
                    </figure>
                    <div className='ep'>
                        <p className="text-gray-600 mb-3">Organiser</p>
                        <hr className='bg-neutral' />
                        <Link to={`/profile/${event.user.username}`} className='flex items-center mt-3'>
                            <div className='w-5 h-5 mr-2'>
                                <img src={event.user.profileImg || "/avatar-placeholder.png"} alt="" className='rounded-full' />  
                            </div>
                            <p className="text-black">{event.user.fullName}</p>
                        </Link>
                    </div>
                </div>
                <div className="card-body px-0 py-2 sm:p-4 lg:max-w-[512px] overflow-y-auto">
                    <h2 className="card-title text-6xl sm:text-7xl text-black font-bold mb-7 break-all">{event.title}</h2>
                    <div className='mb-6 ep1'>
                        <div className="text-black text-2xl flex items-center sm:text-3xl">
                            <div className='w-10 h-10 mr-2'>
                                <img src={event.user.profileImg || "/avatar-placeholder.png"} alt="" className='rounded-full' />  
                            </div>
                            {event.user.fullName}
                        </div>
                    </div>
                    <div className="flex text-black flex-col gap-5">
                        <div className='flex items-center flex-row'>
                            <MdDateRange className="mr-2 border-2 p-1 border-gray-700 rounded-md text-4xl" />
                            <a
                                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${formatGoogleCalendarDate(event.startDate, event.endDate)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                            >
                                {formatDate(event.startDate)}
                            </a>
                        </div>
                        <div className='flex items-center flex-row'>
                            <MdLocationOn className="mr-2 border-2 p-1 border-gray-700 rounded-md text-4xl" />
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                            >
                                {event.location}
                            </a>
                        </div>
                        <div className="card-actions flex mt-[3.25rem] mb-8">
                            {!isOwner && (
                                <button 
                                    className="btn w-full bg-black text-accent hover:text-black hover:bg-white border-none" 
                                    onClick={() => joinEvent()} 
                                    disabled={isJoining || !authUser || !isEventInFuture}
                                >
                                    {isJoining ? <LoadingSpinner size="sm" /> : (isJoined ? <FaCheck /> : "Join")}
                                </button>
                            )}
                            {isOwner && (
                                <Link 
                                    className="btn w-full bg-black text-accent hover:text-black hover:bg-white border-none" 
                                    to={`/event/manage/${event._id}`}
                                >
                                    Manage
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className=''>
                        <p className="text-gray-600 mb-3">About the Event</p>
                        <hr className='bg-neutral' />
                        <p
                            className="text-black mt-3"
                            dangerouslySetInnerHTML={{ __html: event.description }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventPage;
