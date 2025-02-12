import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { toast } from 'react-hot-toast';
import { BsMoonStars } from 'react-icons/bs';
import { MdOutlineNotifications } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';

const Notifications = () => {
    const{data:authUser, error, isPending} = useQuery({queryKey: ["authUser"]});


    const queryClient = useQueryClient();

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
    return (
        <div>
            {authUser && (
                <div className='flex items-center justify-center'>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <p>Loading...</p>
                        </div>
                    ) : notifications?.length === 0 ? (
                        <div className="flex justify-center p-12 flex-col text-white">
                            <div className="flex justify-center mb-7">
                                <BsMoonStars className="text-5xl text-gray-400" />
                            </div>
                            <h3 className="flex justify-center text-xl font-bold mb-3">No new notifications</h3>
                            <p className="flex justify-center text-center text-gray-400">You’re all caught up with your good deeds!</p>
                        </div>
                    ) : (
                        <ul className="overflow-y-auto p-4 w-[52rem]">
                            <div className=''>
                                {notifications.map((notif) => (
                                    <li key={notif._id} className="p-2  border-white">
                                        <Link to={`/event/${notif.event?._id}`} className="block hover:bg-black text-black hover:text-white p-2 rounded">
                                            <div className="flex items-center justify-between ">
                                                <div className="flex items-center">
                                                    <img src={notif.from?.profileImg || "/default-avatar.png"} alt="User" className="w-8 h-8 rounded-full mr-2" />
                                                    <p className="text-md">
                                                        <span className="font-semibold">{notif.from?.fullName}</span> joined <span className="font-semibold">{notif.event?.title}</span>
                                                    </p>
                                                </div>
                                                <img src={notif.event?.img || "/default-event.png"} alt="Event" className="w-8 h-8 rounded-md ml-auto" />
                                            </div>
                                            <span className="text-xs text-gray-400">{new Date(notif.createdAt).toLocaleString()}</span>
                                        </Link>
                                    </li>
                                ))}
                                    <button onClick={deleteNotifications} className="text-sm w-full font-semibold cursor-pointer rounded-box bg-gray-700 hover:bg-slate-600 text-white p-2 text-center shadow-md sticky bottom-0">
                                        Clear all
                                    </button>
                            </div>
                        </ul>                
                    )}
                </div>
            )}
        </div>
    )
}

export default Notifications