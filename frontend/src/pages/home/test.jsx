import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import { MdLocationOn, MdDateRange, MdAccessTime } from 'react-icons/md'; // Import icons for location, date, and time
import { toast } from'react-hot-toast';
import { CiImageOn } from "react-icons/ci";


const defaultImage = 'https://res.cloudinary.com/diytnzged/image/upload/v1723141022/retro4_j5u6k2.avif';
const previewImage = 'posts/retro4.png';




const CreateEvent = () => {
    const now = new Date();
    const startDateDefault = new Date(now.getTime() + (5.5 * 60 * 60 * 1000)).toISOString().slice(0, 16); // Current date and time
    const endDateDefault = new Date(now.getTime() + (24 * 60 * 60 * 1000) + (5.5 * 60 * 60 * 1000)).toISOString().slice(0, 16);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [startDate, setStartDate] = useState(startDateDefault);
    const [endDate, setEndDate] = useState(endDateDefault);
    const [img, setImg] = useState(null);
    const [imgPreview, setImgPreview] = useState(previewImage);// Replace with default image path
    const imgRef = useRef(null)

    const{data:authUser} = useQuery({queryKey: ['authUser']});
    const queryClient = useQueryClient();

    const {mutate:createEvent, isPending} = useMutation({
        mutationFn: async ({title, description, location, startDate, endDate, img}) => {
            try {
                const res = await fetch("/api/events/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title, description, location, startDate, endDate, img }),
                })
                const data = await res.json();
                if(!res.ok) throw new Error(data.error || "Failed to create event");
                return data;
            } catch(error) {
                throw new Error(error);
            }
        },
        onSuccess: () => {
            setTitle("");
            setDescription("");
            setLocation("");
            setStartDate("");
            setEndDate("");
            setImg(null);
            toast.success("Event created successfully");
            queryClient.invalidateQueries({queryKey: ["events"]});
        }
    })

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

    const handleSubmit = (event) => {
        event.preventDefault();
        createEvent({title, description, location, startDate, endDate, img: img || defaultImage})
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <form onSubmit={handleSubmit} className=" shadow-lg rounded-lg p-6 flex flex-col lg:flex-row items-center lg:items-center">
                {/* Image Section */}
                <div className="relative w-full sm:w-80 h-80 object-cover mb-56 mx-auto flex justify-center items-center">
                    <img
                        src={imgPreview}
                        alt="Event"
                        className=" max-w-80 max-h-80 object-cover rounded-lg"
                    />
                    <input
                        type='file' 
                        hidden ref={imgRef} 
                        onChange={handleImgChange}
                        className="mt-4 w-full"
                    />
                    <CiImageOn
						className='absolute bottom-2 sm:right-2 w-10 h-10 hover:bg-black hover:text-white cursor-pointer btn-ghost bg-white text-black rounded-full p-1'
						onClick={() => imgRef.current.click()}
					/>
                </div>

                {/* Details Section */}
                <div className="w-full lg:w-2/3 lg:pl-6">
                    <div>
                        <div className="mb-4">
                            <input
                                type="text"
                                id="title"
                                placeholder='Event Title'
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full h-16 p-3 bg-transparent font-extrabold rounded-lg ph text-white-800"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <div className="flex items-center bg-custom rounded-lg p-3">
                                <b className='text-gray-500'>Start:&nbsp;&nbsp;&nbsp;</b>
                                <input
                                    type="datetime-local"
                                    placeholder='Start'
                                    id="startDateDefault"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full bg-transparent outline-none"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="flex items-center bg-custom rounded-lg p-3">
                                <b className='text-gray-500'>End:&nbsp;&nbsp;&nbsp;</b>
                                <input
                                    type="datetime-local"
                                    placeholder='End'
                                    id="endDateDefault"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full bg-transparent outline-none"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-4 mt-10">
                            <div className="flex items-center bg-custom rounded-lg p-2">
                                <MdLocationOn className="mr-2 text-3xl text-gray-500" />
                                <input
                                    type="text"
                                    id="location"
                                    placeholder='Location'
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full bg-transparent outline-none"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-4 p-3">
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-3 bg-custom outline-none rounded-lg"
                                rows="4"
                                required
                            />
                        </div>
                        <button
                            className="btn btn-primary w-full py-3 mt-4"
                        >
                            {isPending ? "Creating Event..." : "Create Event"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateEvent;
