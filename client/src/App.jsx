import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "../public/styles.css";
import Header from "./components/Header";
import Landing from "./components/Landing";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import Weather from "./components/Weather";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/weather" element={<Weather />} />
      </Routes>
    </Router>
  );
}

export default App;
