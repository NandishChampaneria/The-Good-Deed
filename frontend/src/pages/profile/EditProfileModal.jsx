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
		<section className="h-full p-4">
            <form className="container max-w-2xl mx-auto shadow-md md:w-3/4">
                <div className="p-4 bg-gray-900">
                    <div className="max-w-sm mx-auto md:w-full md:mx-0">
                        <div className="inline-flex items-center space-x-4">
                            <div className="relative block">
                                <input
                                    type='file'
                                    hidden
                                    ref={profileImgRef}
                                    onChange={(e) => handleImgChange(e, "profileImg")}
                                />
                                <img src={profileImg || user?.profileImg || "/avatar-placeholder.png"} className="mx-auto object-cover rounded-full h-16 w-16" />
                                <div className='absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer'>
                                    {isMyProfile && (
                                        <MdEdit
                                            className='w-4 h-4 text-black'
                                            onClick={() => profileImgRef.current.click()}
                                        />
                                    )}
                                </div>
                                <button onClick={handleSubmit} className="text-white">Save</button>
                            </div>
                            <input
                                type='text'
                                placeholder={user?.fullName}
                                className='rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-transparent text-white placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent'
                                value={formData.fullName}
                                name='fullName'
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="space-y-6 bg-gray-100/5">
                    <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
                        <h2 className="max-w-sm mx-auto md:w-1/3">Account</h2>
                        <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
                            <div>
                                <div className="relative">
                                    <input type="email" value={formData.email} onChange={handleInputChange} id="user-info-name" name='email' className="rounded-lg border-transparent flex-1 appearance-none border border-gray-800 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" placeholder="Email" />
                                </div>
                            </div>
                            <div>
                                <div className="relative">
                                    <input type="text" value={formData.username} onChange={handleInputChange} id="user-info-phone" name='username' className="rounded-lg border-transparent flex-1 appearance-none border border-gray-800 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" placeholder="Username" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
                        <h2 className="max-w-sm mx-auto md:w-1/3">Personal info</h2>
                        <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
                            <div>
                                <div className="relative">
                                    <textarea type="text" value={formData.bio} name='bio' onChange={handleInputChange} id="user-info-name" className="rounded-lg border-transparent flex-1 appearance-none border border-gray-800 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" placeholder="Bio" />
                                </div>
                            </div>
                            <div>
                                <div className="relative">
                                    <input type="text" value={formData.link} name='link' onChange={handleInputChange} id="user-info-name" className="rounded-lg border-transparent flex-1 appearance-none border border-gray-800 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" placeholder="Links" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
                        <h2 className="max-w-sm mx-auto md:w-1/3">Change password</h2>
                        <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
                            <div>
                                <div className="relative">
                                    <input type="password" value={formData.currentPassword} name='currentPassword' onChange={handleInputChange} id="user-info-name" className="rounded-lg border-transparent flex-1 appearance-none border border-gray-800 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" placeholder="Current Password" />
                                </div>
                            </div>
                            <div>
                                <div className="relative">
                                    <input type="password" value={formData.newPassword} name='newPassword' onChange={handleInputChange} id="user-info-name" className="rounded-lg border-transparent flex-1 appearance-none border border-gray-800 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" placeholder="New Password" />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="w-full px-4 pb-4 ml-auto text-gray-500 md:w-1/3">
                        <button className="py-2 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg">
                            {isUpdatingProfile ? "Updating..." : "Save"}
                        </button>
                    </div>
                </div>
            </form>
        </section>
	);
};
export default EditProfileModal;