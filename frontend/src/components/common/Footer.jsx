import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-transparent text-black py-6 mt-10">
      <div className="container mx-auto px-6 border-t border-black pt-6 flex flex-col md:flex-row justify-between items-center">
        
        {/* Left Section - Brand Name & Navigation */}
        <div className="flex flex-col md:flex-row md:items-center w-full">
          <h2 className="cursor-default text-2xl font-bold mb-4 md:mb-0 md:mr-20 flex flex-wrap justify-center md:justify-start">The Good Deed</h2>

          {/* Navigation Links */}
          <nav className="flex flex-wrap gap-6 justify-center align-bottom md:justify-start text-gray-700">
            <Link to="/discover" className="hover:text-black">Discover</Link>
            <Link to="/about" className="hover:text-black">About</Link>
            <Link to="/contact" className="hover:text-black">Contact</Link>
          </nav>
        </div>

        {/* Social Media Icons */}
        <div className="flex gap-4 mt-4 md:mt-0">
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
      <div className="text-center text-gray-400 mt-6 text-sm cursor-default">
        © {new Date().getFullYear()} The Good Deed. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;