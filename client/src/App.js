import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import CropForm from "./components/CropForm";
import CropDetails from "./components/CropDetails";
import FertilizerForm from "./components/FertilizerForm";
import FertilizerDetails from "./components/FertilizerDetails";
import History from "./components/History";
import CropYieldDetails from "./components/CropYieldDetails";
import CropYieldPredict from "./components/CropYieldPredict";
import Analysis from "./components/Analysis";
import ChatbotPage from "./components/ChatbotPage"; 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Wrap protected components inside wrapper components that inject onLogout */}
        <Route path="/dashboard" element={<DashboardWrapper />} />
        <Route path="/history" element={<ProtectedRoute element={<History />} />} />
        <Route path="/crop-recommendation" element={<ProtectedRoute element={<CropForm />} />} />
        <Route path="/analysis" element={<ProtectedRoute element={<Analysis />} />} />
        <Route path="/fertilizer-recommendation" element={<ProtectedRoute element={<FertilizerForm />} />} />
        <Route path="/chatbot" element={<ProtectedRoute element={<ChatbotPage />} />} />
        <Route path="/crop-yield-recommendation" element={<ProtectedRoute element={<CropYieldPredict />} />} />
        <Route path="/crop-detail" element={<CropDetails />}  />
        <Route path="/fertilizer-detail" element={<FertilizerDetails />}  />
        <Route path="/crop-yield-detail"  element={<CropYieldDetails />}  />

        {/* Optionally add 404 fallback route */}
      </Routes>
    </Router>
  );
};

function DashboardWrapper() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  return <ProtectedRoute element={<Dashboard onLogout={handleLogout} />} />;
}

  

export default App;