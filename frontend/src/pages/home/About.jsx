import React from "react";
import { motion } from "framer-motion";

const AboutPage = () => {
  return (
    <div className="absolute top-0 left-0 w-full bg-black text-white h-screen overflow-y-scroll snap-y snap-mandatory">
      {/* Heading Section */}
      <section className="h-screen flex flex-col items-center justify-center px-6 text-center snap-start">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          About <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">Good Deeds</span>
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-gray-300 max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          The <span className="text-gray-400">Good Deeds App</span> makes it effortless to create, join, and manage social causes. 
          Whether you want to organize an event, participate in one, or track your contributions, we've got you covered.
        </motion.p>
      </section>

      {/* Feature Sections */}
      {[
        {
          title: "Create Events",
          desc: "Easily create and manage charitable events. Whether it's a fundraiser, a volunteer drive, or an awareness campaign, setting up an event is just a few clicks away. Share details, invite participants, and make an impact effortlessly.",
          buttonText: "Start an Event",
          link: "/createevent",
          bgColor: "bg-gradient-to-r from-pink-800 to-[#d767cf]"
        },
        {
          title: "Join Causes",
          desc: "Find causes that matter to you and get involved. Our platform connects you with meaningful social initiatives where you can contribute time, resources, or funds. Join a movement, make a difference, and be part of something bigger than yourself.",
          buttonText: "Explore Causes",
          link: "/discover",
          bgColor: "bg-gradient-to-r from-[#e9c46a] to-[#e76f51]"
        },
        {
          title: "Transparency",
          desc: "We believe in complete transparency when it comes to donations and participation. Track how your contributions are used, get updates on event progress, and ensure that every good deed has a real-world impact.",
          buttonText: "Learn More",
          link: "/transparency",
          bgColor: "bg-gradient-to-r from-[#0990b3] to-blue-500"
        }
      ].map((feature, index) => (
        <section key={index} className={`h-screen flex flex-col items-center justify-center px-6 text-center ${feature.bgColor} snap-start`}>
          <motion.h2
            className="text-3xl md:text-4xl font-semibold text-white"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {feature.title}
          </motion.h2>

          <motion.p
            className="text-gray-300 mt-4 max-w-2xl text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0, ease: "easeOut" }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {feature.desc}
          </motion.p>

          <motion.a
            href={feature.link}
            className="mt-6 px-6 py-3 bg-gray-800 text-white rounded-full text-lg font-medium hover:bg-gray-700 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0, ease: "easeOut" }}
            transition={{ duration: 1, delay: 0.5 }} 
            viewport={{ once: true }}
          >
            {feature.buttonText}
          </motion.a>
        </section>
      ))}
    </div>
  );
};

export default AboutPage;