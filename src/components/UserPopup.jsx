import React, { useState, useEffect } from "react";

const UserPopup = ({ onSubmit, onClose }) => {
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
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
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}>
      <div className={`bg-white p-6 rounded-lg shadow-lg w-96 transition-transform duration-300 ${isVisible ? "scale-100" : "scale-90"}`}>
        
        {/* Close Button */}
        <button onClick={handleClose} className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl">
          ✖
        </button>

        <h2 className="text-xl font-semibold text-gray-800 text-center mb-5">Tell Us About Yourself</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-600">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-600">Conversation Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Start Chat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserPopup;
