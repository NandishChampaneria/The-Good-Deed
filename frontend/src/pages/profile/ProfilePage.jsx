import { useRef, useState } from "react";
import { Link } from "react-router-dom";

import Events from "../../components/common/Events";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";

import { EVENTS } from "../../utils/db/dummy";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";

const ProfilePage = () => {

	const [profileImg, setProfileImg] = useState(null);
	const [feedType, setFeedType] = useState("events");

	const profileImgRef = useRef(null);

	const isLoading = false;
	const isMyProfile = true;

	const user = {
		_id: "1",
		fullName: "John Doe",
		username: "johndoe",
		profileImg: "/avatars/boy2.png",
		bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
		link: "https://youtube.com/@asaprogrammer_",
		joinedEvents: ["1", "2", "3"],
	};

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

	return (
		<>
			<div className='flex-[4_4_0] min-h-screen '>
				{/* HEADER */}
				{isLoading && <ProfileHeaderSkeleton />}
				{!isLoading && !user && <p className='text-center text-lg mt-4'>User not found</p>}
				<div className='flex flex-col'>
					{!isLoading && user && (
						<>
							{/* COVER IMG */}
							<div className='relative group/cover mt-16'>
								<input
									type='file'
									hidden
									ref={profileImgRef}
									onChange={(e) => handleImgChange(e, "profileImg")}
								/>
								{/* USER AVATAR */}
								<div className='avatar flex justify-center '>
									<div className='w-32 rounded-full relative group/avatar'>
										<img src={profileImg || user?.profileImg || "/avatar-placeholder.png"} />
										<div className='absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer'>
											{isMyProfile && (
												<MdEdit
													className='w-4 h-4 text-white'
													onClick={() => profileImgRef.current.click()}
												/>
											)}
										</div>
									</div>
								</div>
							</div>
							<div className='flex justify-end px-4 mt-5'>
								{isMyProfile && <EditProfileModal />}
								{(profileImg) && (
									<button
										className='btn btn-primary rounded-full btn-sm text-white px-4 ml-2'
										onClick={() => alert("Profile updated successfully")}
									>
										Update
									</button>
								)}
							</div>

							<div className='flex justify-center mt-1 px-4'>
								<div className='flex justify-center flex-col gap-2'>
									<span className='font-bold text-lg'>{user?.fullName}</span>
                                    <div className="flex flex-row gap-10">
                                        <span className='text-sm text-slate-500'>@{user?.username}</span>
                                        <div className='flex gap-2 items-center'>
                                            <IoCalendarOutline className='w-4 h-4 text-slate-500' />
                                            <span className='text-sm text-slate-500'>Joined July 2021</span>
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
													youtube.com/@asaprogrammer_
												</a>
											</>
										</div>
									)}
									<span className='text-sm my-1'>{user?.bio}</span>
								</div>
							</div>
							<div className='flex w-full border-b border-gray-700 mt-4'>
								<div
									className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer'
									onClick={() => setFeedType("events")}
								>
									Posts
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
							</div>
						</>
					)}

					<Events />
				</div>
			</div>
		</>
	);
};
export default ProfilePage;