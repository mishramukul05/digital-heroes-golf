import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SubscriptionWall = ({ children }) => {
  const { user, checkUser } = useAuth();
  const [status, setStatus] = useState('loading'); // 'loading', 'active', 'inactive'
  const [error, setError] = useState('');
  
  const userId = user?.id || user?.userId;
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchUserStatus = async () => {
      // First, check if we're returning from a successful Stripe checkout
      const queryParams = new URLSearchParams(window.location.search);
      const sessionId = queryParams.get('session_id');
      const plan = queryParams.get('plan');
      
      if (sessionId) {
        try {
          // Verify payment directly on the backend
          await axios.post(`${API_URL}/api/payment/verify-session`, { sessionId, plan }, {
            withCredentials: true
          });
          
          // Clear query parameters from the URL safely without reloading
          window.history.replaceState({}, document.title, window.location.pathname);
          await checkUser(); // Refresh the global Auth context
          setStatus('active');
          return;
        } catch (err) {
          console.error('Session verification failed', err);
          setError('Payment verification failed. Please contact support.');
        }
      } else if (queryParams.get('payment') === 'cancelled') {
        setError('Payment was cancelled. You can try again below.');
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      if (!userId) {
        setStatus('inactive');
        return;
      }
      try {
        // Securely pull status using the HttpOnly cookie attached via withCredentials   
        const res = await axios.get(`${API_URL}/api/auth/me`, {     
          withCredentials: true
        });
        if (res.data.subscriptionStatus === 'active') {
          setStatus('active');
        } else {
          setStatus('inactive');
        }
      } catch (err) {
        console.error('Failed to fetch user status', err);
        setStatus('inactive');
      }
    };
    fetchUserStatus();
  }, [userId, API_URL, checkUser]);

  const handleSubscribe = async (plan) => {
    if (!userId) {
      alert("No user ID found. Please log in first.");
      window.location.href = '/login';
      return;
    }
    try {
      // Create Stripe Checkout Session
      const res = await axios.post(`${API_URL}/api/payment/create-checkout-session`, { plan }, {      
        withCredentials: true
      });
      
      // Redirect securely to the actual Stripe hosted checkout page
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.error('Subscription error:', err);
      setError('Payment gateway initialization failed. Please try again.');
    }
  };

  if (status === 'loading') {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-cyan-400">Loading...</div>;
  }

  if (status === 'active') {
    return children;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          Unlock Your Impact
        </h1>
        <p className="mt-4 text-lg text-slate-400">
          Join our community to support great causes while competing for monthly prizes.
        </p>
        {error && <p className="mt-4 text-rose-400 font-semibold">{error}</p>}
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Monthly Plan */}
        <PricingCard
          plan="Monthly"
          price={20}
          period="/mo"
          description=""
          features={['Track 5 scores', 'Monthly Draw Entry', '10% to Charity']}
          isPopular={false}
          onSubscribe={() => handleSubscribe('monthly')}
        />

        {/* Yearly Plan */}
        <PricingCard
          plan="Yearly"
          price={200}
          period="/yr"
          description="(Save $40)"
          features={['Track 5 scores', 'Monthly Draw Entry', '10% to Charity']}
          isPopular={true}
          onSubscribe={() => handleSubscribe('yearly')}
        />
      </div>
    </div>
  );
};

const PricingCard = ({ plan, price, period, description, features, isPopular, onSubscribe }) => (
  <div className={`relative bg-slate-800 border ${isPopular ? 'border-cyan-500' : 'border-slate-700'} rounded-2xl p-8 shadow-xl flex flex-col`}>
    {isPopular && (
      <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
        <span className="bg-cyan-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase">Most Popular</span>
      </div>
    )}
    <div className="text-center">
      <h3 className="text-2xl font-semibold text-white">{plan}</h3>
      <p className="mt-2 flex items-baseline justify-center gap-1">
        <span className="text-5xl font-bold text-white">${price}</span>
        <span className="text-slate-400">{period}</span>
      </p>
      {description && <p className="text-cyan-400 text-sm mt-1 font-medium">{description}</p>}
    </div>
    <ul className="mt-8 space-y-4 flex-1">
      {features.map((feature, i) => (
        <li key={i} className="flex items-center gap-3">
          <CheckCircle className="text-emerald-400" size={20} />
          <span className="text-slate-300">{feature}</span>
        </li>
      ))}
    </ul>
    <button 
      onClick={onSubscribe}
      className={`w-full mt-10 py-3 px-6 font-semibold rounded-lg transition-all duration-300 ${
        isPopular 
          ? 'bg-cyan-500 hover:bg-cyan-400 text-white shadow-lg shadow-cyan-500/30' 
          : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
      }`}
    >
      <div className="flex items-center justify-center gap-2">
        <Zap size={18} />
        <span>Subscribe with Stripe (Test)</span>
      </div>
    </button>
  </div>
);

export default SubscriptionWall;