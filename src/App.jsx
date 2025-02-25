import React, { useEffect, useState } from "react";
import axios from "axios";
import UserPopup from "./components/UserPopup";
import AIChat from "./components/AiChat";
import "./App.css";

const App = () => {
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      setShowPopup(false);
    }
  }, []);

  const handleUserSubmit = async (userData) => {
    try {
      await axios.post("http://localhost:5000/api/users", userData);
      localStorage.setItem("userData", JSON.stringify(userData));
      setShowPopup(false);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {showPopup && <UserPopup onSubmit={handleUserSubmit} />}
      
      {!showPopup && (
        <div className="w-full max-w-4xl p-6 bg-white shadow-lg rounded-lg text-center">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">
            Welcome to the Conversation Platform
          </h1>
          <AIChat />
        </div>
      )}
    </div>
  );
};

export default App;
