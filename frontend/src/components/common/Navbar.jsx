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

    // Handle Command + K or Ctrl + K to open the modal
    useEffect(() => {
        const handleKeyDown = (event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
                openModal();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    
    return (
        <>
            <SearchModal isOpen={isModalOpen} closeModal={closeModal} />
            <div className={`navbar bg-transparent z-10000 sticky top-0 ${scrolled ? 'bg-opacity-50 backdrop-blur-lg bg-gray-900' : 'bg-transparent'}`}>
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
                    <Link to="/discover" className="btn text-accent hover:text-black hover:bg-transparent btn-ghost text-xl title-block">
                        <svg className="icon" width="2.5rem" height="auto" viewBox="0 0 99 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                fill="white"
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M47.5674 20.906C43.8036 12.9153 29.2915 -3.36983 14.5612 0.61912C-3.67929 5.55863 -13.3543 32.8915 38.8875 77.8884C42.0642 80.6246 46.9312 78.3485 46.9312 74.156V51.5969C46.9312 48.8355 44.6926 46.5969 41.9312 46.5969H37.7603C35.5148 46.5969 33.6945 48.4173 33.6945 50.6628V51.6194C33.6945 53.3366 35.0865 54.7286 36.8037 54.7286C38.5208 54.7286 39.9128 56.1206 39.9128 57.8378V58.0957C39.9128 61.0932 36.3278 62.5675 34.2998 60.3602C21.8612 46.8216 6.85043 26.3994 14.5612 15.027C19.4252 7.85322 30.9413 16.0007 39.4974 25.2659C42.1294 28.116 47.5684 26.582 47.8713 22.7143C47.92 22.0929 47.833 21.4699 47.5674 20.906ZM59.141 78.2532C82.2677 58.6349 112.232 24.3067 90.8995 5.36487C83.7992 0.0332738 62.3929 -6.05039 51.7061 18.0551C51.4375 18.6608 51.3023 19.3337 51.3023 19.9962V74.485C51.3023 78.6188 55.9887 80.9273 59.141 78.2532ZM60.6744 24.2202L60.6743 59.738C60.6664 59.9006 60.6545 60.064 60.6429 60.2239C60.5273 61.8183 60.4366 63.0694 64.4721 59.738C99.3908 30.9117 83.3328 -8.10248 61.6134 21.3404C61.0071 22.1623 60.6744 23.1989 60.6744 24.2202Z"
                            />
                        </svg>
                    </Link>
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
                                                                <img src={notif.from?.profileImg || "/avatar-placeholder.png"} alt="User" className="w-8 h-8 rounded-full mr-2" />
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
