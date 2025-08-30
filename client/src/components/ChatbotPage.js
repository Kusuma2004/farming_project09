import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("English");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = {
      Telugu: "te-IN",
      Hindi: "hi-IN",
      Tamil: "ta-IN",
      Kannada: "kn-IN",
      Bengali: "bn-IN",
      English: "en-US",
    }[language] || "en-US";
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = {
      Telugu: "te-IN",
      Hindi: "hi-IN",
      Tamil: "ta-IN",
      Kannada: "kn-IN",
      Bengali: "bn-IN",
      English: "en-US",
    }[language] || "en-US";
    recognitionRef.current = recognition;
    recognition.onresult = (e) => setInput(e.results[0][0].transcript);
    recognition.start();
  };

  const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage = input;
  setMessages((msgs) => [...msgs, { from: "user", text: userMessage }]);
  setInput("");
  window.speechSynthesis.cancel();

  try {
    const res = await fetch("https://farming2090-3.onrender.com/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage, language }),
    });
    const data = await res.json();

    const chunks = data.reply.split(/\*\*(.*?)\*\*/g).filter(Boolean); // split on **...**

    // Combine bold and normal chunks properly
    let botChunks = [];
    for (let i = 0; i < chunks.length; i++) {
      if (i % 2 === 0) {
        // Normal text
        if (chunks[i].trim()) botChunks.push({ from: "bot", text: chunks[i].trim() });
      } else {
        // Bold text
        if (chunks[i].trim()) botChunks.push({ from: "bot", text: `**${chunks[i].trim()}**` });
      }
    }

    setMessages((msgs) => [...msgs, ...botChunks]);
    speak(data.reply); // Optional: Speak full reply
  } catch (error) {
    setMessages((msgs) => [
      ...msgs,
      { from: "bot", text: "Sorry, something went wrong." },
    ]);
  }
};


  const toggleSpeaking = () => {
    if (isSpeaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.resume();
      setIsSpeaking(true);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        p: 3,
        background: "linear-gradient(135deg,rgb(95, 202, 116), #928dab)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Poppins', sans-serif",
        color: "white",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton onClick={() => navigate("/dashboard")} sx={{ color: "white" }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant="h5"
          sx={{
            ml: 1,
            flexGrow: 1,
            fontWeight: "bold",
            background: "linear-gradient(90deg, #00f2fe, #4facfe)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          CropIQ
        </Typography>
        <Tooltip title={isSpeaking ? "Pause Voice" : "Resume Voice"}>
          <IconButton onClick={toggleSpeaking} sx={{ color: "white" }}>
            {isSpeaking ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      <Select
        size="small"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        sx={{
          width: 160,
          mb: 2,
          color: "white",
          backgroundColor: "rgba(255,255,255,0.1)",
          borderRadius: 2,
          "& .MuiSelect-icon": { color: "white" },
        }}
      >
        {["English", "Hindi", "Telugu", "Tamil", "Kannada", "Bengali"].map((lang) => (
          <MenuItem key={lang} value={lang}>
            {lang}
          </MenuItem>
        ))}
      </Select>

      <Paper
        elevation={4}
        sx={{
          flexGrow: 1,
          p: 2,
          overflowY: "auto",
          borderRadius: 4,
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
        }}
      >
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                sx={{
                  textAlign: msg.from === "user" ? "right" : "left",
                  mb: 1,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    display: "inline-block",
                    px: 2,
                    py: 1,
                    borderRadius: 3,
                    background:
                      msg.from === "user"
                        ? "linear-gradient(90deg, #00c6ff, #0072ff)"
                        : "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    maxWidth: "75%",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.text}
                </Box>
              </Box>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </Paper>

      <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
        <TextField
          fullWidth
          size="small"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
          sx={{
            backgroundColor: "white",
            borderRadius: 2,
            input: { color: "#333" },
          }}
        />
        <Button onClick={handleVoiceInput} sx={{ fontSize: 20 }}>
          🎤
        </Button>
        <Button variant="contained" onClick={handleSend} sx={{
          background: "linear-gradient(90deg, #fc6076, #ff9a44)",
          color: "white",
          fontWeight: "bold",
        }}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatbotPage;
