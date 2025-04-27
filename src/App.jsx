
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/Layout";
import Profile from "@/pages/Profile";
import Map from "@/pages/Map";
import Income from "@/pages/Income";
import Budget from "@/pages/Budget";
import Auth from "@/pages/Auth";
import Settings from "@/pages/Settings";

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Routes>
          <Route path="/auth" element={
            !isAuthenticated ? (
              <Auth onLogin={() => setIsAuthenticated(true)} />
            ) : (
              <Navigate to="/profile" replace />
            )
          } />
          
          <Route path="/" element={
            isAuthenticated ? (
              <Layout onLogout={() => setIsAuthenticated(false)} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }>
            <Route index element={<Navigate to="/profile" replace />} />
            <Route path="profile" element={<Profile />} />
            <Route path="map" element={<Map />} />
            <Route path="income" element={<Income />} />
            <Route path="budget" element={<Budget />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
