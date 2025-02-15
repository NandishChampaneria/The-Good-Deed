import React, { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Mutation for sending email
  const sendEmail = useMutation({
    mutationFn: async (formData) => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      return response.json();
    },
    onSuccess: () => {
      alert("Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
    },
    onError: () => {
      alert("Error sending message. Please try again.");
    },
  });

  return (
    <div className="absolute top-0 left-0 w-full bg-black text-white min-h-screen flex flex-col items-center justify-center px-6">
      {/* Heading */}
      <motion.h1
        className="text-4xl md:text-5xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Contact <span className="gradient-text">Us</span>
      </motion.h1>

      {/* Contact Form */}
      <motion.form
        className="bg-[#121213] p-6 rounded-lg shadow-md w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        onSubmit={(e) => {
          e.preventDefault();
          sendEmail.mutate(form);
        }}
      >
        {/* Name Input */}
        <label className="block mb-4">
          <span className="text-gray-300">Name</span>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 mt-2 bg-gray-800 bg-opacity-50 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
        </label>

        {/* Email Input */}
        <label className="block mb-4">
          <span className="text-gray-300">Email</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 mt-2 bg-gray-800 bg-opacity-50 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
        </label>

        {/* Message Input */}
        <label className="block mb-4">
          <span className="text-gray-300">Message</span>
          <textarea
            name="message"
            rows="4"
            value={form.message}
            onChange={handleChange}
            required
            className="w-full p-3 mt-2 bg-gray-800 bg-opacity-50 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
          ></textarea>
        </label>

        {/* Submit Button */}
        <motion.button
          type="submit"
          className="w-full py-3 mt-4 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition-all duration-300"

          disabled={sendEmail.isLoading}
        >
          {sendEmail.isLoading ? "Sending..." : "Send Message"}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default ContactPage;