import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="bg-slate-900 min-h-screen text-white">
        <nav className="bg-slate-800 p-4">
          <div className="container mx-auto flex justify-between">
            <Link to="/" className="text-2xl font-bold text-cyan-400">Digital Heroes Golf</Link>
            <div className="flex space-x-4">
              <Link to="/" className="hover:text-cyan-300">Home</Link>
              <Link to="/login" className="hover:text-cyan-300">Login</Link>
              <Link to="/dashboard" className="hover:text-cyan-300">Dashboard</Link>
              <Link to="/admin" className="hover:text-cyan-300">Admin</Link>
            </div>
          </div>
        </nav>
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
