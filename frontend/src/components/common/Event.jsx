import React, { useState, useRef, useEffect } from 'react';
import { MdLocationOn, MdDateRange } from 'react-icons/md'; // Import icons for location, date, and time
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaCheck } from 'react-icons/fa';

import LoadingSpinner from './LoadingSpinner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const Event = ({ event }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const { data: authUser } = useQuery({ queryKey: ["authUser"], enabled: true });
    const queryClient = useQueryClient();
    const sidebarRef = useRef(null);
    const isJoined = authUser ? authUser.joinedEvents.includes(event._id) : false;

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

    return (
        <div className="relative">
            <div className="card lg:card-side bg-base-100 shadow-xl p-2">
                <figure>
                    <img
                        className="w-72 h-72 object-cover"
                        src={event.img}
                        alt="Album"
                    />
                </figure>
                <div className="card-body">
                    <h2 className="card-title text-2xl font-bold">{event.title}</h2>
                    <p className="text-gray-500 flex items-center mt-2">
                        <MdLocationOn className="mr-2" /> {event.location}
                    </p>
                    <p className="text-gray-500 flex items-center mt-2">
                        <MdDateRange className="mr-2" /> {formatDate(event.startDate)}
                    </p>

                    <div className="card-actions justify-end mt-4">
                        <button
                            className="btn btn-primary"
                            onClick={toggleSidebar}
                        >
                            See Details
                        </button>
                    </div>
                </div>
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
                className={`fixed z-10000 top-0 right-0 h-full w-100 bg-black shadow-lg transform transition-transform duration-300 z-20 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <button
                    className="absolute top-4 right-4 text-gray-500"
                    onClick={toggleSidebar}
                >
                    &times;
                </button>
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
                    <h2 className="text-5xl font-bold mb-6"><Link to={`/event/${event._id}`}>{event.title}</Link></h2>
                    <div className='mb-6'>
                        <p className="text-white-800 mt-3">{event.user.fullName}</p>
                    </div>
                    <div className='flex justify-between'>
                        <p className="text-gray-500 flex items-center mb-2">
                            <MdLocationOn className="mr-2" /> {event.location}
                        </p>
                        <p className="text-gray-500 flex items-center mb-2">
                            <MdDateRange className="mr-2" /> {formatDate(event.startDate)}
                        </p>
                    </div>
                    <div className="card-actions justify-center mt-4 mb-5">
                        <button className="btn w-full btn-primary" onClick={handleJoinEvent} disabled={isJoining || !authUser}>
                            {isJoining ? <LoadingSpinner size="sm" /> : (isJoined ? <FaCheck /> : "Join")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Event;
