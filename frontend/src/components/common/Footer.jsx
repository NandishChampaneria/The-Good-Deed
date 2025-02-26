import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-transparent text-black py-8 mt-10 border-t border-black">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-y-6">
        
        {/* Left Section - Logo & Navigation */}
        <div className="flex flex-col md:flex-row w-full md:w-auto gap-10">
          {/* Logo */}
          <div className="flex flex-col items-center">
            <img src="/logo.svg" alt="Logo" className="w-20 h-20 -mt-3" />
            <span className="text-xl text-white font-bold">The Good Deed</span>
          </div>

          {/* Navigation Links - Aligned to the top of the logo */}
          <div className="flex flex-wrap justify-center md:justify-start gap-x-10 gap-y-4 items-start">
            <nav className="flex flex-col text-gray-700">
              <Link to="/discover" className="hover:text-black">Discover</Link>
              <Link to="/home" className="hover:text-black">My Events</Link>
            </nav>
            <nav className="flex flex-col text-gray-700">
              <Link to="/about" className="hover:text-black">About</Link>
              <Link to="/contact" className="hover:text-black">Contact</Link>
            </nav>
            <nav className="flex flex-col text-gray-700">
              <Link to="/privacypolicy" className="hover:text-black">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-black">Terms & Conditions</Link>
            </nav>
          </div>
        </div>

        {/* Social Media Icons - Now Aligned to Top */}
        <div className="flex gap-6 items-start">
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
      <div className="text-center text-gray-300 mt-6 text-sm">
        © {new Date().getFullYear()} The Good Deed. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;