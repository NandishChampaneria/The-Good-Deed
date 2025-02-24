import { useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import customImage from './image2.jpg'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const { mutate: loginMutation, isPending, isError, error } = useMutation({
    mutationFn: async ({ username, password }) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to login");
        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
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
        <div className="flex items-center bg-gradient-to-b to-white via-purple-300 from-cyan-400; w-full px-6 mx-auto lg:w-2/6">
          <div className="flex-1">
            <div className="text-center">
              <div className="flex justify-center mx-auto">
                <img src="/logo.svg" alt="SVG Icon" className="w-20 h-20 text-white" />
              </div>

              <h1 className="mt-3 text-2xl text-gray-100 sm:text-3xl capitalize font-semibold">
                Sign In to your account
              </h1>
            </div>

            <div className="mt-8">
              <form onSubmit={handleSubmit}>
                <div>
                  <div className="input input-bordered rounded flex items-center border-none gap-2 bg-secondary text-black focus:outline-none">
                    <MdOutlineMail />
                    <input
                      type="text"
                      className="grow placeholder:text-gray-700 focus:outline-none"
                      placeholder="Username"
                      name="username"
                      onChange={handleInputChange}
                      value={formData.username}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="input input-bordered rounded flex items-center border-none gap-2 bg-secondary focus:outline-none text-black">
                    <MdPassword />
                    <input
                      type="password"
                      className="grow placeholder:text-gray-700 focus:outline-none"
                      placeholder="Password"
                      name="password"
                      onChange={handleInputChange}
                      value={formData.password}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <button className="w-full px-4 py-2 tracking-wide text-white font-semibold transition-colors duration-300 transform bg-black rounded-lg hover:bg-white hover:text-black focus:outline-none focus:bg-black focus:ring focus:ring-none">
                    {isPending ? "Loading..." : "Sign in"}
                  </button>
                </div>
                {isError && <p className="text-red-500">{error.message}</p>}
              </form>

              <p className="mt-6 text-sm text-center text-gray-700">
                Don&#x27;t have an account yet?{" "}
                <Link to="/signup" className="text-black focus:outline-none focus:underline hover:underline">
                  Sign up
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;