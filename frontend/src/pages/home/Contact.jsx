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
    <div className="absolute top-0 left-0 w-full bg-gradient-to-b to-purple-400 from-cyan-400 text-white min-h-screen flex flex-col items-center justify-center px-6">
      {/* Heading */}
      <motion.h1
        className="text-4xl md:text-5xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Contact <span className="bg-gradient-to-r from-blue-700 to-purple-600 text-transparent bg-clip-text">Us</span>
      </motion.h1>

      {/* Contact Form */}
      <motion.form
        className="bg-transparent p-6 rounded-lg w-full max-w-lg"
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
          <span className="text-black">Name</span>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 mt-2 bg-secondary bg-opacity-50 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white"
          />
        </label>

        {/* Email Input */}
        <label className="block mb-4">
          <span className="text-black">Email</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 mt-2 bg-secondary bg-opacity-50 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white"
          />
        </label>

        {/* Message Input */}
        <label className="block mb-4">
          <span className="text-black">Message</span>
          <textarea
            name="message"
            rows="4"
            value={form.message}
            onChange={handleChange}
            required
            className="w-full p-3 mt-2 bg-secondary bg-opacity-50 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white"
          ></textarea>
        </label>

        {/* Submit Button */}
        <motion.button
          type="submit"
          className="w-full font-semibold py-3 mt-4 bg-black text-white rounded-md hover:bg-white hover:text-black transition-all duration-300"

          disabled={sendEmail.isLoading}
        >
          {sendEmail.isLoading ? "Sending..." : "Send Message"}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default ContactPage;