import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { MdOutlineMail, MdPassword, MdDriveFileRenameOutline } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

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
    <section className="bg-white dark:bg-gray-900">
      <div className="container flex items-center justify-center h-full px-6 mx-auto">
        <form
          className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg "
          onSubmit={handleSubmit}
        >
          <img
            className="w-auto h-7 sm:h-8"
            src="https://merakiui.com/images/logo.svg"
            alt=""
          />

          <h1 className="mt-3 text-2xl font-semibold text-gray-800 capitalize sm:text-3xl dark:text-white">
            Sign Up
          </h1>

          <div className="relative flex items-center mt-8">
            <span className="absolute">
              <MdOutlineMail className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" />
            </span>
            <input
              type="email"
              className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              placeholder="Email address"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
            />
          </div>

          <div className="flex gap-4 mt-4">
            <div className="relative flex items-center flex-1">
              <span className="absolute">
                <FaUser className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" />
              </span>
              <input
                type="text"
                className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                placeholder="Username"
                name="username"
                onChange={handleInputChange}
                value={formData.username}
              />
            </div>
            <div className="relative flex items-center flex-1">
              <span className="absolute">
                <MdDriveFileRenameOutline className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" />
              </span>
              <input
                type="text"
                className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                placeholder="Full Name"
                name="fullName"
                onChange={handleInputChange}
                value={formData.fullName}
              />
            </div>
          </div>

          <div className="relative flex items-center mt-4">
            <span className="absolute">
              <MdPassword className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" />
            </span>
            <input
              type="password"
              className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </div>

          <button
            className="w-full px-6 py-3 mt-6 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
          >
            {isPending ? "Loading..." : "Sign Up"}
          </button>

          {isError && <p className="text-red-500 mt-2">{error.message}</p>}

		  <div className="mt-6 text-center ">
			<p className="text-gray-600 dark:text-gray-400">
				Already have an account?{" "}
				<Link to="/login">
				<button className="text-blue-500 hover:underline dark:text-blue-400">
					Sign in
				</button>
				</Link>
			</p>
			</div>
        </form>
      </div>
    </section>
  );
};

export default SignUpPage;