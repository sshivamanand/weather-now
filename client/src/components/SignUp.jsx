import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // New state for success message
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear any previous messages when user starts typing
    setError("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage(""); // Clear previous success message

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Signup successful, set success message
        setSuccessMessage("Signed up successfully!");
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate("/login");
        }, 1000 * 1); // Redirect after 0.5 seconds
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-[65vh]">
      <div className="w-[90%] sm:w-[400px] bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Sign Up
        </h1>

        {/* Display success message */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        {/* Display error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
          />

          {/* Email Input */}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
          />

          {/* Password Input */}
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
          />

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 mb-4 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition duration-200 disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {/* Sign Up with Google */}
        <button
          className="relative w-full px-4 py-2 mb-4 bg-white text-gray-700 border border-gray-300 rounded-lg font-semibold shadow-sm hover:bg-gray-100 transition duration-200 flex items-center justify-center"
          onClick={() => {
            window.location.href = `${
              import.meta.env.VITE_BACKEND_URL
            }/auth/google`;
          }}
        >
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
