import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { MdEdit } from "react-icons/md";
import { useParams } from "react-router-dom";
import Popup from "../../components/common/Popup";

import ReactQuill from 'react-quill'; 
import 'react-quill/dist/quill.snow.css'; // Import the necessary Quill styles

const EditProfileModal = () => {
	const [profileImg, setProfileImg] = useState(null);
    const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
	const queryClient = useQueryClient();

	const profileImgRef = useRef(null);
	const [formData, setFormData] = useState({
		fullName: "",
		username: "",
		email: "",
		bio: "",
		link: "",
        address: "",
        contactPhone: "",
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
            setDeletePopupOpen(false); 
			Promise.all([
				queryClient.invalidateQueries({ queryKey: ["authUser"]}),
				queryClient.invalidateQueries({ queryKey: ["userProfile"]})
			])
        },
        onError: (error) => {
            toast.error(error.message);
        },
	})

    const handleInputChange = (e, fieldName = null) => {
        if (typeof e === "string") {
            // Handle ReactQuill case where 'e' is the new value, not an event
            setFormData({ ...formData, bio: e });
        } else {
            // Handle normal input fields
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
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
                address: authUser.address,
                contactPhone: authUser.contactPhone,
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
            {isMyProfile && (
                <form className="container max-w-2xl mx-auto md:w-3/4" onSubmit={handleSubmit}>
                    {user?.userType === 'individual' && (
                        <div>
                            <div className="p-4 rounded-lg bg-transparent">
                                <div className="max-w-sm mx-auto md:w-full md:mx-0">
                                    <div className="inline-flex w-full items-center space-x-4">
                                        <div className="relative block">
                                            <input
                                                type='file'
                                                hidden
                                                ref={profileImgRef}
                                                onChange={(e) => handleImgChange(e, "profileImg")}
                                            />
                                            <div className="relative">
                                                <img src={profileImg || user?.profileImg || "/avatar-placeholder.png"} className="mx-auto object-cover rounded-full h-20 w-20 sm:h-24 sm:w-24" />
                                                <div className='absolute top-0 z-10 right-0 bg-accent rounded-full cursor-pointer p-1 text-black hover:text-white hover:bg-black'>
                                                    {isMyProfile && (
                                                        <MdEdit
                                                            className='sm:w-5 sm:h-5'
                                                            onClick={() => profileImgRef.current.click()}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <input
                                            type='text'
                                            placeholder={user?.fullName}
                                            className='rounded-lg border-transparent flex-1 appearance-none border w-full py-2 px-4 bg-secondary text-black placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent'
                                            value={formData.fullName}
                                            name='fullName'
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6 ">
                                <div className="items-center w-full p-4 space-y-4 text-gray-600 md:inline-flex md:space-y-0">
                                    <h2 className="max-w-sm mx-auto md:w-1/3">Username</h2>
                                    <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
                                        <div>
                                        <div className="relative flex flex-row">
                                            <div className="bg-white cursor-default px-3 flex items-center rounded-l-lg">@</div>
                                            <input 
                                                type="text" 
                                                value={formData.username} 
                                                onChange={handleInputChange} 
                                                id="user-info-phone" 
                                                name="username" 
                                                className="rounded-r-lg border-transparent flex-1 appearance-none border w-full py-2 pl-3 pr-4 bg-secondary text-black placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent" 
                                                placeholder="Username" 
                                            />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr className="text-neutral-900"/>
                                <div className="items-center w-full p-4 space-y-4 text-gray-600 md:inline-flex md:space-y-0">
                                    <h2 className="max-w-sm mx-auto md:w-1/3">Contact Number</h2>
                                    <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
                                        <div>
                                            <div className="relative flex">
                                            <div className="bg-white cursor-default px-3 flex items-center rounded-l-lg">+91</div>
                                                <input type="number" value={formData.contactPhone} name='contactPhone' onChange={handleInputChange} id="user-info-name" className="rounded-r-lg border-transparent flex-1 appearance-none border  w-full py-2 pl-2 pr-4 bg-secondary text-black placeholder-gray-400  text-base focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent" placeholder="9876543210" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr className="bg-neutral" />
                                <div className="items-center w-full p-4 space-y-4 text-gray-600 md:inline-flex md:space-y-0">
                                    <h2 className="max-w-sm mx-auto md:w-1/3">Personal info</h2>
                                    <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
                                        <div>
                                            <div className="relative">
                                                <textarea type="text" value={formData.bio} name='bio' onChange={handleInputChange} id="user-info-name" className="rounded-lg border-transparent flex-1 appearance-none border  w-full py-2 px-4 bg-secondary text-black placeholder-gray-400  text-base focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent" placeholder="Bio" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="relative">
                                                <input type="text" value={formData.link} name='link' onChange={handleInputChange} id="user-info-name" className="rounded-lg border-transparent flex-1 appearance-none border  w-full py-2 px-4 bg-secondary text-black placeholder-gray-400  text-base focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent" placeholder="Links" />
                                            </div>
                                        </div>
                                    </div>
                                </div>   
                                <hr className="bg-neutral" />
                                <div className="items-center w-full p-4 space-y-4 text-gray-600 md:inline-flex md:space-y-0">
                                    <h2 className="max-w-sm mx-auto md:w-1/3">Password</h2>
                                    <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
                                        <div>
                                            <div className="relative">
                                                <button
                                                    className="py-2 px-4 bg-white hover:bg-gray-200 text-black w-full transition ease-in duration-200 text-center text-base font-semibold  focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"                                 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setDeletePopupOpen(true);
                                                    }}>
                                                    Change Password
                                                </button>
                                                <Popup isOpen={isDeletePopupOpen} onClose={() => setDeletePopupOpen(false)}>
                                                    <div className="flex flex-col gap-2">
                                                        <h1 className="font-semibold text-black text-lg">Change Password</h1>
                                                        <p className='text-gray-700'>Choose a new password for your account</p>
                                                        <input type="password" value={formData.currentPassword} name='currentPassword' onChange={handleInputChange} id="user-info-name" className="mt-3 rounded-lg border-transparent flex-1 appearance-none border  w-full py-2 px-4 bg-secondary text-black placeholder-gray-400  text-base focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent" placeholder="Current Password" />
                                                        <input type="password" value={formData.newPassword} name='newPassword' onChange={handleInputChange} id="user-info-name" className="rounded-lg border-transparent flex-1 appearance-none border  w-full py-2 px-4 bg-secondary text-black placeholder-gray-400  text-base focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent" placeholder="New Password" />
                                                        <button type="submit" className="py-2 px-4 bg-black hover:bg-gray-900 text-white w-full transition ease-in duration-200 text-center text-base font-semibold  focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg">
                                                            {isUpdatingProfile ? "Updating..." : "Update"}
                                                        </button>
                                                    </div>
                                                </Popup>
                                            </div>
                                        </div>
                                    </div>
                                </div>  
                                <hr className="bg-neutral" />                
                                <div className="items-center w-full p-4 space-y-4 text-gray-600 md:inline-flex md:space-y-0">
                                    <button type="submit" className="py-2 bg-black hover:bg-white hover:text-black text-white w-full transition ease-in duration-200 text-center text-base font-semibold  focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg">
                                        {isUpdatingProfile ? "Updating..." : "Save"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {user?.userType === 'organization' && (
                        <div>
                            <div className="p-4 rounded-lg bg-transparent">
                                <div className="max-w-sm mx-auto md:w-full md:mx-0">
                                    <div className="inline-flex w-full items-center space-x-4">
                                        <div className="relative block">
                                            <input
                                                type='file'
                                                hidden
                                                ref={profileImgRef}
                                                onChange={(e) => handleImgChange(e, "profileImg")}
                                            />
                                            <div className="relative">
                                                <img src={profileImg || user?.profileImg || "/avatar-placeholder.png"} className="mx-auto object-cover rounded-full h-20 w-20 sm:h-24 sm:w-24" />
                                                <div className='absolute top-0 z-10 right-0 bg-accent rounded-full cursor-pointer p-1 text-black hover:text-white hover:bg-black'>
                                                    {isMyProfile && (
                                                        <MdEdit
                                                            className='sm:w-5 sm:h-5'
                                                            onClick={() => profileImgRef.current.click()}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <input
                                            type='text'
                                            placeholder={user?.fullName}
                                            className='rounded-lg border-transparent flex-1 appearance-none border w-full py-2 px-4 bg-secondary text-black placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent'
                                            value={formData.fullName}
                                            name='fullName'
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6 ">
                                <div className="items-center w-full p-4 space-y-4 text-gray-600 md:inline-flex md:space-y-0">
                                    <h2 className="max-w-sm mx-auto md:w-1/3">Username</h2>
                                    <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
                                        <div>
                                        <div className="relative flex focus-within:ring-2 focus-within:ring-white focus-within:border-white rounded-lg">
                                            <div className="bg-white cursor-default px-3 flex items-center rounded-l-lg">@</div>
                                            <input 
                                                type="text" 
                                                value={formData.username} 
                                                onChange={handleInputChange} 
                                                id="user-info-phone" 
                                                name="username" 
                                                className="rounded-r-lg border-transparent flex-1 appearance-none border w-full py-2 pl-3 pr-4 bg-secondary text-black placeholder-gray-400 text-base focus:outline-none" 
                                                placeholder="Username" 
                                            />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr className="text-neutral-900"/>
                                <div className="items-center w-full p-4 space-y-4 text-gray-600 md:inline-flex md:space-y-0">
                                    <h2 className="max-w-sm mx-auto md:w-1/3">Your Information</h2>
                                    <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
                                        <div>
                                            <div className="relative flex focus-within:ring-2 focus-within:ring-white focus-within:border-white rounded-lg">
                                                <div className="bg-white cursor-default px-3 flex items-center rounded-l-lg">
                                                    +91
                                                </div>
                                                <input
                                                    type="number"
                                                    value={formData.contactPhone}
                                                    name="contactPhone"
                                                    onChange={handleInputChange}
                                                    id="user-info-name"
                                                    className="rounded-r-lg border-transparent flex-1 appearance-none border w-full py-2 pl-2 pr-4 bg-secondary text-black placeholder-gray-400 text-base focus:outline-none"
                                                    placeholder="9876543210"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="relative flex">
                                                <input type="text" value={formData.address} name='address' onChange={handleInputChange} id="user-info-name" className="rounded-lg border-transparent flex-1 appearance-none border  w-full py-2 px-4 bg-secondary text-black placeholder-gray-400  text-base focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent" placeholder="Address" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="relative">
                                                <input type="text" value={formData.link} name='link' onChange={handleInputChange} id="user-info-name" className="rounded-lg border-transparent flex-1 appearance-none border  w-full py-2 px-4 bg-secondary text-black placeholder-gray-400  text-base focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent" placeholder="Links" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr className="bg-neutral" />
                                <div className="items-center w-full p-4 space-y-4 text-gray-600 md:inline-flex md:space-y-0">
                                    <h2 className="max-w-sm mx-auto md:w-1/3">Description</h2>
                                    <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
                                        <div>
                                            <div className="relative">
                                                <ReactQuill value={formData.bio} name='bio' onChange={(value) => handleInputChange(value, "bio")} id="user-info-name" className="rounded-lg h-56 overflow-y-auto border-transparent flex-1 appearance-none border  w-full py-2 px-4 bg-secondary text-black placeholder-gray-400  text-base focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent" placeholder="Bio" />
                                            </div>
                                        </div>
                                    </div>
                                </div>   
                                <hr className="bg-neutral" />
                                <div className="items-center w-full p-4 space-y-4 text-gray-600 md:inline-flex md:space-y-0">
                                    <h2 className="max-w-sm mx-auto md:w-1/3">Password</h2>
                                    <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
                                        <div>
                                            <div className="relative">
                                                <button
                                                    className="py-2 px-4 bg-white hover:bg-gray-200 text-black w-full transition ease-in duration-200 text-center text-base font-semibold  focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"                                 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setDeletePopupOpen(true);
                                                    }}>
                                                    Change Password
                                                </button>
                                                <Popup isOpen={isDeletePopupOpen} onClose={() => setDeletePopupOpen(false)}>
                                                    <div className="flex flex-col gap-2">
                                                        <h1 className="font-semibold text-black text-lg">Change Password</h1>
                                                        <p className='text-gray-700'>Choose a new password for your account</p>
                                                        <input type="password" value={formData.currentPassword} name='currentPassword' onChange={handleInputChange} id="user-info-name" className="mt-3 rounded-lg border-transparent flex-1 appearance-none border  w-full py-2 px-4 bg-secondary text-black placeholder-gray-400  text-base focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent" placeholder="Current Password" />
                                                        <input type="password" value={formData.newPassword} name='newPassword' onChange={handleInputChange} id="user-info-name" className="rounded-lg border-transparent flex-1 appearance-none border  w-full py-2 px-4 bg-secondary text-black placeholder-gray-400  text-base focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent" placeholder="New Password" />
                                                        <button type="submit" className="py-2 px-4 bg-black hover:bg-gray-900 text-white w-full transition ease-in duration-200 text-center text-base font-semibold  focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg">
                                                            {isUpdatingProfile ? "Updating..." : "Update"}
                                                        </button>
                                                    </div>
                                                </Popup>
                                            </div>
                                        </div>
                                    </div>
                                </div>  
                                <hr className="bg-neutral" />                
                                <div className="items-center w-full p-4 space-y-4 text-gray-600 md:inline-flex md:space-y-0">
                                    <button type="submit" className="py-2 bg-black hover:bg-white hover:text-black text-white w-full transition ease-in duration-200 text-center text-base font-semibold  focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg">
                                        {isUpdatingProfile ? "Updating..." : "Save"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </form>
            )}
        </section>
	);
};
export default EditProfileModal;