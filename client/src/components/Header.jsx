import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <div>
      <div className="flex justify-between items-center mx-5 md:mx-20 h-[20vh]">
        <Link to="/" className="flex items-center space-x-2 cursor-pointer">
          <img
            src="/assets/logo.png"
            alt="logo"
            className="w-20 h-20 md:w-30 md:h-30"
          />
        </Link>

        <Link
          to="/"
          style={{ fontFamily: "'Poppins', sans-serif" }}
          className="text-2xl cursor-pointer"
        >
          WeatherNow.
        </Link>
      </div>
    </div>
  );
}

export default Header;
