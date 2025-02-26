import { motion } from "framer-motion";
import { FaHandsHelping, FaGlobe, FaUsers } from "react-icons/fa";

export default function Test() {
  return (
    <div className="relative w-full h-[500px] bg-gradient-to-r from-blue-500 to-green-400 text-white flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      {/* Background Decoration */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full bg-opacity-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/path-to-your-illustration.svg')" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />

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
      
      {/* Icons Section */}
      <motion.div 
        className="flex gap-10 mt-8 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.5 }}
      >
        <div className="flex flex-col items-center">
          <FaHandsHelping className="text-5xl" />
          <p className="mt-2 text-sm">Volunteer</p>
        </div>
        <div className="flex flex-col items-center">
          <FaGlobe className="text-5xl" />
          <p className="mt-2 text-sm">Global Impact</p>
        </div>
        <div className="flex flex-col items-center">
          <FaUsers className="text-5xl" />
          <p className="mt-2 text-sm">Community</p>
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
  );
}
