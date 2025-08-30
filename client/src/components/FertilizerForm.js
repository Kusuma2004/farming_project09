import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Grow,
  CssBaseline,
} from "@mui/material";
import { FaMicrophone } from "react-icons/fa";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar"; // ✅ Your custom sidebar component

const FertilizerForm = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [formData, setFormData] = useState({
    temperature: "",
    humidity: "",
    moisture: "",
    soil_type: "",
    crop_type: "",
    nitrogen: "",
    phosphorous: "",
    potassium: "",
  });

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        "https://farming2090-3.onrender.com/fertilizer-predict",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResult(res.data.recommended_fertilizer);
    } catch (err) {
      setResult("Error fetching recommendation");
    } finally {
      setLoading(false);
    }
  };

  const startListening = (fieldName) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech Recognition not supported");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (e) => {
      const value = e.results[0][0].transcript.replace(/[^\d.]/g, "");
      setFormData((prev) => ({ ...prev, [fieldName]: value }));
    };
    recognition.start();
  };

  const startListeningDropdown = (fieldName, options) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech Recognition not supported");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (e) => {
      const voice = e.results[0][0].transcript.toLowerCase();
      const matched = options.find((opt) => opt.toLowerCase().includes(voice));
      if (matched) {
        setFormData((prev) => ({ ...prev, [fieldName]: matched }));
      } else {
        alert(`Could not match "${voice}"`);
      }
    };
    recognition.start();
  };

  return (
    <>
      <CssBaseline />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
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
          boxShadow: 1,
          transition: "left 0.3s",
        }}
      >
        <IconButton onClick={() => setSidebarOpen(!sidebarOpen)}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6">Fertilizer Recommendation</Typography>
      </Box>

      <Box
        sx={{
          pt: "80px",
          pl: sidebarOpen ? "260px" : 0,
          minHeight: "100vh",
          backgroundImage: `url('/fetilizer.jpg')`,
          transition: "padding-left 0.3s",
          backgroundSize: "cover",
        }}
      >
        <Grow in timeout={1000}>
          <Container maxWidth="sm" sx={{ py: 5 }}>
            <Box sx={{ p: 4, bgcolor: "white", borderRadius: 3, boxShadow: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Fertilizer Recommendation Form
              </Typography>
              <form onSubmit={handleSubmit}>
                {["temperature", "humidity", "moisture", "nitrogen", "phosphorous", "potassium"].map((field) => (
                  <TextField
                    key={field}
                    name={field}
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={formData[field]}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    type="number"
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => startListening(field)} edge="end">
                            <FaMicrophone className="text-green-600" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                ))}

                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Soil Type</InputLabel>
                  <Select
                    name="soil_type"
                    value={formData.soil_type}
                    onChange={handleChange}
                    label="Soil Type"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            startListeningDropdown("soil_type", [
                              "Loamy", "Clayey", "Sandy", "Black", "Red",
                            ])
                          }
                          edge="end"
                        >
                          <FaMicrophone />
                        </IconButton>
                      </InputAdornment>
                    }
                  >
                    {["Loamy", "Clayey", "Sandy", "Black", "Red"].map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Crop Type</InputLabel>
                  <Select
                    name="crop_type"
                    value={formData.crop_type}
                    onChange={handleChange}
                    label="Crop Type"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            startListeningDropdown("crop_type", [
                              "rice", "Wheat", "Sugarcane", "Pulses", "pomegranate",
                              "Millets", "Maize", "Ground Nuts", "Cotton", "coffee",
                              "watermelon", "Oil seeds", "Tobacco",
                            ])
                          }
                          edge="end"
                        >
                          <FaMicrophone />
                        </IconButton>
                      </InputAdornment>
                    }
                  >
                    {[
                      "rice", "Wheat", "Sugarcane", "Pulses", "pomegranate",
                      "Millets", "Maize", "Ground Nuts", "Cotton", "coffee",
                      "watermelon", "Oil seeds", "Tobacco",
                    ].map((crop) => (
                      <MenuItem key={crop} value={crop}>
                        {crop}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  type="submit"
                  sx={{ mt: 2 }}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Get Recommendation"}
                </Button>
              </form>

              {result && (
                <Box sx={{ mt: 4, p: 2, bgcolor: "#e6fffa", borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="h6" color="success.main">
                    Recommended Fertilizer:
                  </Typography>
                  <Typography variant="body1" fontStyle="italic">
                    {result}
                  </Typography>
                </Box>
              )}
            </Box>
          </Container>
        </Grow>
      </Box>
    </>
  );
};

export default FertilizerForm;
