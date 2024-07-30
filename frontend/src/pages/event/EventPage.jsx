import React from 'react';
import { useParams } from 'react-router-dom';
import { EVENTS } from '../../utils/db/dummy.js'; // Adjust the import path as needed
import { MdDateRange, MdLocationOn } from 'react-icons/md'; 

const EventPage = () => {
    const { id } = useParams();
    const eventId = parseInt(id, 10); // Convert ID from string to number
    const event = EVENTS.find(event => event._id === eventId);

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
                    <p className=" flex flex-col gap-5">
                        <div className='flex flex-row'>
                            <MdDateRange className="mr-2 text-2xl" /> {event.startDate}
                        </div>
                        <div className='flex flex-row'>
                            <MdLocationOn className="mr-2 text-2xl" /> {event.location}
                        </div>
                    </p>
                    <div className="card-actions mt-4 mb-5">
                        <button className="btn w-full btn-primary">Join</button>
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
