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
			toast.success("Post deleted successfully");
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
            {/* <div className="card flex-row-small lg:card-side bg-base-100 w-101 shadow-xl p-2 cursor-pointer hover:bg-base-300" onClick={toggleSidebar}>
                <figure>
                    <img
                        className="w-60 h-60 object-cover"
                        src={event.img}
                        alt="Album"
                    />
                </figure>
                <div className="card-body relative">
                    <div>
                        <p className='text-gray-500 text-start lg:absolute lg:top-2'>{formatTime(event.startDate)}</p>
                        {isOwner && (
                            <Link to={`/event/manage/${event._id}`} className='lg:absolute lg:top-2 right-2 bg-gray-600 text-white hover:bg-white hover:text-black p-1 rounded-lg text-sm'>Manage</Link>
                        )}
                    </div>
                    <h2 className="card-title md:text-start text-2xl font-bold">{event.title}</h2>                            

                    <p className="text-gray-500 flex items-center lg:absolute lg:bottom-20">
                        <div className="w-4 rounded-full mr-2">
                        <img
                            alt="Profile"
                            src={event.user.profileImg || "/avatar-placeholder.png"} />
                        </div>
                        {event.user.fullName}
                    </p>
                    <p className="text-gray-500 flex items-center lg:absolute lg:bottom-12">
                        <MdLocationOn className="mr-2" /> {event.location}
                    </p>
                    <p className="text-gray-500 flex items-center lg:absolute lg:bottom-4">
                        <div className="flex -space-x-2">
                            {event.attendees && event.attendees.length > 0 ? (
                            event.attendees.slice(0, 5).map((attendee, index) => (
                                <div key={index} className="w-4 h-4 rounded-full border-1 border-slate-900 overflow-hidden">
                                <img
                                    alt="Profile"
                                    src={attendee.profileImg || "/avatar-placeholder.png"}
                                    className="w-full h-full object-cover"
                                />
                                </div>
                            ))
                            ) : (
                                <p className='flex items-center'><IoPeople className='mr-2'/>No Volunteers</p>
                            )}
                        </div>
                        {event.attendees.length > 5 && (
                        <span className="ml-2 text-sm">+{event.attendees.length - 5} more</span>
                        )}
                    </p>
                </div>
            </div> */}
            <div className="flex flex-col items-center p-4 border sm:p-6 rounded-xl dark:border-gray-700 hover:bg-gray-300" onClick={toggleSidebar}> 
                <img
                    className="object-cover w-72 rounded-xl aspect-square"
                    src={event.img}
                    alt=""
                />

                <div>
                    {isOwner && (
                        <div className='absolute top-7 right-7 '>
                            <Link to={`/event/manage/${event._id}`}><MdManageAccounts className='rounded-t-lg border-b bg-gray-600 text-white hover:bg-white hover:text-black p-1 text-4xl' /></Link>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDeletePopupOpen(true); // Open popup on click
                                }}
                                >
                                <MdDelete className="rounded-b-lg bg-gray-600 text-white hover:bg-white hover:text-red-600 p-1 text-4xl" />
                            </button>
                            <Popup isOpen={isDeletePopupOpen} onClose={() => setDeletePopupOpen(false)}>
                                <h2 className="text-lg font-semibold mb-1">Confirm Deletion</h2>
                                <p>Are you sure you want to delete this event?</p>
                                <div className="flex justify-center mt-4">
                                    <button
                                        className="px-4 py-2 bg-gray-300 rounded-md mr-2"
                                        onClick={() => setDeletePopupOpen(false)}
                                    >
                                    Cancel
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-red-600 text-white rounded-md"
                                        onClick={deleteEvent} // Ensure this function deletes the event
                                    >
                                    Delete
                                    </button>
                                </div>
                            </Popup>
                        </div>
                    )}
                </div>

                <h1 class="mt-4 text-2xl font-semibold text-gray-700 capitalize dark:text-black">{event.title}</h1>
                <p className='text-gray-500 items-center flex flex-row'>
                    <div className='w-4 h-4 mr-2'>
                        <img src={event.user.profileImg || "/avatar-placeholder.png"} alt="" />  
                    </div>
                    By {event.user.fullName}
                </p>
                <p className="text-gray-500 flex items-center mt-2">
                    <MdLocationOn className="mr-2" /> {event.location}
                </p>
                <p className="text-gray-500 flex items-center mt-2">
                    <MdDateRange className="mr-2" /> {formatDate(event.startDate)}
                </p>
            </div>

            {/* Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-800 bg-opacity-50 z-10000"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <div
                ref={sidebarRef}
                className={`fixed z-10000 top-0 md:text-start right-0 h-full w-100 w-full bg-secondary rounded-l-3xl shadow-lg transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}
                style={{ maxHeight: '100vh' }}
            >
                <div className="sticky top-0 left-0 w-full h-16 bg-secondary border-b border-b-gray-600 p-4 shadow-md z-30">
                    <button
                        className="text-gray-500 text-2xl ml-3 mr-7 hover:text-white"
                        onClick={toggleSidebar}
                    >
                        &times;
                    </button>
                    <Link to={`/event/${event._id}`} 
                        className="text-white bg-gray-500 rounded-md p-2 hover:text-black hover:bg-white"
                    >
                        Event Page
                    </Link>
                </div>

                <div className='flex justify-center mt-8'>
                    <figure>
                        <img
                            className="w-80 h-80 object-cover rounded-lg"
                            src={event.img}
                            alt={event.title}
                        />
                    </figure>
                </div>
                <div className="p-11">
                    <h2 className="text-5xl text-white font-bold mb-4">{event.title}</h2>
                    <p className='text-gray-300 text-xl items-center flex flex-row mb-6'>
                        <div className='w-5 h-5 mr-2 rounded-full'>
                            <img src={event.user.profileImg || "/avatar-placeholder.png"} alt="" />  
                        </div>
                        {event.user.fullName}
                    </p>
                    <div className='flex flex-col justify-between'>
                        <p className="text-white flex items-center mb-4">
                            <MdDateRange className="mr-2 text-4xl border p-1 border-gray-500 rounded-md" />
                            <a
                                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${formatGoogleCalendarDate(event.startDate, event.endDate)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                            >
                                {formatDate(event.startDate)}
                            </a>
                        </p>
                        <p className="text-white flex items-center mb-2">
                            <MdLocationOn className="mr-2 text-4xl border p-1 border-gray-500 rounded-md" />
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
                            <button className="btn w-full bg-white" onClick={handleJoinEvent} disabled={isJoining || !authUser || !isEventInFuture}>
                                {   
                                    isEventInFuture &&
                                    (isJoining ? <LoadingSpinner size="sm" /> : (isJoined ? <FaCheck /> : "Join"))
                                }
                                {!isEventInFuture && ("Event is Over")}
                            </button>
                        )}   
                        {   
                            isOwner &&
                            <Link className='btn w-full bg-white' to={`/event/manage/${event._id}`}>Manage</Link>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Event;
