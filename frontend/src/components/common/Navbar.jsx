import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import {MdAdd, MdOutlineNotifications } from "react-icons/md";
import { MdOutlineSearch } from "react-icons/md";
import { BsMoonStars } from "react-icons/bs";
import { IoLogOut, IoSettingsSharp } from "react-icons/io5";
import { LuMenu } from "react-icons/lu";
import { GoArrowUpRight } from "react-icons/go";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {toast} from "react-hot-toast";
import SearchModal from './SearchModal';

const Navbar = () => {
    const{data:authUser, error, isPending} = useQuery({queryKey: ["authUser"]});
    const [scrolled, setScrolled] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const queryClient = useQueryClient();
    const navigate = useNavigate();


    const { data: notifications, isLoading } = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const res = await fetch("/api/notifications");
            if (!res.ok) throw new Error("Failed to fetch notifications");
            return res.json();
        },
        enabled: !!authUser, // Only fetch when user is authenticated
    });

    const { mutate: deleteNotifications } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch("/api/notifications", {
                    method: "DELETE",
                });
                const data = await res.json();

                if(!res.ok) {
                    throw new Error(data.error || "Failed to delete notifications");
                }
            } catch(error) {
                throw new Error(error);
            }
        },
        onSuccess: () => {
            toast.success("Notifications deleted successfully");
            queryClient.invalidateQueries({queryKey: ["notifications"]});
        },
        onError: () => {
            toast.error("Failed to delete notifications");
        }
    });

    const{mutate:logout} = useMutation({
        mutationFn: async() => {
            try {
                const res = await fetch("/api/auth/logout", {
                    method: "POST",
                });
                const data = await res.json();

                if(!res.ok) {
                    throw new Error(data.error || "Failed to log out");
                }
            } catch(error) {
                throw new Error(error);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["authUser"]});
            navigate("/");
        },
        onError: () => {
            toast.error("Failed to log out");
        }
    })

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 5;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const closeDropdown = (e) => {
        if (e.target.tabIndex === 0) {
            e.target.blur(); // Removes focus to close the dropdown
        }
    };

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        // Cleanup on component unmount
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isModalOpen]);


    return (
        <>
            <SearchModal isOpen={isModalOpen} closeModal={closeModal} />
            <div className={`navbar bg-transparent z-10000 sticky top-0 ${scrolled ? 'bg-opacity-50 backdrop-blur-md bg-gray-900' : 'bg-transparent'}`}>
                <div className="navbar-start">
                    {!authUser && (
                        <Link to="/discover" className="btn text-accent hover:text-black hover:bg-transparent btn-ghost">Explore<GoArrowUpRight className='w-5 h-5'/></Link>
                    )}
                    {authUser && (
                        <div className="dropdown">
                            <div tabIndex={0} role="button" className="btn hover:text-black hover:bg-transparent text-accent btn-ghost btn-circle">
                                <LuMenu className='text-2xl'/>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content text-gray-600 bg-accent bg-opacity-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                                <li className='hover:text-black' onClick={closeDropdown}><Link to="/home">My Events</Link></li>
                                <li className='hover:text-black' onClick={closeDropdown}><Link to="/discover">Discover</Link></li>
                                {/* <li onClick={closeDropdown}><Link to="/about">About</Link></li> */}
                            </ul>
                            
                        </div>
                    )}
                    <Link to="/discover" className="btn text-accent hover:text-black hover:bg-transparent btn-ghost text-xl title-hidden">TGD</Link>
                </div>
                <div className="navbar-center">
                    <Link to="/discover" className="btn text-accent hover:text-black hover:bg-transparent btn-ghost text-xl title-block">The Good Deed</Link>
                </div>
                <div className="navbar-end"> 
                    {authUser && (
                        <div className="responsive-content">
                            <Link to="/createevent" className="btn-ce hover:bg-accent bg-black text-accent hover:text-black">Create Event</Link>
                            <Link to="/createevent" ><MdAdd className="svg-icon-ce text-accent hover:text-black hover:bg-transparent" /></Link>
                        </div>
                    )}
                    <button onClick={openModal} className="btn hover:text-black hover:bg-transparent text-accent btn-ghost btn-circle">
                        <MdOutlineSearch className='text-2xl' />
                    </button>
                    
                    {authUser && (
                        <div>
                            <div className="dropdown hidden sm:block">
                                <div tabIndex={0} role="button" className="btn hover:text-black hover:bg-transparent text-accent btn-ghost btn-circle">
                                    <MdOutlineNotifications className='text-2xl'/>
                                </div>
                                <ul
                                    tabIndex={0}
                                    className="absolute right-0 dropdown-content bg-accent  rounded-box z-[1] mt-3 w-80  shadow h-80">
                                    {isLoading ? (
                                        <div className="flex justify-center items-center h-full">
                                            <p>Loading...</p>
                                        </div>
                                    ) : notifications?.length === 0 ? (
                                        <div className="flex justify-center p-12 flex-col text-white">
                                            <div className="flex justify-center mb-7">
                                                <BsMoonStars className="text-5xl text-black" />
                                            </div>
                                            <h3 className="flex justify-center text-xl font-bold text-black mb-3">No new notifications</h3>
                                            <p className="flex justify-center text-center text-gray-400">You’re all caught up with your good deeds!</p>
                                        </div>
                                    ) : (
                                        <ul className="h-full overflow-y-auto relative">
                                            {notifications.map((notif) => (
                                                <li key={notif._id} className="p-2  border-white">
                                                    <Link to={`/event/${notif.event?._id}`} className="block hover:bg-gray-200 text-black hover:text-black p-2 rounded-xl">
                                                        <div className="flex items-center justify-between ">
                                                            <div className="flex items-center">
                                                                <img src={notif.from?.profileImg || "/default-avatar.png"} alt="User" className="w-8 h-8 rounded-full mr-2" />
                                                                <p className="text-sm">
                                                                    <span className="font-semibold">{notif.from?.fullName}</span> joined <span className="font-semibold">{notif.event?.title}</span>
                                                                </p>
                                                            </div>
                                                            <img src={notif.event?.img || "/default-event.png"} alt="Event" className="w-8 h-8 rounded-md ml-auto" />
                                                        </div>
                                                        <span className="text-xs text-gray-800">{new Date(notif.createdAt).toLocaleString()}</span>
                                                    </Link>
                                                </li>
                                            ))}
                                                <button onClick={deleteNotifications} className="text-sm w-full font-semibold cursor-pointer rounded-b-box bg-base-200 hover:text-black text-base-content p-2 text-center shadow-md fixed bottom-0">
                                                    Clear all
                                                </button>
                                        </ul>                
                                    )}
                                </ul>
                            </div>

                            <div className="block sm:hidden">
                            <Link to="/notifications" className="btn text-accent hover:text-black hover:bg-transparent btn-ghost btn-circle">
                                <MdOutlineNotifications className="text-2xl" />
                            </Link>
                            </div>
                        </div>
                    )}
                    {!authUser && (
                        <div className="">
                            <Link to="/login" className="btn bg-transparent text-accent hover:text-black hover:bg-transparent shadow-none border-none ">Sign In</Link>
                        </div>
                    )}
                    {authUser && (
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn hover:bg-black btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="Profile"
                                        src={authUser.profileImg || "/avatar-placeholder.png"} />
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-accent bg-opacity-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                                <li onClick={closeDropdown}>
                                    <Link to={`/profile/${authUser.username}`} className="justify-between text-2xl text-black hover:text-cyan-400">
                                        {authUser.fullName}
                                    </Link>
                                </li>
                                <li className='text-gray-600 hover:text-black' onClick={closeDropdown}><Link to={`/profile/settings/${authUser.username}`}><IoSettingsSharp />Settings</Link></li>
                                <li className='text-gray-600 hover:text-red-600' onClick={(e)=>{e.preventDefault();logout()}}><a><IoLogOut />Sign Out</a></li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Navbar;
