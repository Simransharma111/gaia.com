import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        navigate("/ai-chat");
      } else {
        console.error("Login failed.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black text-white p-6">
      <h2 className="text-4xl font-bold">Login</h2>

      <input
        className="mt-4 p-3 rounded-lg bg-gray-800"
        placeholder="Email"
        type="email"
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        className="mt-4 p-3 rounded-lg bg-gray-800"
        placeholder="Password"
        type="password"
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />

      <button className="mt-6 bg-blue-600 p-3 rounded-lg" onClick={handleLogin}>
        🔐 Login
      </button>
    </div>
  );
};

export default Login;
