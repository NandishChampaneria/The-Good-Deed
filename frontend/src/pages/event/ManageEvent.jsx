import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react'
import { MdDateRange, MdLocationOn } from 'react-icons/md';
import { FaUsersSlash } from "react-icons/fa";
import { Link, useParams } from 'react-router-dom';
import toast from'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CiImageOn } from 'react-icons/ci';
import { FaCheck } from 'react-icons/fa';
import Popup from '../../components/common/Popup';
import { useNavigate } from 'react-router-dom';

const ManageEvent = () => {
    const { eventId } = useParams();
    const queryClient = useQueryClient();
    const [feedType, setFeedType] = useState("overview");
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);
    const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
    const [coverImg, setCoverImg] = useState(null);
    const navigate = useNavigate();

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
            setDeletePopupOpen(false); 
            navigate('/');
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

    const isMyEvent = authUser._id === event?.user._id;

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

    return ( 
        <div>
            {isMyEvent && (
                <div>     
                    <div className="join flex justify-center w-full">
                        <input className="join-item btn w-32 sm:w-36 md:w-44 lg:w-60" type="radio" name="options" aria-label="Overview" defaultChecked onClick={() => setFeedType("overview")} />
                    
                        <input className="join-item btn w-32 sm:w-36 md:w-44 lg:w-60" type="radio" name="options" aria-label="Guest List" onClick={() => setFeedType("guestlist")} />
                        
                    </div>
                    {feedType === "overview" && (
                        <div>
                            <div className="p-2 max-w-4xl mx-auto">
                                <div className="card lg:card-side bg-transparent">
                                    <div className='flex flex-col items-center sm:p-4 px-0 py-4 lg:items-start gap-10'>
                                        <figure className='relative max-w-xs'>
                                            <img
                                                className="w-full h-full object-cover rounded-[1rem]"
                                                src={coverImg || event?.img}
                                                alt={event?.title}
                                            />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                hidden
                                                ref={coverImgRef}
                                                onChange={(e) => handleImageChange(e, "coverImg")}
                                            />
                                            {(!coverImg && !isUpdatingImage) && (
                                                <button
                                                    className=""
                                                    onClick={() => coverImgRef.current.click()}
                                                >
                                                    {isUpdatingImage ? <LoadingSpinner size='sm'/> : <CiImageOn className='absolute bottom-2 right-2 w-10 h-10 bg-white text-black rounded-full p-1 cursor-pointer hover:bg-black hover:text-white'/>}
                                                </button>
                                            )}
                                            {coverImg && (
                                                <button
                                                    className=""
                                                    onClick={async () => {
                                                        await updateEventImage(coverImg);
                                                        setCoverImg(null);
                                                    }}
                                                >
                                                    {isUpdatingImage ? <LoadingSpinner size='sm'/> : <FaCheck className='absolute bottom-2 right-2 w-10 h-10 bg-white text-black rounded-full p-1 cursor-pointer hover:bg-black hover:text-white' />}
                                                </button>
                                            )}
                                        </figure>
                                    </div>
                                    <div className="card-body px-0 py-2 sm:p-2">
                                        <h2 className="card-title text-6xl sm:text-7xl text-black font-bold mb-3 break-all">{event?.title}</h2>
                                        <div className='flex text-black text-2xl sm:text-3xl items-center mt-3 mb-3'>
                                            <div className='w-9 h-9 mr-2'>
                                                <img src={event.user.profileImg || "/avatar-placeholder.png"} alt="" className='rounded-full' />  
                                            </div>
                                            {event.user.fullName}
                                        </div>
                                        <p className="flex text-black flex-col gap-5">
                                            <div className='flex items-center flex-row'>
                                                <MdDateRange className="mr-2 border-2 p-1 border-gray-700 rounded-md text-4xl" />
                                                {formatDate(event.startDate)}
                                            </div>
                                            <div className='flex items-center flex-row'>
                                                <MdLocationOn className="mr-2 border-2 px-1 border-gray-700 rounded-md text-4xl" /> 
                                                {event?.location}
                                            </div>
                                        </p>
                                        <div className='flex gap-2 justify-between'>
                                            <div className='mb-2 mt-3 lg:mt-0 w-full'>
                                                <button onClick={toggleSidebar} className="btn w-full bg-black text-accent hover:text-black hover:bg-white border-none">Edit Event</button>
                                            </div>
                                            <div className='mb-2 mt-3 lg:mt-0 w-full'>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDeletePopupOpen(true); // Open popup on click
                                                        }} 
                                                    className='btn w-full border-none bg-red-600 text-white hover:bg-red-500'>
                                                        Delete Event
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
                                                            onClick={deleteEvent} // Ensure this function deletes the event
                                                        >
                                                        Delete
                                                        </button>
                                                    </div>
                                                </Popup>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className='justify-center m-10 gap-10'>
                                    {(!coverImg && !isUpdatingImage) && (
                                        <button onClick={() => coverImgRef.current.click()} className="btn bg-gray-700 text-white hover:bg-white hover:text-black w-36 rounded-lg text-sm md:w-80">{isUpdatingImage ? <LoadingSpinner size='sm'/> : "Change Photo"}</button>
                                    )}
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
                                    
                                </div> */}
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
                                className={`fixed z-10000 top-0 md:text-start right-0 h-full w-100 w-full bg-gradient-to-r from-purple-300 to-secondary rounded-l-3xl shadow-lg transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}
                            >
                                <div className="sticky top-0 left-0 w-full h-16 bg-gradient-to-r from-purple-300 to-secondary p-4 z-30">
                                    <button
                                        className="text-accent text-2xl font-semibold ml-3 mr-7 hover:text-black"
                                        onClick={toggleSidebar}
                                    >
                                        &times;
                                    </button>
                                </div>
                                <form onSubmit={handleFormSubmit}>
                                    <div className="px-11 relative">
                                        <h2 className="text-5xl text-black font-bold mb-2">Title</h2>
                                        <input
                                            type='text'
                                            placeholder={event?.title}
                                            className='input border-none text-xl text-black bg-white focus:outline-none rounded p-2 input-md w-full mb-10'
                                            value={formData.title}
                                            name='title'
                                            onChange={handleInputChange}
                                        />
                                        <h2 className="text-3xl text-black font-bold mb-2">Description</h2>
                                        <textarea
                                            type='text'
                                            placeholder={event?.description}
                                            className='input border-none text-black bg-white focus:outline-none rounded p-2 input-md w-full mb-5 h-16'
                                            value={formData.description}
                                            name='description'
                                            onChange={handleInputChange}
                                        />
                                        <h2 className="text-3xl text-black font-bold mb-2">Date and Time</h2>
                                        <p className='mb-1 text-black'>Start</p>
                                        <input
                                            type='datetime-local'
                                            placeholder={event?.startDate}
                                            className=' input border-none rounded p-2 input-md w-full text-black bg-white focus:outline-none mb-2'
                                            value={formData.startDate}
                                            name='startDate'
                                            onChange={handleInputChange}
                                        />
                                        <p className='mb-1 text-black'>End</p>
                                        <input
                                            type='datetime-local'
                                            placeholder={event?.endDate}
                                            className=' input border-none rounded p-2 input-md w-full text-black bg-white focus:outline-none mb-5'
                                            value={formData.endDate}
                                            name='endDate'
                                            onChange={handleInputChange}
                                        />
                                        <h2 className="text-3xl text-black font-bold mb-2">Location</h2>
                                        <input
                                            type='text'
                                            placeholder={event?.location}
                                            className=' input border-none text-black bg-white focus:outline-none rounded p-2 input-md w-full mb-10'
                                            value={formData.location}
                                            name='location'
                                            onChange={handleInputChange}
                                        />
                                        <button type='submit' className='w-full btn hover:bg-white hover:text-black bg-black text-white'>
                                            {isUpdating ? <LoadingSpinner size='sm'/> : "Update"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                    {feedType === "guestlist" && (
                        <div key={event._id} className='flex items-center justify-center'>
                            {event.attendees.length > 0 ? (
                                <div className='m-10 mt-24 flex text-black justify-center flex-col'>   
                                    <div className='sm:text-3xl text-xl'>{event.attendees.length}<span className='text-lg sm:text-2xl'> Guests</span></div>
                                    <progress 
                                        className="progress w-[15rem] sm:w-[36rem] md:w-[42rem] mt-6 h-2 sm:h-3 mb-6 appearance-none bg-secondary [&::-webkit-progress-bar]:bg-secondary [&::-webkit-progress-value]:bg-black [&::-moz-progress-bar]:bg-black"
                                        value={event.attendees.length} 
                                        max="50">
                                    </progress>
                                    {event.attendees.map((attendee) => (
                                        <div key={attendee._id}>
                                            <div className='flex flex-col mb-5'>
                                                <div className='flex flex-row gap-6 items-center'>
                                                    <div className='sm:w-16 sm:h-16 h-10 w-10'>
                                                        <img src={attendee.profileImg || "/avatar-placeholder.png"} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                                    </div>
                                                    <Link to={`/profile/${attendee.username}`} className='text-xl sm:text-3xl'>{attendee.fullName}</Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex justify-center flex-col px-4 text-center gap-1 mt-10 text-accent">
                                    <div className="flex justify-center">
                                        <FaUsersSlash className="text-9xl flex"/>
                                    </div>
                                    <h1 className="flex justify-center font-bold text-3xl">No Attendees</h1>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default ManageEvent