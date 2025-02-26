import React, { useState, useRef, useEffect } from 'react';
import { MdLocationOn, MdDateRange, MdManageAccounts, MdDelete } from 'react-icons/md';
import { IoPeople } from "react-icons/io5"; // Import icons for location, date, and time
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaCheck } from 'react-icons/fa';
import { format } from "date-fns";
import Popup from './Popup';

import LoadingSpinner from './LoadingSpinner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const Event = ({ event }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
    const { data: authUser } = useQuery({ queryKey: ["authUser"], enabled: true });
    const queryClient = useQueryClient();
    const sidebarRef = useRef(null);
    const isJoined = authUser ? authUser.joinedEvents.includes(event._id) : false;
    const isOwner = authUser._id === event.user._id;
    const eventId = event._id;

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

    const formatTime = (timeString) => {
        const date = new Date(timeString);
        const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true, // Use 12-hour clock
        });
        return formattedTime;
    };

    const formatGoogleCalendarDate = (startDate, endDate) => {
        const toISOStringWithoutMs = (date) => new Date(date).toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";
        
        const formattedStart = toISOStringWithoutMs(startDate);
        const formattedEnd = toISOStringWithoutMs(endDate);
        
        return `${formattedStart}/${formattedEnd}`;
    };

    const { mutate: deleteEvent, isPending: isDeleting } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/api/events/${eventId}`, {
					method: "DELETE",
				});
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["events"] });
            setDeletePopupOpen(false); 
            window.location.reload();
		},
	});

    const { mutate: joinEvent, isPending: isJoining } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch(`/api/events/join/${event._id}`, {
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
            const action = isJoined ? 'unjoined' : 'joined';
            toast.success(`Successfully ${action} the event!`);
            queryClient.setQueryData(["events"], (oldData) =>
                oldData.map((e) =>
                    e._id === event._id ? { ...e, joins: updatedJoins } : e
                )
            );
            queryClient.setQueryData(["authUser"], (oldAuthUser) => ({
                ...oldAuthUser,
                joinedEvents: isJoined
                    ? oldAuthUser.joinedEvents.filter(id => id !== event._id)
                    : [...oldAuthUser.joinedEvents, event._id],
            }));
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            setSidebarOpen(false);
        }
    };

    const handleJoinEvent = () => {
        if (isJoining || !authUser) return;
        joinEvent();
    };

    useEffect(() => {
        if (isSidebarOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSidebarOpen]);

    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    
        return () => {
            document.body.style.overflow = "";
        };
    }, [isSidebarOpen]);

    const now = new Date();
    const isEventInFuture = new Date(event.startDate) >= now;

    return (
        <div className="relative">
            <div 
                className="md:flex hidden flex-col items-start p-4 border-2 border-transparent rounded-[2rem] bg-transparent hover:border-accent transition-all duration-300 ease-in-out w-80 max-w-80" 
                onClick={toggleSidebar}
            > 
                {/* Image Container */}
                <div className="relative w-full flex-shrink-0"> 
                    <img
                        className="object-cover w-full h-full rounded-[1rem] aspect-square"
                        src={event.img}
                        alt=""
                    />

                    {isOwner && (
                        <div className='absolute top-1 right-1'>
                            <Link to={`/event/manage/${event._id}`}>
                                <MdManageAccounts className='rounded-t-[0.75rem] border-b border-accent bg-white text-base-content hover:text-black p-1 text-3xl sm:text-4xl' />
                            </Link>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDeletePopupOpen(true);
                                }}
                            >
                                <MdDelete className="rounded-b-[0.75rem] bg-white text-base-content hover:text-red-600 p-1 text-3xl sm:text-4xl" />
                            </button>
                            <Popup isOpen={isDeletePopupOpen} onClose={() => setDeletePopupOpen(false)}>
                                <h2 className="text-lg text-black font-semibold mb-1">Confirm Deletion</h2>
                                <p className='text-gray-700'>Are you sure you want to delete this event?</p>
                                <div className="flex justify-center mt-4">
                                    <button
                                        className="px-4 py-2 text-black bg-gray-300 rounded-md mr-2"
                                        onClick={() => setDeletePopupOpen(false)}
                                    >
                                    Cancel
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-red-600 text-white rounded-md"
                                        onClick={deleteEvent}
                                    >
                                    Delete
                                    </button>
                                </div>
                            </Popup>
                        </div>
                    )}
                </div>

                {/* Event Details */}
                <div className="w-72 flex flex-col items-start">
                    
                    {/* Title with Ellipsis */}
                    <h1 className="mt-2 mb-2 text-2xl text-start font-semibold text-black capitalize truncate w-72 whitespace-nowrap overflow-hidden text-ellipsis">
                        {event.title}
                    </h1>

                    {/* User Name with Ellipsis */}
                    <div className="flex text-gray-700 items-center w-72">
                        <img 
                            src={event.user.profileImg || "/avatar-placeholder.png"} 
                            alt="" 
                            className="w-5 h-5 mr-[10px] rounded-full flex-shrink-0"
                        />
                        <span className="truncate text-start w-full whitespace-nowrap overflow-hidden text-ellipsis">
                            {event.user.fullName}
                        </span>
                    </div>

                    {/* Location with Ellipsis */}
                    <div className="flex text-gray-700 items-center w-72 mt-1">
                        <MdLocationOn className="mr-2 -ml-[0.15rem] text-lg w-6 h-6 flex-shrink-0" />
                        <span className="truncate text-start w-full whitespace-nowrap overflow-hidden text-ellipsis">
                            {event.location}
                        </span>
                    </div>

                </div>
            </div>

            <div 
                className="flex md:hidden gap-2 p-2 border-2 border-transparent rounded-2xl bg-transparent hover:border-accent transition-all duration-300 w-full max-w-full ease-in-out cursor-pointer"
                onClick={toggleSidebar}
            >
                <div className="flex-shrink-0 relative">
                    <img
                        className="object-cover w-28 h-28 sm:w-28 sm:h-28 md:w-28 md:h-28 rounded-[0.5rem]"
                        src={event.img}
                        alt={event.title}
                    />
                    {isOwner && (
                        <div className='absolute top-1 right-1'>
                            <Link to={`/event/manage/${event._id}`}>
                                <MdManageAccounts className='rounded-t-[0.25rem] border-b border-accent bg-white text-base-content hover:text-black p-1 text-2xl' />
                            </Link>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDeletePopupOpen(true);
                                }}
                            >
                                <MdDelete className="rounded-b-[0.25rem] bg-white text-base-content hover:text-red-600 p-1 text-2xl" />
                            </button>
                            <Popup isOpen={isDeletePopupOpen} onClose={() => setDeletePopupOpen(false)}>
                                <h2 className="text-lg text-black font-semibold mb-1">Confirm Deletion</h2>
                                <p className='text-gray-700'>Are you sure you want to delete this event?</p>
                                <div className="flex justify-center mt-4">
                                    <button
                                        className="px-4 py-2 text-black bg-gray-300 rounded-md mr-2"
                                        onClick={() => setDeletePopupOpen(false)}
                                    >
                                    Cancel
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-red-600 text-white rounded-md"
                                        onClick={deleteEvent}
                                    >
                                    Delete
                                    </button>
                                </div>
                            </Popup>
                        </div>
                    )}
                </div>
                <div className="flex flex-col justify-center w-full overflow-hidden">
                    <h1 className="text-xl font-semibold text-black capitalize truncate">
                        {event.title}
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <img 
                            src={event.user.profileImg || "/avatar-placeholder.png"} 
                            alt={event.user.fullName}
                            className="w-4 h-4 rounded-full"
                        />
                        <span className="text-gray-700 text-sm truncate">{event.user.fullName}</span>
                    </div>
                    <p className="text-gray-700 flex items-center mt-1 text-sm truncate">
                        <MdLocationOn className="text-lg -ml-[0.13rem] w-5 h-5 flex-shrink-0" />
                        <span className="truncate">{event.location}</span>
                    </p>
                </div>
            </div>

            {/* Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-10000"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <div
                ref={sidebarRef}
                className={`fixed z-10000 top-0 md:text-start right-0 h-full w-100 w-full bg-gradient-to-r from-purple-400 to-cyan-400 rounded-l-3xl shadow-lg transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}
                style={{ maxHeight: '100vh' }}
            >
                <div className="sticky flex items-center top-0 left-0 w-full h-16 bg-gradient-to-r from-purple-400 to-cyan-400 p-4 z-30">
                    <button
                        className="text-accent text-3xl font-semibold ml-3 mr-7 hover:text-black"
                        onClick={toggleSidebar}
                    >
                        &times;
                    </button>
                    <Link to={`/event/${event._id}`} 
                        className="text-base-content bg-accent rounded-md p-2 font-semibold hover:text-black"
                    >
                        Event Page
                    </Link>
                </div>

                <div className='flex justify-center mt-8'>
                    <figure className='max-w-xs'>
                        <img
                            className="w-full h-full object-cover p-4 rounded-[2rem]"
                            src={event.img}
                            alt={event.title}
                        />
                    </figure>
                </div>
                <div className="px-4 py-11 sm:p-11">
                    <h2 className="text-5xl text-black font-bold mb-4 break-all">{event.title}</h2>
                    <p className='text-gray-700 text-xl items-center flex flex-row mb-6'>
                        <div className='w-7 h-7 mr-2'>
                            <img src={event.user.profileImg || "/avatar-placeholder.png"} alt="" className='rounded-full' />  
                        </div>
                        {event.user.fullName}
                    </p>
                    <div className='flex flex-col justify-between'>
                        <p className="text-black flex items-center mb-4">
                            <MdDateRange className="mr-2 text-4xl border-2 p-1 border-gray-700 rounded-md" />
                            <a
                                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${formatGoogleCalendarDate(event.startDate, event.endDate)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                            >
                                {formatDate(event.startDate)}
                            </a>
                        </p>
                        <p className="text-black flex items-center mb-2">
                            <MdLocationOn className="mr-2 text-4xl border-2 p-1 border-gray-700 rounded-md" />
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                            >
                                {event.location}
                            </a>
                        </p>
                    </div>
                    <div className="card-actions justify-center mt-4 mb-5">
                        {!isOwner && (
                            <button className="btn w-full hover:bg-accent hover:text-black text-accent bg-black border-none" onClick={handleJoinEvent} disabled={isJoining || !authUser || !isEventInFuture}>
                                {   
                                    isEventInFuture &&
                                    (isJoining ? <LoadingSpinner size="sm" /> : (isJoined ? <FaCheck /> : "Join"))
                                }
                                {!isEventInFuture && ("Event is Over")}
                            </button>
                        )}   
                        {   
                            isOwner &&
                            <Link className='btn w-full hover:bg-accent hover:text-black text-accent bg-black border-none' to={`/event/manage/${event._id}`}>Manage</Link>
                        }
                    </div>
                    <div>
                        <p className='text-gray-700 mb-2'>Description</p>
                        <p 
                            className='text-black'
                            dangerouslySetInnerHTML={{ __html: event.description }}
                        >
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Event;
