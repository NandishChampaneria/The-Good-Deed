import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';
import { MdLocationOn } from 'react-icons/md';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { CiImageOn } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import Popup from '../../components/common/Popup';

import ReactQuill from 'react-quill'; 
import 'react-quill/dist/quill.snow.css'; // Import the necessary Quill styles

const defaultImages = [
    'https://res.cloudinary.com/diytnzged/image/upload/v1723141022/retro4_j5u6k2.avif',
    'https://res.cloudinary.com/diytnzged/image/upload/v1741195990/5329555_erydhu.jpg',
    'https://res.cloudinary.com/diytnzged/image/upload/v1741195990/4866645_pdmmhs.jpg',
    'https://res.cloudinary.com/diytnzged/image/upload/v1741195990/v991-a-23-b_soyjsx.jpg'
];


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
    const [imgPreview, setImgPreview] = useState(defaultImages[0]);
    const [showModal, setShowModal] = useState(false);  // State to show/hide modal
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
            setImgPreview(defaultImages[0]);
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
                closeImageModal();
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDescriptionChange = (value) => {
        setDescription(value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        createEvent({ title, description, location, startDate, endDate, img: img || defaultImages[0] });
    };

    const openImageModal = () => {
        setShowModal(true);
    };

    const closeImageModal = () => {
        setShowModal(false);
    };

    const selectImage = (image) => {
        setImg(image);
        setImgPreview(image);
        closeImageModal();
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
                        onClick={openImageModal}
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
                                        className="bg-primary text-center w-28 text-black p-2 rounded-lg cursor-pointer hover:bg-black hover:text-accent focus:outline-none focus:ring-0 select-none"
                                    />
                                    <input
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        onClick={(e) => e.target.showPicker()} 
                                        className="bg-primary text-center w-24 text-black p-2 rounded-lg cursor-pointer ml-2 hover:bg-black hover:text-accent focus:outline-none focus:ring-0 select-none"
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
                                        className="bg-primary text-center w-28 text-black p-2 rounded-lg cursor-pointer hover:bg-black hover:text-accent focus:outline-none focus:ring-0 select-none"
                                    />
                                    <input
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        onClick={(e) => e.target.showPicker()} 
                                        className="bg-primary text-center w-24 text-black p-2 rounded-lg cursor-pointer ml-2 hover:bg-black hover:text-accent focus:outline-none focus:ring-0 select-none"
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
                        <ReactQuill
                            placeholder="Description"
                            value={description}
                            onChange={handleDescriptionChange}
                            className="w-full p-3 bg-transparent h-36 overflow-y-auto text-black outline-none placeholder:text-gray-800 placeholder:font-semibold"
                            required
                        />
                    </div>
                    <button
                        className="btn bg-black text-accent hover:text-black hover:bg-accent border-none w-full py-3"
                    >
                        {isPending ? <LoadingSpinner size='sm'/> : "Create Event"}
                    </button>
                </div>
            </form>

            {/* Image Selection Modal */}
            <Popup isOpen={showModal} onClose={closeImageModal}>
                <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">Choose an Image</h3>
                
                {/* Default Image Selection */}
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                    {defaultImages.map((image, index) => (
                        <div 
                            key={index} 
                            className="relative group cursor-pointer w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-lg overflow-hidden transform transition duration-200 ease-in-out hover:scale-105"
                        >
                            <img
                                src={image}
                                alt={`Default ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg transition-all"
                            />
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity"></div>
                            <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-xl font-semibold">Select</span>
                            </div>
                        </div>
                    ))}
                </div>
                {/* File Upload Section */}
                <div className="text-center mb-4">
                    <label
                        htmlFor="file-upload"
                        className="mt-3 block mx-auto bg-gray-300 hover:bg-gray-400 font-semibold text-black py-2 px-6 rounded-lg cursor-pointer hover:bg-accent-dark transition-all w-full sm:w-auto"
                    >
                        Choose from Device
                    </label>
                    <input
                        type="file"
                        id="file-upload"
                        onChange={handleImgChange}
                        className="hidden"
                    />
                </div>
            </Popup>
        </div>
    );
};

export default CreateEvent;
