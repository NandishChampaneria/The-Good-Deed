import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import {MdAdd} from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {toast} from "react-hot-toast";

const Navbar = () => {
    const{data:authUser, error, isPending} = useQuery({queryKey: ["authUser"]});
    const [scrolled, setScrolled] = useState(false);

    const queryClient = useQueryClient();

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
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <li onClick={closeDropdown}><a>Events</a></li>
                        <li onClick={closeDropdown}><Link to="/discover">Discover</Link></li>
                        <li onClick={closeDropdown}><a>About</a></li>
                    </ul>
                </div>
            </div>
            <div className="navbar-center">
                <Link to="/" className="btn btn-ghost text-xl">The Good Deed</Link>
            </div>
            <div className="navbar-end">
                {authUser && (
                    <div className="responsive-content">
                        <Link to="/createevent" className=" btn-ce">Create Event</Link>
                        <MdAdd className="svg-icon-ce" />
                    </div>
                )}
                <button className="btn btn-ghost btn-circle">
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
                </button>
                <button className="btn btn-ghost btn-circle">
                    <div className="indicator">
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
                        <span className="badge badge-xs badge-primary indicator-item"></span>
                    </div>
                </button>
                {!authUser && (
                    <div className="">
                        <Link to="/login" className="btn">Sign In</Link>
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
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                            <li onClick={closeDropdown}>
                                <Link to={`/profile/${authUser.username}`} className="justify-between text-2xl text-green-500">
                                    {authUser.fullName}
                                </Link>
                            </li>
                            <li onClick={closeDropdown}><a>Settings</a></li>
                            <li onClick={(e)=>{e.preventDefault();logout()}}><a>Logout</a></li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Navbar;
