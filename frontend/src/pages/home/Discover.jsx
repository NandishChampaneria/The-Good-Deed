import React from 'react'
import Events from '../../components/common/Events'
import Organizations from '../../components/common/Organizations'
import { Link } from 'react-router-dom'
import { motion } from "framer-motion";
import { FaGlobe, FaHandsHelping, FaUsers } from 'react-icons/fa';

const Discover = () => {
  return (
    <>
      <div className="relative w-full h-[calc(100vh-67px)] bg-transparent text-white flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Content */}
        <motion.h1
          className="text-5xl font-bold relative z-10"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Discover & Impact Lives
        </motion.h1>
        <motion.p
          className="text-lg mt-4 max-w-2xl relative z-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Explore meaningful events and organizations making a difference. Join hands to create a better world!
        </motion.p>

        {/* SVGs Positioned Around the Text */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:flex justify-center items-center"
        >
          {/* Rotated icons */}
          <div className="relative w-48 h-48">
            {/* Top center */}
            <div className="absolute top-[-70px] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <img src="/bg1.svg" className="w-24 h-24" alt="Background 1" />
            </div>

            {/* Bottom center */}
            <div className="absolute -bottom-[130px] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <img src="/bg2.svg" className="w-20 h-20" alt="Background 2" />
            </div>

            {/* Top-left corner */}
            <div className="absolute top-[-80px] left-[-200px] transform translate-x-0 translate-y-0 -rotate-[20deg]">
              <img src="/bg3.svg" className="w-20 h-20" alt="Background 3" />
            </div>

            {/* Top-right corner */}
            <div className="absolute top-[-80px] right-[-200px] transform translate-x-0 translate-y-0 rotate-[20deg]">
              <img src="/bg4.svg" className="w-20 h-20" alt="Background 4" />
            </div>

            {/* Bottom-left corner */}
            <div className="absolute bottom-[-50px] left-[-200px] transform translate-x-0 translate-y-0 rotate-[20deg]">
              <img src="/bg5.svg" className="w-20 h-20" alt="Background 5" />
            </div>

            {/* Bottom-right corner */}
            <div className="absolute bottom-[-50px] right-[-200px] transform translate-x-0 translate-y-0 -rotate-[20deg]">
              <img src="/bg6.svg" className="w-20 h-20" alt="Background 6" />
            </div>
          </div>
        </motion.div>

        {/* Scroll Down Indicator */}
        <motion.div 
          className="absolute bottom-5 animate-bounce z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
        >
          <p className="text-sm">Scroll down to explore</p>
        </motion.div>
      </div>
      <div className="container mx-auto px-6">
        <div className="flex flex-row gap-4 items-center">
          <h1 className="sm:text-3xl text-xl text-white font-semibold">Discover Events</h1>
          <Link to='/allevents' className="p-2 bg-black text-sm rounded-lg text-white hover:bg-white hover:text-black transition-all duration-300 ease-in-out font-semibold">View all</Link>
        </div>
      </div>

      <div className='mb-16'><Events feedType="active" limit={8} /></div>

      <div className="container mx-auto px-6">
        <div className="flex flex-row gap-4 items-center">
          <h1 className="sm:text-3xl text-xl text-white font-semibold">Discover Organizations</h1>
          <Link to='/allorganizations' className="p-2 bg-black text-sm rounded-lg text-white hover:bg-white hover:text-black transition-all duration-300 ease-in-out font-semibold">View all</Link>
        </div>
      </div>

      <div><Organizations /></div>
    </>
  )
}

export default Discover;