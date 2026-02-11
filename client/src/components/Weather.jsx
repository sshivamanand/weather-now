import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { apiRequest } from "../lib/api";

function Weather() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [fetching, setFetching] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await apiRequest("/api/auth/me");
        setUser(data.user);
      } catch {
        setErrorMsg("You need to login first");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get("https://api.openweathermap.org/geo/1.0/direct", {
        params: { q: query, limit: 5, appid: OPENWEATHER_API_KEY },
      });

      setSuggestions(
        res.data.map((c) =>
          c.state ? `${c.name}, ${c.state}, ${c.country}` : `${c.name}, ${c.country}`
        )
      );
    } catch {
      setSuggestions([]);
    }
  };

  const fetchWeatherData = async () => {
    if (!location) {
      return;
    }

    setFetching(true);
    setErrorMsg("");

    const params = {
      q: location,
      appid: OPENWEATHER_API_KEY,
      units: "metric",
    };

    try {
      const currentRes = await axios.get("https://api.openweathermap.org/data/2.5/weather", { params });
      setCurrentWeather(currentRes.data);

      const forecastRes = await axios.get("https://api.openweathermap.org/data/2.5/forecast", { params });
      const dailyForecast = forecastRes.data.list.filter((item) => item.dt_txt.includes("12:00:00"));
      setForecast(dailyForecast);
      setSuggestions([]);
    } catch {
      setErrorMsg("Failed to fetch weather. Check city or ZIP code.");
      setCurrentWeather(null);
      setForecast([]);
    } finally {
      setFetching(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await apiRequest("/api/auth/logout", { method: "POST" });
      navigate("/login");
    } catch (err) {
      setErrorMsg(err.message || "Logout failed");
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-6 text-gray-600 text-lg font-poppins">Loading...</p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 font-poppins">
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errorMsg}
        </div>
      )}

      {user && (
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-3xl font-semibold text-gray-800">Welcome, {user.name}!</h2>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-black transition disabled:opacity-60"
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      )}

      <div className="relative flex justify-center mb-6 w-full max-w-4xl mx-auto">
        <input
          type="text"
          placeholder="Enter city or ZIP code"
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
            fetchSuggestions(e.target.value);
          }}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:border-orange-500"
        />
        <button
          onClick={fetchWeatherData}
          className="px-5 py-3 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600 transition flex items-center justify-center"
        >
          {fetching ? <ClipLoader size={20} color="#fff" /> : "Get Weather"}
        </button>

        {suggestions.length > 0 && (
          <ul className="absolute top-12 left-0 right-0 max-w-4xl mx-auto bg-white border border-gray-300 rounded shadow-md z-50">
            {suggestions.map((s, i) => (
              <li
                key={`${s}-${i}`}
                onClick={() => {
                  setLocation(s);
                  setSuggestions([]);
                }}
                className="px-4 py-2 hover:bg-orange-100 cursor-pointer"
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      {currentWeather && (
        <div className="p-6 rounded-2xl shadow-xl mb-6 flex flex-col items-center text-center border border-amber-200 bg-gray-50">
          <h3 className="text-3xl font-bold mb-2 text-gray-800 drop-shadow-sm">
            {currentWeather.name} ({currentWeather.sys.country})
          </h3>
          <div className="flex items-center justify-center mb-3">
            <img
              src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
              alt={currentWeather.weather[0].description}
              className="w-28 h-28"
            />
            <p className="text-4xl font-extrabold ml-4 text-gray-900">
              {Math.round(currentWeather.main.temp)}°C
            </p>
          </div>
          <p className="capitalize text-lg font-medium text-gray-700 mb-2">
            {currentWeather.weather[0].description}
          </p>
          <div className="flex justify-around w-full mt-4 text-gray-700">
            <div className="flex flex-col items-center">
              <span className="font-semibold">{currentWeather.main.feels_like}°C</span>
              <span className="text-sm text-gray-500">Feels like</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold">{currentWeather.main.humidity}%</span>
              <span className="text-sm text-gray-500">Humidity</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold">{currentWeather.wind.speed} m/s</span>
              <span className="text-sm text-gray-500">Wind</span>
            </div>
          </div>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {forecast.map((day) => (
            <div
              key={day.dt}
              className="bg-white p-4 rounded-xl shadow flex flex-col items-center text-center hover:scale-105 transform transition"
            >
              <p className="font-semibold text-gray-700">
                {new Date(day.dt_txt).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <img
                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                alt={day.weather[0].description}
                className="w-16 h-16"
              />
              <p className="capitalize font-medium mt-1">{day.weather[0].description}</p>
              <p className="mt-1">Temp: {day.main.temp}°C</p>
              <p className="mt-1">Humidity: {day.main.humidity}%</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Weather;
