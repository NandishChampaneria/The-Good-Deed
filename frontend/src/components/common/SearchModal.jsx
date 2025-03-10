import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Import Framer Motion components

const SearchModal = ({ isOpen, closeModal }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState({ events: [], organizations: [] });
    const [isSearching, setIsSearching] = useState(false);

    const modalRef = useRef();

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setSearchResults({ events: [], organizations: [] });
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
            console.error('Search error: ', error);
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
            document.body.style.overflow = "hidden"; // Disable scrolling
        } else {
            document.body.style.overflow = "auto"; // Enable scrolling
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, closeModal]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center z-[10001]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                >
                    <motion.div
                        ref={modalRef}
                        className="bg-gradient-to-r from-purple-400 to-cyan-400 p-3 rounded-lg h-[18rem] shadow-lg w-[30rem] mt-10"
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                    >
                        <div>
                            <input
                                type="text"
                                className="input text-2xl bg-transparent placeholder:text-gray-300 text-black border-none focus:outline-none w-full"
                                placeholder="Search events or organizations"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyUp={handleSearch}
                            />
                        </div>
                        <hr className='border-gray-300' />

                        {/* Display Search Results */}
                        <div className="mt-4 px-4 h-[12rem] overflow-y-auto">
                            {isSearching ? (
                                <p>Searching...</p>
                            ) : (
                                <>
                                    {/* Show Events */}
                                    {searchResults.events.length > 0 && (
                                        <div>
                                            <h3 className="text-white text-lg font-semibold">Events</h3>
                                            <ul>
                                                {searchResults.events.map((event) => (
                                                    <li key={event._id} className="hover:bg-white text-white hover:text-black rounded-md">
                                                        <Link
                                                            to={`/event/${event._id}`}
                                                            className="text-2xl p-1 flex flex-row items-center"
                                                            onClick={() => closeModal()}
                                                        >
                                                            <img className="w-10 h-10 mr-2 rounded-md" src={event.img} alt={event.title} />
                                                            <span className='break-all'>{event.title}</span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Show Organizations */}
                                    {searchResults.organizations.length > 0 && (
                                        <div className="mt-4">
                                            <h3 className="text-white text-lg font-semibold">Organizations</h3>
                                            <ul>
                                                {searchResults.organizations.map((org) => (
                                                    <li key={org._id} className="hover:bg-white text-white hover:text-black rounded-md">
                                                        <Link
                                                            to={`/organization/${org._id}`}
                                                            className="text-2xl p-1 flex flex-row items-center"
                                                            onClick={() => closeModal()}
                                                        >
                                                            <img className="w-10 h-10 mr-2 rounded-md" src={org.profileImg} alt={org.fullName} />
                                                            <span className='break-all'>{org.fullName}</span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* No Results Message */}
                                    {searchQuery.trim() && searchResults.events.length === 0 && searchResults.organizations.length === 0 && (
                                        <p className="text-gray-500">No results found.</p>
                                    )}
                                </>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SearchModal;