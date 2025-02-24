import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { MdOutlineMail, MdPassword, MdDriveFileRenameOutline } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import customImage from './image2.jpg'

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });

  const navigate = useNavigate();

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async ({ email, username, fullName, password }) => {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, username, fullName, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create account");
        console.log(data);
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Account created successfully. You can now log in.");
      navigate("/login");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white dark:white">
      <div className="flex justify-center h-screen">
        {/* Background Image Section */}
        <div
          className="hidden bg-cover lg:block lg:w-2/3"
          style={{
            backgroundImage: `url(${customImage})`,
          }}
        >
          <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">The Good Deed</h2>
              <p className="max-w-xl mt-3 text-gray-300">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. In
                autem ipsa, nulla laboriosam dolores, repellendus perferendis
                libero suscipit nam temporibus molestiae
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <section className="flex items-center bg-gradient-to-b to-white via-purple-300 from-cyan-400; w-full px-1 mx-auto lg:w-2/6">
          <div className="container flex items-center justify-center h-full px-6 mx-auto">
            <form
              className="w-full max-w-md bg-transparent rounded-lg "
              onSubmit={handleSubmit}
            >
              <img src="/logo.svg" alt="SVG Icon" className="w-20 h-20 text-white" />

              <h1 className="mt-3 text-2xl font-semibold text-gray-100 capitalize sm:text-3xl">
                Create an account
              </h1>

              <div className="relative flex items-center mt-8">
                <span className="absolute">
                  <MdOutlineMail className="w-6 h-6 mx-3 text-black" />
                </span>
                <input
                  type="email"
                  className="block w-full py-3 text-black bg-secondary border-none rounded-lg px-11 placeholder:text-gray-700 focus:outline-none"
                  placeholder="Email address"
                  name="email"
                  onChange={handleInputChange}
                  value={formData.email}
                />
              </div>

              <div className="flex gap-4 mt-4">
                <div className="relative flex items-center flex-1">
                  <span className="absolute">
                    <FaUser className="w-6 h-6 mx-3 text-black" />
                  </span>
                  <input
                    type="text"
                    className="block w-full py-3 text-black bg-secondary border-none rounded-lg px-11 placeholder:text-gray-700 focus:outline-none"
                    placeholder="Username"
                    name="username"
                    onChange={handleInputChange}
                    value={formData.username}
                  />
                </div>
                <div className="relative flex items-center flex-1">
                  <span className="absolute">
                    <MdDriveFileRenameOutline className="w-6 h-6 mx-3 text-black" />
                  </span>
                  <input
                    type="text"
                    className="block w-full py-3 text-black bg-secondary border-none rounded-lg px-11 placeholder:text-gray-700 focus:outline-none"
                    placeholder="Full Name"
                    name="fullName"
                    onChange={handleInputChange}
                    value={formData.fullName}
                  />
                </div>
              </div>

              <div className="relative flex items-center mt-4">
                <span className="absolute">
                  <MdPassword className="w-6 h-6 mx-3 text-black" />
                </span>
                <input
                  type="password"
                  className="block w-full py-3 text-black bg-secondary border-none rounded-lg px-11 placeholder:text-gray-700 focus:outline-none"
                  placeholder="Password"
                  name="password"
                  onChange={handleInputChange}
                  value={formData.password}
                />
              </div>

              <button
                className="w-full px-6 py-3 mt-6 text-sm font-md tracking-wide text-white capitalize transition-colors duration-300 transform bg-black rounded-lg hover:bg-white hover:text-black focus:outline-none font-semibold focus:ring focus:ring-none "
              >
                {isPending ? "Loading..." : "Sign Up"}
              </button>

              {isError && <p className="text-red-500 mt-2">{error.message}</p>}

          <div className="mt-6 text-center ">
          <p className="text-gray-700 dark:text-gray-400">
            Already have an account?{" "}
            <Link to="/login">
            <button className="text-black hover:underline">
              Sign in
            </button>
            </Link>
          </p>
          </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SignUpPage;