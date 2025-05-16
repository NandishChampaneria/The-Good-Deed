import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import Events from "../../components/common/Events";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";

import {formatMemberSinceDate} from "../../utils/date"

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaMapMarkerAlt, FaPhone, FaUserAltSlash } from "react-icons/fa";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

const ProfilePage = () => {
	const [profileImg, setProfileImg] = useState(null);
	const [feedType, setFeedType] = useState("events");
	const [isFollowingState, setIsFollowingState] = useState(false);

	const queryClient = useQueryClient();
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

	// Follow/Unfollow mutation
	const { mutate: followUnfollow } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/api/users/follow/${user.fullName}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Failed to follow/unfollow");
				return data;
			} catch (error) {
				throw new Error(error.message);
			}
		},
		onSuccess: () => {
			// Update the authUser cache
			queryClient.setQueryData(["authUser"], (oldData) => {
				if (!oldData) return oldData;
				
				const isCurrentlyFollowing = oldData.following?.includes(user._id);
				const newFollowing = isCurrentlyFollowing
					? oldData.following.filter(id => id !== user._id)
					: [...(oldData.following || []), user._id];

				return {
					...oldData,
					following: newFollowing
				};
			});

			// Update local state
			setIsFollowingState(!isFollowingState);
			toast.success("Successfully updated follow status");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	// Update isFollowingState when user data changes
	useEffect(() => {
		if (authUser && user) {
			setIsFollowingState(authUser.following?.includes(user._id));
		}
	}, [authUser, user]);

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
				{!isLoading && !isRefetching && !user && (
					<div className="flex justify-center flex-col px-4 text-center gap-10 text-accent">						  
						<div className="flex justify-center">
							<FaUserAltSlash className="text-9xl flex"/>
						</div>
						<h1 className="flex justify-center font-bold text-3xl">No User/Organization Found</h1>
					</div>
				)}

				{/* for individuals */}
				{( user?.userType === "individual" &&
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
											<span className='font-bold text-black text-2xl'>{user?.fullName}</span>
											<div className="flex flex-row gap-5">
												<span className='text-sm text-gray-700'>@{user?.username}</span>
												<div className='flex gap-2 items-center'>
													<IoCalendarOutline className='w-4 h-4 text-gray-600' />
													<span className='text-sm text-gray-700'>{memberSinceDate}</span>
												</div>
											</div>
											<div>
												
											</div>
											{user?.link && (
												<div className='flex gap-1 items-center '>
													<>
														<FaLink className='w-3 h-3 text-gray-700' />
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
										</div>
									</div>
								</div>
								<div className="join flex justify-center w-full">
									<input className="join-item btn w-32 sm:w-48 lg:w-60" type="radio" name="options" aria-label="Created Events" defaultChecked onClick={() => setFeedType("events")} />
									{feedType === "events"}
								
									<input className="join-item btn w-32 sm:w-48 lg:w-60" type="radio" name="options" aria-label="Joined Events" onClick={() => setFeedType("joined")} />
									{feedType === "joined"}
								</div>
							</>
						)}

						<Events feedType={feedType} username={username} userId={user?._id} />
					</div>
				)}

				{/* for organisations */}
				{( user?.userType === "organization" &&
					<div className='flex flex-col'>
						{!isLoading && !isRefetching && user && (
							<>
								<div className="container mx-auto px-6 py-10">
									{/* Profile Section */}
									<div className="flex flex-col sm:flex-row items-start gap-6 sm:items-center">
										{/* Avatar */}
										<div className="relative w-40 sm:w-64">
											<img src={profileImg || user?.profileImg || 'avatar-placeholder.png'} alt="Profile" className="w-full rounded-2xl" />
										</div>

										{/* Info Section */}
										<div className="w-full flex flex-col gap-2 text-left">
											<h2 className="text-2xl font-bold text-black">{user?.fullName}</h2>

											{/* Address */}
											{user?.address && (
												<div className="flex items-center gap-2 text-gray-700">
													<FaMapMarkerAlt className="w-4 h-4 text-gray-600" />
													<a 
														className="text-sm hover:underline"
														href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(user.address)}`}
														target="_blank"
														rel="noopener noreferrer"
													>
														{user?.address}
													</a>
												</div>
											)}

											{/* Contact Number */}
											{user?.contactPhone && (
												<div className="flex items-center gap-2 text-gray-700">
													<FaPhone className="w-4 h-4 text-gray-600" />
													<span className="text-sm">{user?.contactPhone}</span>
												</div>
											)}

											{/* Website Link */}
											{user?.link && (
												<div className="flex items-center gap-2">
													<a 
														href={user.link.startsWith("http") ? user.link : `https://${user.link}`} 
														target="_blank" 
														rel="noopener noreferrer"
														>
														<button className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-white hover:text-black transition">
															Visit Organization
														</button>
													</a>
												</div>
											)}

											{/* Follow Button - Only show if logged in user is an individual */}
											{authUser?.userType === "individual" && (
												<div className="flex items-center gap-2 mt-2">
													<button
														onClick={() => followUnfollow()}
														className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
															isFollowingState
																? "bg-white text-black border border-none hover:bg-black hover:text-white"
																: "bg-black text-white hover:bg-white hover:text-black"
														}`}
													>
														{isFollowingState ? "Unfollow" : "Follow"}
													</button>
												</div>
											)}
										</div>
									</div>

									{/* Bio Section */}
									{user?.bio && (
										<div className="mt-6 text-left">
											<h3 className="text-lg font-semibold text-black">About Us</h3>
											<div dangerouslySetInnerHTML={{ __html: user?.bio }}  className="text-sm text-gray-700 mt-2" />
										</div>
									)}
								</div>
							</>
						)}
						<Events feedType={"events"} username={username} userId={user?._id} />
					</div>
				)}
			</div>
		</>
	);
};
export default ProfilePage;