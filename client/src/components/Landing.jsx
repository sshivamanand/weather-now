import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Landing = () => {
  return (
    <div className="flex items-center justify-center p-4 h-[65vh]">
      <motion.div
        className="w-[90%] sm:w-[70%]"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">
          The simplest way to find accurate weather.
        </h1>
        <p
          style={{ fontFamily: "'Poppins', sans-serif" }}
          className="text-4xl sm:text-5xl font-extrabold text-orange-500 mt-[1rem]"
        >
          WeatherNow.
        </p>
        <div className="flex flex-col sm:flex-row justify-start space-y-3 sm:space-y-0 sm:space-x-4 mt-[2rem]">
          <Link
            to="/login"
            className="w-full sm:w-48 px-6 py-3 bg-orange-500 text-white rounded-full font-semibold shadow-md hover:bg-orange-600 transition-all duration-200 flex items-center justify-center"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="w-full sm:w-48 px-6 py-3 bg-white text-orange-500 rounded-full font-semibold border border-orange-500 shadow-md hover:bg-gray-100 transition-all duration-200 ease-in-out flex items-center justify-center"
          >
            Sign Up
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Landing;
