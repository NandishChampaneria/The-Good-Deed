import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Events from "../../components/common/Events";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";

import {formatMemberSinceDate} from "../../utils/date"

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useQueries, useQuery } from "@tanstack/react-query";

const ProfilePage = () => {

	const [profileImg, setProfileImg] = useState(null);
	const [feedType, setFeedType] = useState("events");

	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

	const profileImgRef = useRef(null);

	const { username } = useParams();

	const { data:user, isLoading, refetch, isRefetching } = useQuery({
		queryKey: ["userProfile"],
        queryFn: async () => {
            try {
                const res = await fetch(`/api/users/profile/${username}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to fetch user");
                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
	});
	const memberSinceDate = formatMemberSinceDate(user?.createdAt)

	const handleImgChange = (e, state) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				state === "profileImg" && setProfileImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	useEffect(() => {
		refetch()
	}, [username, refetch]);

	

	return (
		<>
			<div className='flex-[4_4_0] min-h-screen '>
				{/* HEADER */}
				{(isLoading || isRefetching) && <ProfileHeaderSkeleton />}
				{!isLoading && !isRefetching && !user && <p className='text-center text-lg mt-4'>User not found</p>}
				<div className='flex flex-col'>
					{!isLoading && !isRefetching && user && (
						<>
							<div className="flex justify-start sm:justify-center mb-10 gap-5 px-6 flex-col sm:flex-row">
								<div className='relative group/cover mt-16'>
									{/* USER AVATAR */}
									<div className='avatar flex'>
										<div className='w-24 sm:w-32 rounded-full relative group/avatar'>
											<img src={profileImg || user?.profileImg || "/avatar-placeholder.png"} />
										</div>
									</div>
								</div>
								<div className='flex justify-start sm:justify-center mt-1 pl-1'>
									<div className='flex justify-center flex-col gap-2'>
										<span className='font-bold text-2xl'>{user?.fullName}</span>
										<div className="flex flex-row gap-5">
											<span className='text-sm text-slate-500'>@{user?.username}</span>
											<div className='flex gap-2 items-center'>
												<IoCalendarOutline className='w-4 h-4 text-slate-500' />
												<span className='text-sm text-slate-500'>{memberSinceDate}</span>
											</div>
										</div>
										{user?.link && (
											<div className='flex gap-1 items-center '>
												<>
													<FaLink className='w-3 h-3 text-slate-500' />
													<a
														href='https://youtube.com/@asaprogrammer_'
														target='_blank'
														rel='noreferrer'
														className='text-sm text-blue-500 hover:underline'
													>
														{user?.link}
													</a>
												</>
											</div>
										)}
										{/* <span className='text-sm my-1'>{user?.bio}</span> */}
									</div>
								</div>
							</div>
							{/* <div className='flex w-full border-b border-gray-700 mt-4'>
								<div
									className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer'
									onClick={() => setFeedType("events")}
								>
									Events
									{feedType === "events" && (
										<div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
									)}
								</div>
								<div
									className='flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer'
									onClick={() => setFeedType("joined")}
								>
									Joined
									{feedType === "joined" && (
										<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary' />
									)}
								</div>
							</div> */}
							<div className="join flex justify-center w-full">
								<input className="join-item btn w-32 sm:w-48 lg:w-60" type="radio" name="options" aria-label="My Events" defaultChecked onClick={() => setFeedType("events")} />
								{feedType === "events"}
							
								<input className="join-item btn w-32 sm:w-48 lg:w-60" type="radio" name="options" aria-label="Joined Events" onClick={() => setFeedType("joined")} />
								{feedType === "joined"}
							</div>
						</>
					)}

					<Events feedType={feedType} username={username} userId={user?._id} />
				</div>
			</div>
		</>
	);
};
export default ProfilePage;