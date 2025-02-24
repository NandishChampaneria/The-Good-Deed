import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const SearchModal = ({ isOpen, closeModal }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Reference to the modal to check if click is inside it
    const modalRef = useRef();

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        try {
            const response = await fetch(`/api/search?query=${searchQuery}`);
            if (!response.ok) {
                throw new Error('Search failed');
            }
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            
        } finally {
            setIsSearching(false);
        }
    };

    // Close modal if click is outside the modal
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                closeModal();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, closeModal]);

    return (
        <>
            {isOpen && (
                <div className="fixed px-2 inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-[10001]">
                    <div 
                        ref={modalRef} 
                        className="bg-gradient-to-r from-purple-300 to-secondary p-3 rounded-lg shadow-lg w-[30rem] h-64 transform -translate-y-64 sm:-translate-y-16"
                    >
                        <div>
                            <input
                                type="text"
                                className="input text-2xl bg-transparent placeholder:text-gray-500 text-black border-none focus:outline-none w-full"
                                placeholder="Search events"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyUp={handleSearch}
                            />
                        </div>
                        <hr className='border-gray-400'/>

                        {/* Display Search Results */}
                        <div className="mt-4 px-4 max-h-40 overflow-y-auto"> {/* Add max height and scrollable behavior */}
                            {isSearching ? (
                                <p>Searching...</p>
                            ) : (
                                <ul>
                                    {searchResults.length > 0 ? (
                                        searchResults.map((event) => (
                                            <div key={event._id}>
                                                <li className="hover:bg-white rounded-md">
                                                    <Link 
                                                        to={`/event/${event._id}`} 
                                                        className="text-2xl p-1 flex flex-row items-center text-gray-800"
                                                        onClick={() => closeModal()} // Close the modal when an event is clicked
                                                    >
                                                        <img
                                                            className="w-10 h-10 mr-2 rounded-md"
                                                            src={event.img}
                                                            alt={event.title}
                                                        />
                                                        {event.title}
                                                    </Link>
                                                </li>
                                            </div>
                                        ))
                                    ) : (
                                        <p className='text-gray-500'>No events found</p>
                                    )}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SearchModal;