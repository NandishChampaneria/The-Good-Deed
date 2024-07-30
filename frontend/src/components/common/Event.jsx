import React, { useState, useRef, useEffect } from 'react';
import { MdLocationOn, MdDateRange, MdAccessTime } from 'react-icons/md'; // Import icons for location, date, and time
import { Link } from 'react-router-dom';

const Event = ({ event }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            setSidebarOpen(false);
        }
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
                        <MdDateRange className="mr-2" /> {event.startDate}
                    </p>
                    <p className="text-gray-500 flex items-center mt-1">
                        <MdAccessTime className="mr-2" /> {event.startDate} - {event.endDate.toDateString()}
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
                            <MdDateRange className="mr-2" /> {event.startDate}
                        </p>
                    </div>
                    <div className="card-actions justify-center mt-4 mb-5">
                        <button className="btn w-full btn-primary">Join</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Event;
