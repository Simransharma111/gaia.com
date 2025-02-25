import React, { useState, useEffect } from "react";

const UserPopup = ({ onSubmit, onClose }) => {
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true); // Trigger fade-in animation when mounted
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !topic) {
      alert("Please enter both name and topic.");
      return;
    }
    onSubmit({ name, topic });
  };

  const handleClose = () => {
    setIsVisible(false); // Start fade-out animation
    setTimeout(onClose, 300); // Wait for animation before unmounting
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md transition-all duration-300
        ${isVisible ? "backdrop-blur-sm" : "backdrop-blur-none opacity-0"}`}
    >
      <div
        className={`bg-white p-8 rounded-2xl shadow-2xl w-96 relative transform transition-all duration-300 ease-out
          ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition-transform duration-300 hover:rotate-90"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Tell Us About Yourself
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600">Your Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Conversation Topic:</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
          >
            Start Chat
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserPopup;
