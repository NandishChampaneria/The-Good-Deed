import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-transparent text-black py-8 mt-10">
      <div className="container mx-auto px-6 pt-6 flex flex-col items-center border-t border-black md:items-start md:flex-row justify-between gap-y-6">
        
        {/* Left Section - Brand Name & Navigation */}
        <div className="flex flex-row items-center md:items-start w-full md:w-auto">
          <div className="flex flex-col items-center mr-10">
            <img src="/logo.svg" alt="SVG Icon" className="w-20 h-20 text-white" />
            <span className="font-semibold text-xl text-white">The Good Deed</span>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center md:justify-start gap-x-10 gap-y-4 mt-4">
            <nav className="flex flex-col items-center md:items-start text-gray-700">
              <Link to="/discover" className="hover:text-black">Discover</Link>
              <Link to="/home" className="hover:text-black">My Events</Link>
            </nav>
            <nav className="flex flex-col items-center md:items-start text-gray-700">
              <Link to="/about" className="hover:text-black">About</Link>
              <Link to="/contact" className="hover:text-black">Contact</Link>
            </nav>
            <nav className="flex flex-col items-center md:items-start text-gray-700">
              <Link to="/privacypolicy" className="hover:text-black">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-black">Terms & Conditions</Link>
            </nav>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex gap-6 items-center justify-center md:justify-end">
          <a href="#" className="text-gray-700 hover:text-black text-lg">
            <FaXTwitter />
          </a>
          <a href="#" className="text-gray-700 hover:text-black text-lg">
            <FaInstagram />
          </a>
          <a href="#" className="text-gray-700 hover:text-black text-lg">
            <FaLinkedinIn />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-500 mt-6 text-sm">
        © {new Date().getFullYear()} The Good Deed. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;