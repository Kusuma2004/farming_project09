import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Typography,
  Button,
  Container,
  Box,
  TextField,
  Grid,
  Card,
  CardContent,
  CssBaseline,
  IconButton,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

// Check for browser compatibility
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const CropForm = ({ onLogout }) => {
  const [formData, setFormData] = useState({
    N: "", P: "", K: "", temperature: "", humidity: "", ph: "", rainfall: "",
  });

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const recognitionRef = useRef(null);
  const currentFieldRef = useRef(null);
  const navigate = useNavigate();

  const theme = useMemo(() => createTheme({ palette: { mode: darkMode ? "dark" : "light" } }), [darkMode]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const startListening = (field) => {
    if (!SpeechRecognition) return alert("Your browser does not support Speech Recognition.");
    if (recognitionRef.current) recognitionRef.current.abort();

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    currentFieldRef.current = field;

    recognition.onresult = (event) => {
      const spokenValue = event.results[0][0].transcript;
      const numericValue = parseFloat(spokenValue.replace(/[^\d.]/g, ""));
      if (!isNaN(numericValue)) {
        setFormData((prev) => ({ ...prev, [field]: numericValue }));
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      response.ok ? setResult(data.recommended_crop) : setResult("Error: " + (data.error || data.msg));
    } catch {
      setResult("Network error: Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Sidebar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* App Bar */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: sidebarOpen ? "260px" : 0,
          right: 0,
          height: 56,
          bgcolor: "background.paper",
          display: "flex",
          alignItems: "center",
          px: 2,
          zIndex: 1201,
          transition: "left 0.3s",
          boxShadow: 1,
        }}
      >
        <IconButton onClick={() => setSidebarOpen(!sidebarOpen)}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Crop Recommendation
        </Typography>
      </Box>

      {/* Banner */}
      <Box
        sx={{
          height: 260,
          backgroundImage: `url('/cropresult.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          textAlign: "center",
          flexDirection: "column",
          mt: "56px",
          ml: sidebarOpen ? "260px" : 0,
          transition: "margin-left 0.3s",
        }}
      >
        <Typography variant="body2">Home / crop-recommend</Typography>
        <Typography variant="h4" fontWeight="bold">
          Find out the most suitable crop to grow in your farm
        </Typography>
      </Box>

      {/* Main Content */}
      <Container sx={{ py: 6, ml: sidebarOpen ? "260px" : 0, transition: "margin-left 0.3s" }}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={8}>
            <Card sx={{ bgcolor: "green.50", borderRadius: 2 }}>
              <CardContent>
                <Grid container spacing={2}>
                  {["N", "P", "K", "temperature", "humidity", "ph", "rainfall"].map((field) => (
                    <Grid item xs={12} sm={6} key={field}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <TextField
                          fullWidth
                          name={field}
                          label={field.toUpperCase()}
                          value={formData[field]}
                          onChange={handleChange}
                          variant="outlined"
                          type="number"
                          required
                        />
                        <IconButton onClick={() => startListening(field)} sx={{ ml: 1 }}>
                          <MicIcon />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Box mt={4} textAlign="center">
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleSubmit}
                    sx={{ px: 5, py: 1.5 }}
                    disabled={loading}
                  >
                    {loading ? "Predicting..." : "Predict"}
                  </Button>
                </Box>

                {result && (
                  <Box
                    mt={4}
                    textAlign="center"
                    p={2}
                    sx={{
                      backgroundColor: "#e6f4ea",
                      border: "1px solid #c3e6cb",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="h6">
                      Recommended Crop: <strong>{result}</strong>
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: "grey.900", color: "white", py: 2, textAlign: "center", ml: sidebarOpen ? "260px" : 0 }}>
        <Typography variant="body2">
          © 2021 Copyright: Precision Agriculture Using Machine Learning & IOT
        </Typography>
        <Typography variant="body2">GO GREEN...</Typography>
      </Box>
    </ThemeProvider>
  );
};

export default CropForm;
