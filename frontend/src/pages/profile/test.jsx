import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { MdEdit } from "react-icons/md";
import { useParams } from "react-router-dom";

const EditProfileModal = () => {
	const [profileImg, setProfileImg] = useState(null);
	const queryClient = useQueryClient();

	const profileImgRef = useRef(null);
	const [formData, setFormData] = useState({
		fullName: "",
		username: "",
		email: "",
		bio: "",
		link: "",
		newPassword: "",
		currentPassword: "",
	});

	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
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

	const isMyProfile = authUser._id === user?._id;

	const {mutate: updateProfile, isPending: isUpdatingProfile} = useMutation({
		mutationFn: async (formData) => {
            try {
                const res = await fetch(`/api/users/update`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to update profile");
                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
        onSuccess: () => {
            toast.success("Profile updated successfully");
			Promise.all([
				queryClient.invalidateQueries({ queryKey: ["authUser"]}),
				queryClient.invalidateQueries({ queryKey: ["userProfile"]})
			])
        },
        onError: (error) => {
            toast.error(error.message);
        },
	})

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
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

	useEffect(() => {
		if (authUser) {
			setFormData({
				fullName: authUser.fullName,
				username: authUser.username,
				email: authUser.email,
				bio: authUser.bio,
				link: authUser.link,
				newPassword: "",
				currentPassword: "",
			});
		}
	}, [authUser]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = { ...formData, profileImg };
        updateProfile(data);
    };

	return (
		<>
			<div id='edit_profile_modal' className='flex justify-center w-full'>
				<section class="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800">
    				<h2 class="text-lg font-semibold text-gray-700 capitalize dark:text-white">Account settings</h2>
					<form
						onSubmit={handleSubmit}
					>
						{/* COVER IMG */}
						<div className='relative group/cover mt-6'>
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
						<div className='flex flex-wrap gap-2'>
							<input
								type='text'
								placeholder={user?.fullName}
								className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring'
								value={formData.fullName}
								name='fullName'
								onChange={handleInputChange}
							/>
							<input
								type='text'
								placeholder='Username'
								className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring'
								value={formData.username}
								name='username'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='email'
								placeholder='Email'
								className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring'
								value={formData.email}
								name='email'
								onChange={handleInputChange}
							/>
							<textarea
								placeholder='Bio'
								className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring'
								value={formData.bio}
								name='bio'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='password'
								placeholder='Current Password'
								className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring'
								value={formData.currentPassword}
								name='currentPassword'
								onChange={handleInputChange}
							/>
							<input
								type='password'
								placeholder='New Password'
								className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring'
								value={formData.newPassword}
								name='newPassword'
								onChange={handleInputChange}
							/>
						</div>
						<input
							type='text'
							placeholder='Link'
							className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring'
							value={formData.link}
							name='link'
							onChange={handleInputChange}
						/>
						<button className='btn btn-primary rounded-full btn-sm text-white'>{isUpdatingProfile ? "Updating..." : "Save"}</button>
					</form>
				</section>
			</div>
		</>
	);
};
export default EditProfileModal;