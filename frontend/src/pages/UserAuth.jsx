import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, Mail, User, ArrowRight, Frown, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const UserAuth = ({ isLogin: isLoginProp = true }) => {
  const [isLogin, setIsLogin] = useState(isLoginProp);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${API_URL}${endpoint}`, formData, {
        withCredentials: true // Ensure cookie is processed
      });

      // Update localStorage for our new routing
      localStorage.setItem('token', 'auth-active');
      localStorage.setItem('userRole', res.data.role);

      login(res.data); // Update AuthContext state
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 text-slate-50 relative overflow-hidden">
      {/* Background ambient glow */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900 rounded-full blur-3xl -z-10 pointer-events-none"
      ></motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-slate-700 shadow-2xl relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        
        <div className="text-center mb-8 relative z-10">
          <motion.div 
            layout
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/10 to-emerald-500/10 border border-slate-600/50 mb-6 shadow-inner"
          >
            {isLogin ? <Lock className="text-blue-400" size={26} /> : <Sparkles className="text-emerald-400" size={26} />}
          </motion.div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login-text' : 'signup-text'}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 tracking-tight">
                {isLogin ? 'Welcome Back' : 'Join the Impact'}
              </h2>
              <p className="text-slate-400 mt-3 font-medium">
                {isLogin ? 'Log in to track your scores and impact.' : 'Subscribe to play, track, and give back.'}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm flex items-center gap-3 font-medium relative z-10"
            >
              <Frown size={20} className="shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <AnimatePresence>
            {!isLogin && (
              <motion.div 
                initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                transition={{ duration: 0.3 }}
                className="relative group"
              >
                <User className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                <input 
                  name="name" id="name"
                  value={formData.name}
                  type="text" placeholder="Full Name" required={!isLogin} disabled={isLoading}
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium placeholder:text-slate-500 hover:border-slate-500"
                  onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="relative group">
            <Mail className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
            <input 
              name="email" id="email"
              value={formData.email}
              type="email" placeholder="Email Address" required disabled={isLoading}
              className="w-full bg-slate-900 border border-slate-600 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium placeholder:text-slate-500 hover:border-slate-500"
              onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
            <input 
              name="password" id="password"
              value={formData.password}
              type="password" placeholder="Password" required disabled={isLoading}
              className="w-full bg-slate-900 border border-slate-600 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium tracking-widest placeholder:text-slate-500 placeholder:tracking-normal hover:border-slate-500"
              onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
            />
          </div>

          <motion.button 
            type="submit" 
            disabled={isLoading}
            whileHover={!isLoading ? { scale: 1.02 } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
            className="w-full mt-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500 text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] disabled:shadow-none flex justify-center items-center gap-2 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-offset-2 focus:ring-offset-slate-900 group/btn disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="animate-spin h-5 w-5 border-2 border-slate-400 border-t-white rounded-full"></span>
            ) : (
              <>
                <span className="text-[1.05rem]">{isLogin ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight size={18} className="group-hover/btn:translate-x-1.5 transition-transform duration-300" />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-700/60 text-center text-sm font-medium text-slate-400 flex flex-col gap-4 relative z-10">
          <div>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ name: '', email: '', password: '' }); 
              }} 
              disabled={isLoading}
              className="text-blue-400 hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 -mx-1 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
            >
              {isLogin ? 'Sign up here' : 'Log in here'} <ArrowRight size={14} className="inline" />
            </button>
          </div>
          
          <button 
            type="button"
            onClick={() => navigate('/admin-login')}
            className="text-slate-500 hover:text-slate-300 transition-colors text-xs border-b border-transparent hover:border-slate-500 mx-auto pb-0.5"
          >
            Switch to Admin Portal
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UserAuth;