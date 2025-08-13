import React from "react";
import { Link } from "react-router-dom";

function Signup() {
  return (
    <div className="flex items-center justify-center h-[65vh]">
      <div className="w-[90%] sm:w-[400px] bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Sign Up
        </h1>

        {/* Name Input */}
        <input
          type="text"
          placeholder="Full Name"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
        />

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
        />

        {/* Sign Up Button */}
        <button className="w-full px-4 py-2 mb-4 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition duration-200">
          Sign Up
        </button>

        {/* Sign Up with Google */}
        <button className="relative w-full px-4 py-2 mb-4 bg-white text-gray-700 border border-gray-300 rounded-lg font-semibold shadow-sm hover:bg-gray-100 transition duration-200 flex items-center justify-center">
          <span className="absolute left-4 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 48 48"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303
                  c-1.649,4.657-6.08,8-11.303,8
                  c-6.627,0-12-5.373-12-12
                  c0-6.627,5.373-12,12-12
                  c3.059,0,5.842,1.154,7.961,3.039
                  l5.657-5.657
                  C34.046,6.053,29.268,4,24,4
                  C12.955,4,4,12.955,4,24
                  c0,11.045,8.955,20,20,20
                  c11.045,0,20-8.955,20-20
                  C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819
                  C14.655,15.108,18.961,12,24,12
                  c3.059,0,5.842,1.154,7.961,3.039
                  l5.657-5.657
                  C34.046,6.053,29.268,4,24,4
                  C16.318,4,9.656,8.337,6.306,14.691z"
              ></path>
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192
                  l-6.19-5.238
                  C29.211,35.091,26.715,36,24,36
                  c-5.202,0-9.619-3.317-11.283-7.946
                  l-6.522,5.025
                  C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303
                  c-0.792,2.237-2.231,4.166-4.087,5.571
                  c0.001-0.001,0.002-0.001,0.003-0.002
                  l6.19,5.238
                  C36.971,39.205,44,34,44,24
                  C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </svg>
          </span>
          Sign up with Google
        </button>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
