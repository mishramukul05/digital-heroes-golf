import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, Mail, User, ArrowRight, Frown, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-slate-700 shadow-2xl hover:border-slate-500 transition-all duration-500 hover:shadow-blue-500/10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-emerald-500/20 border border-slate-600 mb-6 shadow-inner">
            {isLogin ? <Lock className="text-blue-400" size={24} /> : <Sparkles className="text-emerald-400" size={24} />}
          </div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 tracking-tight">
            {isLogin ? 'Welcome Back' : 'Join the Impact'}
          </h2>
          <p className="text-slate-400 mt-3 font-medium">
            {isLogin ? 'Log in to track your scores and impact.' : 'Subscribe to play, track, and give back.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm flex items-center gap-3 font-medium animate-in fade-in slide-in-from-top-2 duration-300">
            <Frown size={20} className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="relative group">
              <User className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
              <input 
                name="name" id="name"
                value={formData.name}
                type="text" placeholder="Full Name" required disabled={isLoading}
                className="w-full bg-slate-900 border border-slate-600 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium placeholder:text-slate-500"
                onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
              />
            </div>
          )}
          
          <div className="relative group">
            <Mail className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
            <input 
              name="email" id="email"
              value={formData.email}
              type="email" placeholder="Email Address" required disabled={isLoading}
              className="w-full bg-slate-900 border border-slate-600 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium placeholder:text-slate-500"
              onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
            <input 
              name="password" id="password"
              value={formData.password}
              type="password" placeholder="Password" required disabled={isLoading}
              className="w-full bg-slate-900 border border-slate-600 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium tracking-widest placeholder:text-slate-500 placeholder:tracking-normal"
              onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500 text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20 disabled:shadow-none flex justify-center items-center gap-2 hover:-translate-y-1 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-offset-2 focus:ring-offset-slate-900 group/btn disabled:hover:translate-y-0 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="animate-spin h-5 w-5 border-2 border-slate-400 border-t-white rounded-full"></span>
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-700/60 text-center text-sm font-medium text-slate-400 flex flex-col gap-4">
          <div>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ name: '', email: '', password: '' }); 
              }} 
              disabled={isLoading}
              className="text-blue-400 hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 -mx-1 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLogin ? 'Sign up here' : 'Log in here'}
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
      </div>
    </div>
  );
};

export default UserAuth;