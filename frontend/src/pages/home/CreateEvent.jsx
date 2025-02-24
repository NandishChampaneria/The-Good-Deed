import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';
import { MdLocationOn } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import { CiImageOn } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';

const defaultImage = 'https://res.cloudinary.com/diytnzged/image/upload/v1723141022/retro4_j5u6k2.avif';


const CreateEvent = () => {
    const now = new Date();
    const startDateDefault = new Date(now.getTime() + (5.5 * 60 * 60 * 1000)).toISOString().slice(0, 16);
    const endDateDefault = new Date(now.getTime() + (24 * 60 * 60 * 1000) + (5.5 * 60 * 60 * 1000)).toISOString().slice(0, 16);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [startDate, setStartDate] = useState(startDateDefault.split("T")[0]);
    const [startTime, setStartTime] = useState(startDateDefault.split("T")[1]); 
    const [endDate, setEndDate] = useState(endDateDefault.split("T")[0]);
    const [endTime, setEndTime] = useState(endDateDefault.split("T")[1]);
    const [img, setImg] = useState(null);
    const [imgPreview, setImgPreview] = useState(defaultImage);
    const imgRef = useRef(null);

    const navigate = useNavigate()

    const queryClient = useQueryClient();
    const { mutate: createEvent, isPending } = useMutation({
        mutationFn: async ({ title, description, location, startDate, endDate, img }) => {
            const res = await fetch("/api/events/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, location, startDate, endDate, img }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to create event");
            return data;
        },
        onSuccess: () => {
            setTitle("");
            setDescription("");
            setLocation("");
            setStartDate(startDateDefault);
            setEndDate(endDateDefault);
            setImg(null);
            setImgPreview(defaultImage);
            toast.success("Event created successfully");
            queryClient.invalidateQueries({ queryKey: ["events"] });
            navigate('/');
        },
    });

    const handleImgChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImg(reader.result);
                setImgPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleStartDateChange = (e) => {
        const newDate = e.target.value;
        setStartDate(newDate);
        setStartDate((prev) => `${newDate}T${startTime}`); // Combine with time
    };
    
    const handleStartTimeChange = (e) => {
        const newTime = e.target.value;
        setStartTime(newTime);
        setStartDate((prev) => `${startDate.split("T")[0]}T${newTime}`); // Combine with date
    };
    
    const handleEndDateChange = (e) => {
        const newDate = e.target.value;
        setEndDate(newDate);
        setEndDate((prev) => `${newDate}T${endTime}`); // Combine with time
    };
    
    const handleEndTimeChange = (e) => {
        const newTime = e.target.value;
        setEndTime(newTime);
        setEndDate((prev) => `${endDate.split("T")[0]}T${newTime}`); // Combine with date
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        createEvent({ title, description, location, startDate, endDate, img: img || defaultImage });
    };

    return (
        <div className="max-w-5xl mx-auto p-2">
            <form onSubmit={handleSubmit} className="rounded-lg p-2 flex flex-col lg:flex-row items-center lg:items-start">
                {/* Image Section */}
                <div className="relative w-full max-w-xs aspect-square flex justify-center items-center mb-6 lg:mb-0">
                    <img
                        src={imgPreview}
                        alt="Event"
                        className="w-full h-full object-cover rounded-[1rem]"
                    />
                    <input
                        type="file"
                        hidden
                        ref={imgRef}
                        onChange={handleImgChange}
                    />
                    <CiImageOn
                        className="absolute bottom-2 right-2 w-10 h-10 bg-white text-black rounded-[1.75rem] p-1 cursor-pointer hover:bg-black hover:text-white"
                        onClick={() => imgRef.current.click()}
                    />
                </div>

                {/* Details Section */}
                <div className="w-ful lg:w-2/3 lg:pl-6">
                    <input
                        type="text"
                        placeholder="Event Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full h-20 placeholder:text-base-200 text-black bg-transparent font-semibold ph text-3xl sm:text-6xl rounded-lg text-white-800 mb-4"
                        required
                    />
                    <div className="bg-secondary text-black p-2 rounded-lg w-full mb-4">
                        <div className="flex flex-col gap-2">
                            {/* Start Date & Time */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="w-16 font-semibold ml-2 text-gray-800">Start</span>
                                </div>
                                <div>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        onClick={(e) => e.target.showPicker()} 
                                        className="bg-primary w-28 text-black p-2 rounded-lg cursor-pointer hover:bg-black hover:text-accent focus:outline-none focus:ring-0 select-none"
                                    />
                                    <input
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        onClick={(e) => e.target.showPicker()} 
                                        className="bg-primary w-24 text-black p-2 rounded-lg cursor-pointer ml-2 hover:bg-black hover:text-accent focus:outline-none focus:ring-0 select-none"
                                    />
                                </div>
                            </div>

                            {/* End Date & Time */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="w-16 font-semibold text-gray-800 ml-2">End</span>
                                </div>
                                <div>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        onClick={(e) => e.target.showPicker()} 
                                        className="bg-primary w-28 text-black p-2 rounded-lg cursor-pointer hover:bg-black hover:text-accent focus:outline-none focus:ring-0 select-none"
                                    />
                                    <input
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        onClick={(e) => e.target.showPicker()} 
                                        className="bg-primary w-24 text-black p-2 rounded-lg cursor-pointer ml-2 hover:bg-black hover:text-accent focus:outline-none focus:ring-0 select-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mb-4 flex items-center bg-secondary rounded-lg p-2">
                        <MdLocationOn className="mr-2 text-3xl text-gray-800" />
                        <input
                            type="text"
                            placeholder="Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full bg-transparent outline-none text-black placeholder:text-gray-800 placeholder:font-semibold"
                            required
                        />
                    </div>
                    <div className="mb-4 flex items-center bg-secondary rounded-lg p-2">
                        
                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-3 bg-transparent text-black outline-none placeholder:text-gray-800 placeholder:font-semibold"
                            rows="4"
                            required
                        />
                    </div>
                    <button
                        className="btn bg-black text-accent hover:text-black hover:bg-accent border-none w-full py-3"
                    >
                        {isPending ? "Creating Event..." : "Create Event"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateEvent;
