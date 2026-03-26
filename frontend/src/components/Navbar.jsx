import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, User as UserIcon, LogIn, Home as HomeIcon, LogOut, CheckCircle } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Read auth state from localStorage on mount and when location changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    
    if (token) {
      setIsLoggedIn(true);
      setUserRole(role);
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setUserRole(null);
    navigate('/');
  };

  const getLinkClass = (path) => {
    return `flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
      location.pathname === path 
        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-inner' 
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
    }`;
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <span className="font-extrabold text-white text-xl tracking-tighter">DH</span>
            </div>
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400 tracking-tight hidden sm:block">
              Digital Heroes
            </span>
          </Link>
          
          {/* Main Navigation */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            
            {/* NOT LOGGED IN */}
            {!isLoggedIn && (
              <>
                <Link to="/" className={getLinkClass('/')}><HomeIcon size={18} /> <span className="hidden sm:inline">Home</span></Link>
                <Link to="/login" className={getLinkClass('/login')}><LogIn size={18} /> <span className="hidden sm:inline">Login/Register</span></Link>
              </>
            )}

            {/* LOGGED IN AS USER */}
            {isLoggedIn && userRole === 'user' && (
              <>
                <Link to="/" className={getLinkClass('/')}><HomeIcon size={18} /> <span className="hidden sm:inline">Home</span></Link>
                <Link to="/dashboard" className={getLinkClass('/dashboard')}><UserIcon size={18} /> <span className="hidden sm:inline">My Dashboard</span></Link>
              </>
            )}

            {/* LOGGED IN AS ADMIN */}
            {isLoggedIn && userRole === 'admin' && (
              <>
                <Link to="/" className={getLinkClass('/')}><HomeIcon size={18} /> <span className="hidden sm:inline">Home</span></Link>
                <Link to="/admin" className={getLinkClass('/admin')}><ShieldCheck size={18} /> <span className="hidden sm:inline">Admin Dashboard</span></Link>
              </>
            )}

            {/* SHARED LOGGED-IN ACTIONS & ROLE BADGE */}
            {isLoggedIn && (
              <div className="flex items-center gap-3 sm:gap-6 ml-2 sm:ml-4 pl-2 sm:pl-4 border-l border-slate-700/60">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-widest uppercase shadow-sm ${
                  userRole === 'admin' 
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-red-500/10' 
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-emerald-500/10'
                }`}>
                  {userRole === 'admin' ? <ShieldCheck size={14} /> : <CheckCircle size={14} />}
                  <span className="hidden sm:inline">{userRole === 'admin' ? 'Admin Mode' : 'Player Mode'}</span>
                </div>

                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <LogOut size={18} /> <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;