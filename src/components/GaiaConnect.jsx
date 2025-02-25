import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const AIChat = () => {
  const [userMessage, setUserMessage] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voice, setVoice] = useState(null);
  const [tags, setTags] = useState([]);
  const [greeted, setGreeted] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find(voice => voice.name.includes("Google UK English Female")) || voices.find(voice => voice.name.includes("Google UK English Male")) || voices[0];
      setVoice(selectedVoice);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const startConversation = () => {
    setStarted(true);
    handleGreeting();
  };

  const startListening = () => {
    if (isSpeaking || !started) return;
    console.log("Starting speech recognition...");
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";

    recognition.onstart = () => {
      console.log("Speech recognition started.");
      setAiResponse("Listening...");
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      console.log("Speech recognition result:", text);
      setUserMessage(text);
      handleFutureTalk(text);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      console.log("Speech recognition ended.");
    };

    recognition.start();
  };

  const handleFutureTalk = async (text) => {
    let response = "Thinking...";
    let tags = [];

    setAiResponse(response);
    speak(response);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      response = data.response;
      tags.push("dynamic");
    } catch (error) {
      console.error("Error with backend server:", error);
      response = "Sorry, I couldn't process that. Please try again.";
      tags.push("error");
    }

    setAiResponse(response);
    speak(response);
    setTags(tags);
  };

  const speak = (text) => {
    if (!voice) return;
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1.5;
    speech.volume = 1;
    speech.voice = voice;

    setIsSpeaking(true);
    speech.onend = () => {
      setIsSpeaking(false);
    };
    window.speechSynthesis.speak(speech);
  };

  const handleGreeting = () => {
    if (!greeted) {
      const greeting = "Hello! I am Gaia, an AI from the future. Let's talk about the world in 2100.";
      speak(greeting);
      setAiResponse(greeting);
      setGreeted(true);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-700 to-blue-500 text-white p-6">
      <motion.h1
        className="text-4xl md:text-5xl font-bold mb-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        🌌 Talk About 2100 with Gaia
      </motion.h1>

      {!started && (
        <motion.button
          className="mt-4 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:bg-green-600 transition"
          onClick={startConversation}
          whileHover={{ scale: 1.1 }}
        >
          🚀 Start Conversation
        </motion.button>
      )}

      {started && (
        <>
          <motion.p
            className="text-lg md:text-xl text-center max-w-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
          >
            Click the button and ask about the future! 🚀
          </motion.p>

          <motion.button
            className="mt-6 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-200 transition"
            onClick={startListening}
            whileHover={{ scale: 1.1 }}
          >
            🎤 Talk About the Future
          </motion.button>
        </>
      )}

      {userMessage && (
        <motion.div
          className="mt-6 bg-white text-black p-4 rounded-lg shadow-lg max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <strong>You:</strong> {userMessage}
        </motion.div>
      )}

      {aiResponse && (
        <motion.div
          className="mt-4 bg-green-400 text-white p-4 rounded-lg shadow-lg max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <strong>Gaia:</strong> {aiResponse}
        </motion.div>
      )}

      {tags.length > 0 && (
        <motion.div
          className="mt-4 bg-blue-400 text-white p-4 rounded-lg shadow-lg max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <strong>Tags:</strong> {tags.join(", ")}
        </motion.div>
      )}
    </div>
  );
};

export default AIChat;
