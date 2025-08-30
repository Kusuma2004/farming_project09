import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  CssBaseline,
  Container,
  Grow,
} from '@mui/material';
import { FaMicrophone } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import MenuIcon from '@mui/icons-material/Menu';

const CropYieldPredict = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [formData, setFormData] = useState({
    Year: '',
    average_rain_fall_mm_per_year: '',
    pesticides_tonnes: '',
    avg_temp: '',
    Area: '',
    Item: '',
  });

  const [prediction, setPrediction] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const startListening = (fieldName) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert('Speech Recognition not supported.');
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      let voiceInput = event.results[0][0].transcript;
      if (["Year", "average_rain_fall_mm_per_year", "pesticides_tonnes", "avg_temp"].includes(fieldName)) {
        voiceInput = voiceInput.replace(/[^\d.]/g, '');
      }
      setFormData((prev) => ({ ...prev, [fieldName]: voiceInput }));
    };
    recognition.onerror = (e) => console.error('Speech error:', e.error);
    recognition.start();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPrediction('');
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(
        'http://127.0.0.1:5000/cropyield-predict',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPrediction(res.data.prediction);
    } catch (err) {
      setError(err.response?.data?.error || 'Prediction failed. Check input & token.');
    }
  };

  return (
    <>
      <CssBaseline />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: sidebarOpen ? '260px' : 0,
          right: 0,
          height: 56,
          bgcolor: 'background.paper',
          display: 'flex',
          alignItems: 'center',
          px: 2,
          zIndex: 1201,
          boxShadow: 1,
          transition: 'left 0.3s',
        }}
      >
        <IconButton onClick={() => setSidebarOpen(!sidebarOpen)}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6">Crop Yield Form</Typography>
      </Box>

      <Box
        sx={{
          minHeight: '100vh',
          pt: '80px',
          pl: sidebarOpen ? '260px' : 0,
          pr: 2,
          backgroundImage: `url('/crop_background.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'padding-left 0.3s',
        }}
      >
        <Grow in timeout={1000}>
          <Container maxWidth="sm" sx={{ py: 5 }}>
            <Box sx={{ bgcolor: 'white', p: 4, borderRadius: 3, boxShadow: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Predict Crop Yield
              </Typography>

              <form onSubmit={handleSubmit}>
                {Object.entries(formData).map(([key, value]) => (
                  <TextField
                    key={key}
                    name={key}
                    label={key.replace(/_/g, ' ')}
                    value={value}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => startListening(key)} edge="end">
                            <FaMicrophone style={{ color: 'green' }} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                ))}

                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Predict
                </Button>
              </form>

              {prediction && (
                <Typography variant="h6" color="primary" sx={{ mt: 3 }}>
                  Predicted Crop Yield: {prediction}
                </Typography>
              )}
              {error && (
                <Typography variant="body1" color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
            </Box>
          </Container>
        </Grow>
      </Box>
    </>
  );
};

export default CropYieldPredict;
