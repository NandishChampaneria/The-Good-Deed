import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import {MdAdd} from "react-icons/md";
import { BsMoonStars } from "react-icons/bs";
import { IoLogOut, IoSettingsSharp } from "react-icons/io5";
import { GoArrowUpRight } from "react-icons/go";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {toast} from "react-hot-toast";


const Navbar = () => {
    const{data:authUser, error, isPending} = useQuery({queryKey: ["authUser"]});
    const [scrolled, setScrolled] = useState(false);

    const queryClient = useQueryClient();
    const navigate = useNavigate();

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
            const isScrolled = window.scrollY > 30;
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

    return (
        <div className={`navbar bg-base-100 z-10000 sticky top-0 ${scrolled ? 'scrolled' : ''}`}>
            <div className="navbar-start">
                {!authUser && (
                    <Link to="/discover" className="btn btn-ghost">Explore<GoArrowUpRight className='w-5 h-5'/></Link>
                )}
                {authUser && (
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h7" />
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content  bg-gray-300 bg-opacity-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                            <li onClick={closeDropdown}><Link to="/home">Events</Link></li>
                            <li onClick={closeDropdown}><Link to="/discover">Discover</Link></li>
                            {/* <li onClick={closeDropdown}><Link to="/about">About</Link></li> */}
                        </ul>
                        
                    </div>
                )}
                <Link to="/" className="btn btn-ghost text-xl title-hidden">TGD</Link>
            </div>
            <div className="navbar-center">
                <Link to="/home" className="btn btn-ghost text-xl title-block">The Good Deed</Link>
            </div>
            <div className="navbar-end">
                {authUser && (
                    <div className="responsive-content">
                        <Link to="/createevent" className="btn-ce hover:bg-black bg-white text-black hover:text-white">Create Event</Link>
                        <MdAdd className="svg-icon-ce" />
                    </div>
                )}
                {/* <button className="btn btn-ghost btn-circle">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button> */}
                {authUser && (
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="absolute right-0 dropdown-content bg-gray-300 bg-opacity-100 rounded-box z-[1] mt-3 w-64 sm:w-64 md:w-72 lg:w-80 p-4 shadow h-80">
                            <div onClick={closeDropdown} className='flex justify-center p-10 flex-col'>
                                <div className='flex justify-center mb-7'>   
                                    <BsMoonStars className='text-5xl text-gray-400'/>
                                </div>
                                <h3 className='flex justify-center text-xl font-bold mb-3'>It's Quite in Here</h3>
                                <p className='flex justify-center text-center text-gray-500'>You’re all caught up with your good deeds!</p>
                            </div>
                        </ul>
                    </div>
                )}
                {!authUser && (
                    <div className="">
                        <Link to="/login" className="btn bg-transparent shadow-none border-none ">Sign In</Link>
                    </div>
                )}
                {authUser && (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img
                                    alt="Profile"
                                    src={authUser.profileImg || "/avatar-placeholder.png"} />
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content  bg-gray-300 bg-opacity-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                            <li onClick={closeDropdown}>
                                <Link to={`/profile/${authUser.username}`} className="justify-between text-2xl text-blue-400">
                                    {authUser.fullName}
                                </Link>
                            </li>
                            <li onClick={closeDropdown}><Link to={`/profile/settings/${authUser.username}`}><IoSettingsSharp />Settings</Link></li>
                            <li className='hover:text-red-600' onClick={(e)=>{e.preventDefault();logout()}}><a><IoLogOut />Sign Out</a></li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Navbar;
