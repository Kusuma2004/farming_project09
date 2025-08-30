// src/components/Analysis.js
import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  Paper,
  CssBaseline,
  createTheme,
  ThemeProvider,
  IconButton,
  Fade,
  Button,
  ButtonGroup
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  BarChart,
  LineChart,
  PieChart,
  Bar,
  Line,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from "recharts";
import Sidebar from "./Sidebar";
import { Navigate } from "react-router-dom";

const Analysis = () => {
  const [days, setDays] = useState(7);
  const [selectedTypes, setSelectedTypes] = useState(["Crop", "Fertilizer", "Yield"]);
  const [data, setData] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chartType, setChartType] = useState("bar");

  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode: darkMode ? "dark" : "light",
      },
    }), [darkMode]
  );

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchAndFilter = async () => {
      const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

      const [cropRes, fertRes, yieldRes] = await Promise.all([
        fetch("https://farming2090-3.onrender.com/api/crop-predictions", { headers }),
        fetch("https://farming2090-3.onrender.com/fertilizer-recommendations", { headers }),
        fetch("https://farming2090-3.onrender.com/api/yield-predictions", { headers }),
      ]);

      const cropData = await cropRes.json();
      const fertData = await fertRes.json();
      const yieldData = await yieldRes.json();

      const now = new Date();
      const cutoff = new Date(now.setDate(now.getDate() - days));

      const filterByDate = (arr) => arr.filter((item) => new Date(item.createdAt) >= cutoff);

      const combined = [
        ...filterByDate(cropData).map((d) => ({
          type: "Crop",
          date: new Date(d.createdAt).toLocaleDateString(),
        })),
        ...filterByDate(fertData).map((d) => ({
          type: "Fertilizer",
          date: new Date(d.createdAt).toLocaleDateString(),
        })),
        ...filterByDate(yieldData).map((d) => ({
          type: "Yield",
          date: new Date(d.createdAt).toLocaleDateString(),
        })),
      ];

      const filtered = combined.filter((item) => selectedTypes.includes(item.type));

      const counts = {};
      filtered.forEach(({ type, date }) => {
        const key = `${date}-${type}`;
        counts[key] = (counts[key] || 0) + 1;
      });

      const result = Object.entries(counts).map(([key, count]) => {
        const [date, type] = key.split("-");
        return { date, type, count };
      });

      setData(result);
    };

    fetchAndFilter();
  }, [days, selectedTypes, isAuthenticated, token]);

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <BarChart data={data} margin={{ top: 5, right: 20, bottom: 40, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" angle={-45} textAnchor="end" interval={0} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#4caf50" />
          </BarChart>
        );
      case "line":
        return (
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 40, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" angle={-45} textAnchor="end" interval={0} />
            <YAxis />
            <Tooltip />
            <Line dataKey="count" stroke="#4caf50" strokeWidth={2} />
          </LineChart>
        );
      case "pie":
        const aggregated = data.reduce((acc, item) => {
          acc[item.type] = (acc[item.type] || 0) + item.count;
          return acc;
        }, {});
        const pieData = Object.entries(aggregated).map(([type, count]) => ({ name: type, value: count }));

        return (
          <PieChart>
            <Tooltip />
            <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={150}>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={["#4caf50", "#2196f3", "#ff9800"][index % 3]} />
              ))}
            </Pie>
          </PieChart>
        );
      default:
        return null;
    }
  };

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Floating Sidebar */}
      <Fade in={isSidebarOpen} timeout={300} unmountOnExit>
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            width: 260,
            zIndex: 1300,
            boxShadow: 3,
            backgroundColor: darkMode ? "#1e1e1e" : "#fff",
          }}
        >
          <Sidebar
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            isOpen={isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </Box>
      </Fade>

      {/* Top AppBar */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: isSidebarOpen ? 260 : 0,
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
        <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ ml: 2 }}>
          Prediction Analysis
        </Typography>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          pt: 8,
          px: 4,
          py: 6,
          minHeight: "100vh",
          ml: isSidebarOpen ? 0 : 0,
          background: darkMode ? "#121212" : "#f5f5f5",
          transition: "margin 0.3s",
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography>Select Previous Days:</Typography>
          <Select value={days} onChange={(e) => setDays(e.target.value)} sx={{ width: 200 }}>
            <MenuItem value={7}>Last 7 Days</MenuItem>
            <MenuItem value={14}>Last 14 Days</MenuItem>
            <MenuItem value={30}>Last 30 Days</MenuItem>
          </Select>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography>Select Prediction Type:</Typography>
          <Select
            multiple
            value={selectedTypes}
            onChange={(e) => setSelectedTypes(e.target.value)}
            sx={{ width: 250, mt: 1 }}
            renderValue={(selected) => selected.join(", ")}
          >
            {["Crop", "Fertilizer", "Yield"].map((type) => (
              <MenuItem key={type} value={type}>
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  readOnly
                  style={{ marginRight: 10 }}
                />
                {type}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography>Choose Chart Type:</Typography>
          <ButtonGroup variant="outlined" sx={{ mt: 1 }}>
            <Button onClick={() => setChartType("bar")} variant={chartType === "bar" ? "contained" : "outlined"}>Bar</Button>
            <Button onClick={() => setChartType("line")} variant={chartType === "line" ? "contained" : "outlined"}>Line</Button>
            <Button onClick={() => setChartType("pie")} variant={chartType === "pie" ? "contained" : "outlined"}>Pie</Button>
          </ButtonGroup>
        </Box>

        <Paper
          sx={{
            p: 3,
            borderRadius: 4,
            boxShadow: 4,
            backdropFilter: "blur(10px)",
            background: darkMode ? "rgba(30,30,30,0.6)" : "rgba(255,255,255,0.6)",
          }}
        >
          <ResponsiveContainer width="100%" height={400}>
            {renderChart()}
          </ResponsiveContainer>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default Analysis;
