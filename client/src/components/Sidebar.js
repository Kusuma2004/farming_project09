// src/components/Sidebar.js
import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Switch,
  Typography,
  Avatar
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Agriculture,
  ShowChart,
  Science,
  Brightness4,
  ChevronLeft as ChevronLeftIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const sidebarWidth = 260;

const Sidebar = ({ darkMode, setDarkMode, isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const navItems = [
    { text: "Dashboard", icon: <DashboardIcon />, route: "/dashboard" },
    { text: "Crop Prediction", icon: <Agriculture />, route: "/crop-recommendation" },
    { text: "Yield Estimation", icon: <ShowChart />, route: "/crop-yield-recommendation" },
    { text: "Fertilizer Advice", icon: <Science />, route: "/fertilizer-recommendation" },
    { text: "History", icon: <ShowChart />, route: "/history" },
    { text: "Analysis", icon: <ShowChart />, route: "/analysis" },
  ];

  const user = JSON.parse(localStorage.getItem("user") || '{}');
  const userName = user.name || "User";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <>
      <Box
        onClick={toggleSidebar}
        sx={{
          display: isOpen ? "block" : "none",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          bgcolor: "rgba(0,0,0,0.3)",
          zIndex: 1299,
        }}
      />
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: sidebarWidth,
          bgcolor: "background.paper",
          boxShadow: 3,
          transform: isOpen ? "translateX(0)" : `translateX(-${sidebarWidth}px)`,
          transition: "transform 0.3s",
          zIndex: 1300,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Box
            sx={{
              height: 64,
              px: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backdropFilter: "blur(10px)",
              background: "rgba(255, 255, 255, 0.1)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
              position: "sticky",
              top: 0,
              zIndex: 1400,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                fontFamily: "'Poppins', sans-serif",
                color: "#fff",
                background: "linear-gradient(90deg, #00c9ff, #92fe9d)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              CropIQ
            </Typography>
            <IconButton onClick={toggleSidebar}>
              <ChevronLeftIcon />
            </IconButton>
          </Box>

          <Box sx={{ mt: 2 }}>
            <List>
              {navItems.map(({ text, icon, route }) => (
                <ListItem button key={text} onClick={() => { navigate(route); toggleSidebar(); }}>
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List>
            <Box sx={{ pl: 2, display: "flex", alignItems: "center" }}>
              <Brightness4 />
              <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
            </Box>
          </Box>
        </Box>

        {/* Footer user display with icon and name in a row */}
        <Box sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "start",
          gap: 1,
          borderTop: "1px solid rgba(0, 0, 0, 0.1)",
          backgroundColor: "rgba(0, 0, 0, 0.03)"
        }}>
          <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32, fontSize: 16 }}>{userInitial}</Avatar>
          <Typography variant="body2" fontWeight="medium" noWrap>
            {userName}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default Sidebar;