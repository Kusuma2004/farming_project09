import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Snackbar,
  Alert,
  CssBaseline,
  createTheme,
  ThemeProvider,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./Sidebar";
import ChatWidget from "./ChatWidget";
import { motion } from "framer-motion";

const MotionPaper = motion(Paper);
const generateSummary = (type, data) => {
  switch (type) {
    case "crop":
      return data === "No data" ? "No crop data." : `Recommended: ${data}`;
    case "yield":
      return data === "No data" ? "No yield data." : `Estimated: ${data} tons/ha`;
    case "fertilizer":
      return data === "No data" ? "No fertilizer data." : `Use: ${data}`;
    default:
      return "";
  }
};

const Dashboard = ({ onLogout }) => {
  const [recentPredictions, setRecentPredictions] = useState([]);
  const [currentCrop, setCurrentCrop] = useState("Loading...");
  const [yieldPrediction, setYieldPrediction] = useState("Loading...");
  const [yieldCropName, setYieldCropName] = useState("");
  const [fertilizerUsed, setFertilizerUsed] = useState("Loading...");
  const [fertilizerCropName, setFertilizerCropName] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [notification, setNotification] = useState(null);

  const theme = useMemo(() => createTheme({ palette: { mode: darkMode ? "dark" : "light" } }), [darkMode]);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setFetchError(null);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found.");

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const [cropRes, fertRes, yieldRes] = await Promise.all([
          fetch("https://farming2090-3.onrender.com/api/crop-predictions", { headers }),
          fetch("https://farming2090-3.onrender.com/api/fertilizer-recommendations", { headers }),
          fetch("https://farming2090-3.onrender.com/api/yield-predictions", { headers }),
        ]);

        if (!cropRes.ok || !fertRes.ok || !yieldRes.ok) throw new Error("Failed to fetch data.");

        const cropData = await cropRes.json();
        const fertData = await fertRes.json();
        const yieldData = await yieldRes.json();

        setCurrentCrop(cropData[0]?.cropRecommendation || "No data");
        setYieldPrediction(yieldData[0]?.predictedYield || "No data");
        setYieldCropName(yieldData[0]?.crop || "");
        setFertilizerUsed(fertData[0]?.fertilizerType || "No data");
        setFertilizerCropName(fertData[0]?.crop || "");

        if (yieldData[0]?.predictedYield < 2) {
          setNotification({
            severity: "warning",
            message: `Low yield: ${yieldData[0].predictedYield} tons/ha`,
          });
        }

        const all = [
          ...cropData.map((p) => ({ date: p.createdAt, type: "Crop", crop: p.cropRecommendation, result: "Recommended Crop" })),
          ...fertData.map((p) => ({ date: p.createdAt, type: "Fertilizer", crop: p.crop, result: p.fertilizerType })),
          ...yieldData.map((p) => ({ date: p.createdAt, type: "Yield", crop: p.crop, result: `${p.predictedYield} tons/ha` })),
        ];

        setRecentPredictions(all.sort((a, b) => new Date(b.date) - new Date(a.date)));
      } catch (err) {
        setFetchError(err.message);
        if (err.message.includes("No token")) onLogout();
      }
    };

    fetchPredictions();
  }, [onLogout]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen((o) => !o)} />

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
        <IconButton onClick={() => setSidebarOpen((o) => !o)}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Dashboard
        </Typography>
        <Button color="inherit" onClick={onLogout}>
          Logout
        </Button>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          pt: "64px",
          px: 4,
          minHeight: "100vh",
          ml: sidebarOpen ? "260px" : 0,
          transition: "margin 0.3s",
        }}
      >
        {fetchError && <Typography color="error">{fetchError}</Typography>}

        <Snackbar open={!!notification} autoHideDuration={6000} onClose={() => setNotification(null)}>
          {notification && <Alert severity={notification.severity}>{notification.message}</Alert>}
        </Snackbar>

        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          Welcome back, Farmer! Here's your overview.
        </Typography>

        {/* Dashboard Cards */}
      <Grid container spacing={3}>
  <Grid item xs={12} md={4} sx={{ display: "flex" }}>
    <MotionPaper
      elevation={4}
      sx={{
        p: 2,
        borderRadius: 3,
        background: "linear-gradient(135deg, #1f1c2c, #928DAB)",
        color: "white",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Typography variant="h6" gutterBottom>{currentCrop}</Typography>
      <Typography variant="body2">{generateSummary("crop", currentCrop)}</Typography>
    </MotionPaper>
  </Grid>

  <Grid item xs={12} md={4} sx={{ display: "flex" }}>
    <MotionPaper
      elevation={4}
      sx={{
        p: 2,
        borderRadius: 3,
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        color: "white",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
    >
      <Typography variant="h6" gutterBottom>{yieldPrediction} tons/ha</Typography>
      <Typography variant="body2">Crop: {yieldCropName}</Typography>
      <Typography variant="body2">{generateSummary("yield", yieldPrediction)}</Typography>
    </MotionPaper>
  </Grid>

  <Grid item xs={12} md={4} sx={{ display: "flex" }}>
    <MotionPaper
      elevation={4}
      sx={{
        p: 2,
        borderRadius: 3,
        background: "linear-gradient(135deg, #42275a, #734b6d)",
        color: "white",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
    >
      <Typography variant="h6" gutterBottom>{fertilizerUsed}</Typography>
      <Typography variant="body2">Crop: {fertilizerCropName}</Typography>
      <Typography variant="body2">{generateSummary("fertilizer", fertilizerUsed)}</Typography>
    </MotionPaper>
  </Grid>
</Grid>

        {/* History Table */}
        <Box mt={5}>
          <Typography variant="h6" sx={{ color: "#2e7d32", fontWeight: 600 ,}}>
            Recent Predictions
          </Typography>
          <Table>
            <TableHead>
  <TableRow sx={{ background: "linear-gradient(to right, #e0f2f1, #a5d6a7)" }}>
    <TableCell sx={{ color: "#1b5e20", fontWeight: 800 }}>Date</TableCell>
    <TableCell sx={{ color: "#1b5e20", fontWeight: 800 }}>Type</TableCell>
    <TableCell sx={{ color: "#1b5e20", fontWeight: 800 }}>Crop</TableCell>
    <TableCell sx={{ color: "#1b5e20", fontWeight: 800 }}>Result</TableCell>
  </TableRow>
</TableHead>

            <TableBody>
              {recentPredictions.length > 0 ? (
                recentPredictions.slice(0, 5).map((item, i) => (
                  <TableRow
                    key={i}
                    sx={{ backgroundColor: i % 2 === 0 ? "#e8f5e9" : "#c8e6c9" }}
                  >
                    <TableCell>{new Date(item.date).toLocaleString()}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.crop}</TableCell>
                    <TableCell>{item.result}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>No history available.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>

        {/* Chatbot */}
        <Box mt={4}>
          <Typography variant="h6">Ask Our AI Assistant</Typography>
          <ChatWidget />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;
