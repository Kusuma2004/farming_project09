import React, { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar"; // Ensure correct path
import Analysis from "./Analysis"; // Ensure correct path

const AnalysisPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <Box
        sx={{
          flexGrow: 1,
          ml: isSidebarOpen ? "260px" : "0",
          transition: "margin-left 0.3s",
        }}
      >
        <Analysis />
      </Box>
    </Box>
  );
};

export default AnalysisPage;
