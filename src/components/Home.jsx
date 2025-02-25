import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black text-white p-6">
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-600">
        Welcome to Gaia AI 🌌
      </h1>

      <p className="mt-4 text-lg text-gray-300">
        Connect with like-minded individuals and AI-powered insights.
      </p>

      <div className="mt-6 flex space-x-4">
        <button
          className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-500"
          onClick={() => navigate("/signup")}
        >
          🚀 Signup
        </button>
        <button
          className="px-6 py-3 bg-gray-700 rounded-lg hover:bg-gray-600"
          onClick={() => navigate("/login")}
        >
          🔐 Login
        </button>
        <button
          className="px-6 py-3 bg-green-600 rounded-lg hover:bg-green-500"
          onClick={() => navigate("/ai-chat?guest=true")}
        >
          👤 Guest Mode
        </button>
      </div>
    </div>
  );
};

export default Home;
