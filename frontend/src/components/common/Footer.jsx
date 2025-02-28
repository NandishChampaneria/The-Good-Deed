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
            <img src="/logo.svg" alt="Logo" className="w-12 h-12" />
          </div>

          {/* Navigation Links - Aligned to the top of the logo */}
          <div className="flex flex-wrap justify-center md:justify-start gap-x-10 gap-y-4 items-start">
            <nav className="flex flex-col text-gray-100">
              <Link to="/discover" className="hover:text-white">Discover</Link>
              <Link to="/home" className="hover:text-white">My Events</Link>
            </nav>
            <nav className="flex flex-col text-gray-100">
              <Link to="/about" className="hover:text-white">About</Link>
              <Link to="/contact" className="hover:text-white">Contact</Link>
            </nav>
            <nav className="flex flex-col text-gray-100">
              <a href="/privacypolicy" target="_blank" rel="noopener noreferrer" className="hover:text-white">Privacy Policy</a>
              <a href="/terms" target="_blank" rel="noopener noreferrer" className="hover:text-white">Terms & Conditions</a>
            </nav>
          </div>
        </div>

        {/* Social Media Icons - Now Aligned to Top */}
        <div className="flex gap-6 items-start">
          <a data-tip='Twitter' href="#" className="text-gray-100  hover:text-white text-lg">
            <FaXTwitter />
          </a>
          <a data-tip='Instagram' href="#" className="text-gray-100  hover:text-white text-lg">
            <FaInstagram />
          </a>
          <a data-tip='LinkedIn' href="#" className="text-gray-100  hover:text-white text-lg">
            <FaLinkedinIn />
          </a>
        </div>
      </div>

      {/* Copyright */}
      {/* <div className="text-center text-gray-300 mt-6 text-sm">
        © {new Date().getFullYear()} The Good Deed. All rights reserved.
      </div> */}
    </footer>
  );
};

export default Footer;