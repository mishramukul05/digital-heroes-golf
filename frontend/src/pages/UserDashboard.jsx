import { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Trophy, Heart, CreditCard } from 'lucide-react';

const UserDashboard = () => {
  const [scores, setScores] = useState([]);
  const [newScore, setNewScore] = useState('');
  const [error, setError] = useState('');
  
  // We use a dummy MongoDB ObjectId for testing until we build the Login system
  const userId = localStorage.getItem('userId');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Fetch existing scores when the page loads
  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/scores/${userId}`);
        setScores(res.data);
      } catch (err) {
        console.error("Error fetching scores", err);
      }
    };
    fetchScores();
  }, [userId]);

  // Handle submitting a new score
  const submitScore = async (e) => {
    e.preventDefault();
    setError('');
    
    const scoreNum = parseInt(newScore);
    if (scoreNum < 1 || scoreNum > 45) {
      setError('Score must be between 1 and 45 (Stableford format).');
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/scores`, {
        userId: userId,
        score: scoreNum,
        date: new Date()
      });
      
      // The backend returns the updated top 5 scores, so we update our state!
      setScores(res.data);
      setNewScore(''); // clear the input
    } catch (err) {
      setError('Failed to submit score. Make sure backend is running.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Player Dashboard
          </h1>
          <p className="text-slate-400 mt-2">Track your performance. Fund your cause.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Score Entry & History */}
          <div className="md:col-span-2 space-y-8">
            
            {/* Enter Score Card */}
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Activity className="text-blue-400" /> Log New Score
              </h2>
              <form onSubmit={submitScore} className="flex gap-4">
                <input 
                  type="number" 
                  min="1" max="45"
                  value={newScore}
                  onChange={(e) => setNewScore(e.target.value)}
                  placeholder="Enter Stableford Score (1-45)"
                  className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/30"
                >
                  Submit
                </button>
              </form>
              {error && <p className="text-red-400 mt-3 text-sm">{error}</p>}
            </div>

            {/* Recent Scores List */}
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
              <h2 className="text-xl font-semibold mb-4 text-slate-200">Your Rolling 5 Scores</h2>
              <p className="text-sm text-slate-400 mb-4">Only your 5 most recent rounds are kept for the monthly draw.</p>
              
              {scores.length === 0 ? (
                <div className="text-center py-8 text-slate-500 bg-slate-900/50 rounded-lg border border-slate-700/50 border-dashed">
                  No scores logged yet. Enter your first score above!
                </div>
              ) : (
                <div className="space-y-3">
                  {scores.map((s, index) => (
                    <div key={s._id} className="flex justify-between items-center bg-slate-900 p-4 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors">
                      <span className="text-slate-400 text-sm">
                        {new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="text-2xl font-bold text-emerald-400">{s.score} <span className="text-sm text-slate-500 font-normal">pts</span></span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Summaries */}
          <div className="space-y-8">
            {/* Charity Status */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-xl">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Heart className="text-rose-400" size={20}/> Active Charity
              </h3>
              <p className="text-2xl font-bold text-white mb-1">Global Green Fund</p>
              <p className="text-sm text-rose-300">15% of your subscription is actively funding this cause.</p>
            </div>

            {/* Winnings Status */}
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
               <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Trophy className="text-amber-400" size={20}/> Monthly Draws
              </h3>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between border-b border-slate-700 pb-2">
                  <span className="text-slate-400">Draws Entered</span>
                  <span className="font-semibold">3</span>
                </div>
                <div className="flex justify-between border-b border-slate-700 pb-2">
                  <span className="text-slate-400">Total Won</span>
                  <span className="font-semibold text-emerald-400">$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Next Draw</span>
                  <span className="font-semibold">In 5 days</span>
                </div>
              </div>
            </div>

            {/* Subscription Status */}
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
               <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <CreditCard className="text-blue-400" size={20}/> Subscription
              </h3>
              <div className="mt-4">
                <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-semibold mb-3">
                  Active Pro Member
                </span>
                <p className="text-sm text-slate-400">Renews automatically on April 1st, 2026.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;