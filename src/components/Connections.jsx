import React, { useState, useEffect } from "react";

const Connections = ({ userId }) => {
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/find-matches/${userId}`)
      .then(res => res.json())
      .then(data => setConnections(data))
      .catch(err => console.error("Error:", err));
  }, [userId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">🔗 Connect with Like-Minded People</h1>
      {connections.length === 0 ? (
        <p>No matches found yet. Try chatting with Gaia first!</p>
      ) : (
        <ul>
          {connections.map(user => (
            <li key={user._id} className="mt-4 p-3 bg-gray-100 rounded-lg shadow">
              <strong>{user.username}</strong> - Similar Thoughts: {user.tags.join(", ")}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Connections;
