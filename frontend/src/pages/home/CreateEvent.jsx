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
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="card p-6 lg:p-8 flex flex-col lg:flex-row items-center lg:items-start gap-8">
                {/* Image Section */}
                <div className="relative w-full max-w-xs aspect-square group">
                    <img
                        src={imgPreview}
                        alt="Event"
                        className="w-full h-full object-cover rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <CiImageOn
                            className="w-12 h-12 text-white cursor-pointer hover:scale-110 transition-transform duration-300"
                            onClick={openImageModal}
                        />
                    </div>
                    <input
                        type="file"
                        hidden
                        ref={imgRef}
                        onChange={handleImgChange}
                    />
                </div>

                {/* Details Section */}
                <div className="w-full lg:w-2/3 space-y-6">
                    <input
                        type="text"
                        placeholder="Event Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="input w-full text-3xl sm:text-4xl font-bold placeholder:text-white/50"
                        required
                    />
                    
                    <div className="card p-4 space-y-4">
                        <div className="flex flex-col gap-4">
                            {/* Start Date & Time */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-semibold text-white">Start</span>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        onClick={(e) => e.target.showPicker()} 
                                        className="input w-32 text-center cursor-pointer hover:bg-white/20"
                                    />
                                    <input
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        onClick={(e) => e.target.showPicker()} 
                                        className="input w-28 text-center cursor-pointer hover:bg-white/20"
                                    />
                                </div>
                            </div>

                            {/* End Date & Time */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-semibold text-white">End</span>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        onClick={(e) => e.target.showPicker()} 
                                        className="input w-32 text-center cursor-pointer hover:bg-white/20"
                                    />
                                    <input
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        onClick={(e) => e.target.showPicker()} 
                                        className="input w-28 text-center cursor-pointer hover:bg-white/20"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card p-4 flex items-center gap-3">
                        <MdLocationOn className="text-2xl text-white" />
                        <input
                            type="text"
                            placeholder="Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="input flex-1"
                            required
                        />
                    </div>

                    <div className="card p-4">
                        <ReactQuill
                            placeholder="Description"
                            value={description}
                            onChange={handleDescriptionChange}
                            className="w-full h-36 overflow-y-auto text-white outline-none placeholder:text-white/50"
                            required
                        />
                    </div>

                    <button
                        className="btn w-full flex items-center justify-center gap-2"
                    >
                        {isPending ? (
                            <>
                                <LoadingSpinner size='sm'/>
                                <span>Creating Event...</span>
                            </>
                        ) : (
                            "Create Event"
                        )}
                    </button>
                </div>
            </form>

            {/* Image Selection Modal */}
            <Popup isOpen={showModal} onClose={closeImageModal}>
                <div className="modal p-6 max-w-2xl w-full mx-4">
                    <h3 className="text-2xl font-bold text-center mb-6 text-white">Choose an Image</h3>
                    
                    {/* Default Image Selection */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                        {defaultImages.map((image, index) => (
                            <div 
                                key={index} 
                                className="relative group cursor-pointer aspect-square rounded-xl overflow-hidden"
                            >
                                <img
                                    src={image}
                                    alt={`Default ${index + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <span className="text-white font-semibold">Select</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* File Upload Section */}
                    <div className="text-center">
                        <label
                            htmlFor="file-upload"
                            className="btn w-full sm:w-auto cursor-pointer"
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
                </div>
            </Popup>
        </div>
    );
};

export default CreateEvent;
