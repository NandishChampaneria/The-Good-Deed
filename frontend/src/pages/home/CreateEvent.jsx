import React, { useState } from 'react';
import { MdLocationOn, MdDateRange, MdAccessTime } from 'react-icons/md'; // Import icons for location, date, and time

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
    const [imgPreview, setImgPreview] = useState('/posts/post1.png'); // Replace with default image path

    const handleImgChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImg(file);
            setImgPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission
        console.log({
            title,
            description,
            location,
            startDateDefault: startDate,
            endDateDefault: endDate,
            img,
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className=" shadow-lg rounded-lg p-6 flex flex-col lg:flex-row items-center lg:items-start">
                {/* Image Section */}
                <div className="w-80 h-80 object-cover mb-20">
                    <img
                        src={imgPreview}
                        alt="Event"
                        className="w-full h-full object-cover rounded-lg"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImgChange}
                        className="mt-4 w-full"
                    />
                </div>

                {/* Details Section */}
                <div className="w-full lg:w-2/3 lg:pl-6">
                    <form onSubmit={handleSubmit}>
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
                            <div className="flex items-center bg-custom rounded-lg p-3">
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
                        <div className="mb-4">
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
                            type="submit"
                            className="btn btn-primary w-full py-3 mt-4"
                        >
                            Create Event
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateEvent;
