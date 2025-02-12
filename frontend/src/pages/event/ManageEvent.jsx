import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react'
import { MdDateRange, MdLocationOn } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import toast from'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ManageEvent = () => {
    const { eventId } = useParams();
    const queryClient = useQueryClient();
    const [feedType, setFeedType] = useState("overview");
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);
    const [coverImg, setCoverImg] = useState(null);

    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

    const [formData, setFormData] = useState({
		title: "",
		description: "",
		location: "",
		startDate: "",
		endDate: "",
	});

    const coverImgRef = useRef(null);

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
			toast.success("Event deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["events"] });
		},
	});

    // Fetch event details
    const { data: event, isLoading } = useQuery({
        queryKey: ["event", eventId],
        queryFn: async () => {
            try {
                const res = await fetch(`/api/events/${eventId}`);
                const data = await res.json();
                console.log(data);
                if (!res.ok) throw new Error(data.error || "Failed to fetch event");
                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
    });

    useEffect(() => {
        if (event) {
            setFormData({
                title: event.title,
                description: event.description,
                location: event.location,
                startDate: event.startDate,
                endDate: event.endDate,
            });
        }
    }, [event]);

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

    const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result;
                setCoverImg(base64String); // Ensure this is being set as a base64 string
            };
            reader.readAsDataURL(file);
        }
    };
    
    

    const { mutate: updateEvent, isLoading: isUpdating } = useMutation({
        mutationFn: async (updatedData) => {
            try {
                const res = await fetch(`/api/events/update/${eventId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedData),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to update event");
                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
        onSuccess: (updatedEvent) => {
            toast.success("Event updated successfully!");
            queryClient.invalidateQueries(["event", eventId]);
            setSidebarOpen(false);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const { mutate: updateEventImage, isLoading: isUpdatingImage } = useMutation({
        mutationFn: async (imgFile) => {
            try {
                const res = await fetch(`/api/events/update/${eventId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({img: imgFile})
                });
                const data = await res.json();
                if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
            } catch(error) {
                throw new Error(error.message);
            }
        },
        onSuccess: () => {
            toast.success("Event image updated successfully!");
            queryClient.invalidateQueries(["event", eventId]);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const handleFormSubmit = (e) => {
        e.preventDefault();
        updateEvent(formData);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <div>
            <div className="join flex justify-center w-full">
                <input className="join-item btn w-36 sm:w-60" type="radio" name="options" aria-label="Overview" defaultChecked onClick={() => setFeedType("overview")} />
            
                <input className="join-item btn w-36 sm:w-60" type="radio" name="options" aria-label="Guest List" onClick={() => setFeedType("guestlist")} />
                
            </div>
            {feedType === "overview" && (
                <div>
                    <div className="p-4 max-w-3xl mx-auto  m-10 rounded-lg">
                        <div className="card lg:card-side bg-base-100  p-4">
                            <div className='flex flex-col gap-10'>
                                <figure>
                                    <img
                                        className="w-80 h-80 object-cover rounded-lg"
                                        src={coverImg || event?.img}
                                        alt={event?.title}
                                    />
                                </figure>
                            </div>
                            <div className="card-body">
                                <h2 className="card-title text-7xl font-bold mb-10">{event?.title}</h2>
                                <div className='mb-6 ep1'>
                                    <p className="text-white-800 text-3xl mt-3">{event?.user.fullName}</p>
                                </div>
                                <p className="flex flex-col gap-5">
                                    <div className='flex flex-row'>
                                        <MdDateRange className="mr-2 text-2xl" /> {formatDate(event?.startDate)}
                                    </div>
                                    <div className='flex flex-row'>
                                        <MdLocationOn className="mr-2 text-2xl" /> {event?.location}
                                    </div>
                                </p>
                            </div>
                        </div>
                        <div className='flex justify-center m-10 gap-10'>
                            <button onClick={toggleSidebar} className="btn bg-gray-700 text-white hover:bg-white hover:text-black w-36 rounded-lg text-sm md:w-80">Edit Event</button>
                            {(!coverImg && !isUpdatingImage) && (
                                <button onClick={() => coverImgRef.current.click()} className="btn bg-gray-700 text-white hover:bg-white hover:text-black w-36 rounded-lg text-sm md:w-80">{isUpdatingImage ? <LoadingSpinner size='sm'/> : "Change Photo"}</button>
                            )}
                            
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    hidden
                                    ref={coverImgRef}
                                    onChange={(e) => handleImageChange(e, "coverImg")}
                                />
                                {coverImg && (
                                    <button 
                                        onClick={async () => {
                                            await updateEventImage(coverImg);
                                            setCoverImg(null);
                                        }}
                                        className="btn bg-gray-700 text-white hover:bg-white hover:text-black w-36 rounded-lg text-sm md:w-80"
                                        >
                                        {isUpdatingImage ? <LoadingSpinner size='sm'/> : "Update"}
                                    </button>
                                )}
                            
                        </div>
                        <div className='flex justify-center m-7'>
                            <button onClick={deleteEvent} className='btn w-full bg-red-600 text-white hover:bg-red-500'>Delete Event</button>
                        </div>
                    </div>
                    {/* Overlay */}
                    {isSidebarOpen && (
                        <div
                            className="fixed inset-0 bg-gray-800 bg-opacity-50 z-10000"
                            onClick={toggleSidebar}
                        />
                    )}
                    {/* SIDEBAR */}
                    <div
                        ref={sidebarRef}
                        className={`fixed z-10000 top-0 md:text-start right-0 h-full w-100 bg-gray-900 rounded-3xl shadow-lg transform transition-transform duration-300 z-20 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
                    >
                        <button
                            className="absolute top-4 right-4 text-gray-500"
                            onClick={toggleSidebar}
                        >
                            &times;
                        </button>
                        <form onSubmit={handleFormSubmit}>
                            <div className="p-11 relative">
                                <h2 className="text-3xl font-bold mb-2">Title</h2>
                                <input
                                    type='text'
                                    placeholder={event?.title}
                                    className=' input border border-gray-700 rounded p-2 input-md w-full mb-10'
                                    value={formData.title}
                                    name='title'
                                    onChange={handleInputChange}
							    />
                                <h2 className="text-xl font-bold mb-2">Description</h2>
                                <textarea
                                    type='text'
                                    placeholder={event?.description}
                                    className=' input border border-gray-700 rounded p-2 input-md w-full h-20 mb-10'
                                    value={formData.description}
                                    name='description'
                                    onChange={handleInputChange}
							    />
                                <h2 className="text-xl font-bold mb-2">Date and Time</h2>
                                <p className='mb-1 text-gray-500'>Start</p>
                                <input
                                    type='datetime-local'
                                    placeholder={event?.startDate}
                                    className=' input border border-gray-700 rounded p-2 input-md w-full mb-2'
                                    value={formData.startDate}
                                    name='startDate'
                                    onChange={handleInputChange}
							    />
                                <p className='mb-1 text-gray-500'>End</p>
                                <input
                                    type='datetime-local'
                                    placeholder={event?.endDate}
                                    className=' input border border-gray-700 rounded p-2 input-md w-full mb-10'
                                    value={formData.endDate}
                                    name='endDate'
                                    onChange={handleInputChange}
							    />
                                <h2 className="text-xl font-bold mb-2">Location</h2>
                                <input
                                    type='text'
                                    placeholder={event?.location}
                                    className=' input border border-gray-700 rounded p-2 input-md w-full mb-10'
                                    value={formData.location}
                                    name='location'
                                    onChange={handleInputChange}
							    />
                                <button type='submit' className='w-full btn btn-primary'>
                                    {isUpdating ? <LoadingSpinner size='sm'/> : "Update"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {feedType === "guestlist" && (
                <div key={event._id} className='flex justify-center min-h-screen'>
                    {event.attendees.length > 0 ? (
                        <div className='m-10 mt-24'>
                            <div className='md:w-100 flex flex-col items-center relative'>
                                <div className='absolute left-0 -top-6 mb-2 text-3xl'>{event.attendees.length}<span className='text-sm'> Guests</span></div>
                                <progress className="progress mt-6 h-3 mb-6" value={event.attendees.length} max="100"></progress>
                            </div>
                            {event.attendees.map((attendee) => (
                                <div key={attendee._id}>
                                    <div className='flex flex-col mb-5'>
                                        <div className='flex flex-row gap-8'>
                                            <div className='smm:w-9 smm:h-9 h-6 w-6 rounded-full'>
                                                <img src={attendee.profileImg || "/avatar-placeholder.png"} alt="Profile" className="w-full h-full object-cover" />
                                            </div>
                                            <div className='smm:text-3xl'>{attendee.fullName}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No attendees</p>
                    )}
                </div>
            )}
        </div>
    )
}

export default ManageEvent