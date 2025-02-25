import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const AIChat = () => {
  const [userMessage, setUserMessage] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voice, setVoice] = useState(null);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find(voice => voice.name.includes("Google UK English Female")) || voices.find(voice => voice.name.includes("Google UK English Male")) || voices[0];
      setVoice(selectedVoice);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const startListening = () => {
    if (isSpeaking) return; // Prevent talking while AI is speaking

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

  const [conversationHistory, setConversationHistory] = useState([]);
  const [awaitingConnectionResponse, setAwaitingConnectionResponse] = useState(false);
  
  const handleFutureTalk = async (text) => {
    let response = "";
    let tags = [];
    const great = "Great talk! Always a pleasure discussing interesting topics!";
  
    if (awaitingConnectionResponse) {
       if (/yes|sure|connect/i.test(text)) {
  try {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData) {
      response = "I couldn't find your details. Please provide your name and topic first.";
    } else {
      const res = await fetch("http://localhost:5000/api/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic: userData.topic }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch match");
      }

      const data = await res.json();

      if (data.matchedUser) {
        response = `Great! Connecting you with ${data.matchedUser.name} who shares similar thoughts on "${userData.topic}"...`;
        tags.push("connect");
      } else {
        response = "We're looking for a match. Hang tight!";
      }
    }
  } catch (error) {
    response = "Oops! Something went wrong while finding a match.";
    console.error(error);
  }
     }else {
        response = "Alright! Here's more detail on the topic...";
        tags.push("more details");
  
        console.log("Conversation History:", conversationHistory);
  
        if (conversationHistory.length > 0) {
          const firstInteraction = conversationHistory[0]; // Get the first conversation
          console.log("First Topic:", firstInteraction.topic);
  
          const detailsMap = {
            "future": "The world in 2100 will likely see AI integrated into daily life, advanced space travel, and climate-controlled cities.",
            "technology": "Nanotechnology and quantum computing might be common, and AI could assist in scientific discoveries.",
            "space": "Humans may have built self-sustaining habitats on Mars and established deep-space research stations.",
            "medicine": "Personalized AI-driven healthcare could allow treatments tailored to your genetic code.",
            "energy": "Fusion power might replace fossil fuels, providing limitless clean energy.",
            "cities": "AI-powered public transport and vertical farming could redefine urban living.",
            "entertainment": "AI-generated games, fully immersive VR worlds, and neural-linked storytelling might dominate entertainment."
          };
  
          if (firstInteraction.topic && detailsMap[firstInteraction.topic]) {
            response += " " + detailsMap[firstInteraction.topic] + great; // Append the details to response
          }
        } else {
          console.warn("No last interaction found!");
          response += " I can share more insights if you specify a topic!";
        }
      }
  
      setAwaitingConnectionResponse(false);
    } else if (/more|tell me more|explain further|what else/i.test(text)) {
      response = "Do you want to connect with other people who have similar thoughts?";
      setAwaitingConnectionResponse(true);
    } else {
      if (/future|2100|next century/i.test(text)) {
        response = "By 2100, we may have AI assisting in every aspect of life, from healthcare to space travel.";
        tags.push("future");
      } else if (/technology|robots|machines/i.test(text)) {
        response = "AI-powered robots will likely replace most manual labor, allowing humans to focus on creativity.";
        tags.push("technology");
      } else if (/space|mars|universe/i.test(text)) {
        response = "Interplanetary travel may be common, and Mars could have permanent human settlements.";
        tags.push("space");
      } else if (/medicine|health|life/i.test(text)) {
        response = "Medical AI might predict and cure diseases before symptoms appear.";
        tags.push("medicine");
      } else if (/energy|climate|environment/i.test(text)) {
        response = "Clean energy solutions might eliminate pollution, saving our planet.";
        tags.push("energy");
      } else if (/cities|transport|cars/i.test(text)) {
        response = "Flying cars, smart cities, and underground transportation systems may become a reality.";
        tags.push("cities");
      } else if (/entertainment|movies|games/i.test(text)) {
        response = "AI-driven entertainment may create movies and games based on your emotions in real time.";
        tags.push("entertainment");
      } else {
        setAiResponse("Thinking...");
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
      }
    }
  
    setConversationHistory([...conversationHistory, { question: text, response, topic: tags[0] }]);
    setAiResponse(response);
    speak(response);
    setTags(tags);
  };
  

  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 1; // Slightly faster rate
    speech.pitch = 1.5; // Higher pitch for a cuter voice
    speech.volume = 1;
    speech.voice = voice;

    setIsSpeaking(true);

    speech.onend = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(speech);
  };

  const handleGreeting = () => {
    speak("Hello! I am Gaia, an AI from the future. Let's talk about the world in 2100.");
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
        onClick={handleGreeting}
        whileHover={{ scale: 1.1 }}
      >
        🎤 Start Conversation
      </motion.button>

      <motion.button
        className="mt-6 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-200 transition"
        onClick={startListening}
        whileHover={{ scale: 1.1 }}
      >
        🎤 Talk About the Future
      </motion.button>

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
