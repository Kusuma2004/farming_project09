// ChatWidget.js
import React, { useState, useEffect, useRef } from "react";
import {
  IconButton,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  Select,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("English");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleChat = () => setOpen((prev) => !prev);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((msgs) => [...msgs, { from: "user", text: userMessage }]);
    setInput("");

    try {
      const res = await fetch("http://127.0.0.1:5000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, language }),
      });
      const data = await res.json();
      setMessages((msgs) => [...msgs, { from: "bot", text: data.reply }]);
    } catch (error) {
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: "Sorry, something went wrong." },
      ]);
    }
  };

  return (
    <>
      <IconButton
        onClick={toggleChat}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          bgcolor: "primary.main",
          "&:hover": { bgcolor: "primary.dark" },
          zIndex: 1300,
        }}
      >
        <ChatIcon sx={{ color: "white" }} />
      </IconButton>

      {open && (
        <Paper
          elevation={6}
          sx={{
            position: "fixed",
            bottom: 80,
            right: 24,
            width: 320,
            maxHeight: 500,
            display: "flex",
            flexDirection: "column",
            p: 2,
            zIndex: 1300,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              mb: 1,
            }}
            onClick={() => (window.location.href = "/chatbot")}
          >
           <Typography
                       variant="h5"
                       sx={{
                         fontWeight: 'bold',
                         fontFamily: "'Poppins', sans-serif",
                         background: 'linear-gradient(90deg, #00c9ff, #92fe9d)',
                         WebkitBackgroundClip: 'text',
                         WebkitTextFillColor: 'transparent',
                       }}
                     >
                       CropIQ
                     </Typography>
            <ArrowForwardIosIcon fontSize="small" />
          </Box>

          <Select
            size="small"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            sx={{ mb: 1 }}
          >
            {["English", "Hindi", "Telugu", "Tamil", "Kannada", "Bengali"].map(
              (lang) => (
                <MenuItem key={lang} value={lang}>
                  {lang}
                </MenuItem>
              )
            )}
          </Select>

          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              mb: 1,
              border: "1px solid #ddd",
              borderRadius: 1,
              p: 1,
            }}
          >
            {messages.map((msg, i) => (
              <Box
                key={i}
                sx={{
                  textAlign: msg.from === "user" ? "right" : "left",
                  mb: 1,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    display: "inline-block",
                    bgcolor:
                      msg.from === "user" ? "primary.main" : "grey.300",
                    color: msg.from === "user" ? "white" : "black",
                    borderRadius: 2,
                    px: 1.5,
                    py: 0.5,
                    maxWidth: "80%",
                    wordWrap: "break-word",
                  }}
                >
                  {msg.text}
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
            />
            <Button variant="contained" onClick={handleSend}>
              Send
            </Button>
          </Box>
        </Paper>
      )}
    </>
  );
};

export default ChatWidget;
