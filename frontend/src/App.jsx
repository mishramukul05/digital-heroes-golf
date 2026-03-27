import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import UserAuth from './pages/UserAuth';
import AdminAuth from './pages/AdminAuth';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SubscriptionWall from './components/SubscriptionWall';
import Navbar from './components/Navbar';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="bg-slate-900 min-h-screen text-slate-50 font-sans selection:bg-blue-500/30">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-in fade-in duration-500">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<UserAuth />} />
            <Route path="/register" element={<UserAuth isLogin={false} />} />
            <Route path="/admin-login" element={<AdminAuth />} />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <SubscriptionWall>
                    <UserDashboard />
                  </SubscriptionWall>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;