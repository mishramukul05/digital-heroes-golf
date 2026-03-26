import { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Trophy, Heart, CreditCard, UploadCloud, FileCheck, Ghost, Frown, Sparkles, FolderOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
  const { user, checkUser } = useAuth();
  const [scores, setScores] = useState([]);
  const [newScore, setNewScore] = useState('');
  const [error, setError] = useState('');
  const [winnings, setWinnings] = useState([]);
  const [stats, setStats] = useState({ drawsEntered: 0 });
  const [charities, setCharities] = useState([]);
  const [selectedCharity, setSelectedCharity] = useState('');
  const [charityPercentage, setCharityPercentage] = useState(user?.charityPercentage || 10);
  const [isEditingCharity, setIsEditingCharity] = useState(false);
  const [updatingCharity, setUpdatingCharity] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Extract userId directly from AuthContext (handling both id and userId structures)
  const userId = user?.id || user?.userId;

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
    const fetchWinnings = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/draws/user/${userId}/winnings`);
        setWinnings(res.data);
      } catch (err) {
        console.error("Error fetching winnings", err);
      }
    };
      const fetchStats = async () => {
        try {
          const res = await axios.get(`${API_URL}/api/draws/user/${userId}/stats`);
          setStats(res.data);
        } catch (err) {
          console.error("Error fetching stats", err);
        }
      };
      const fetchCharities = async () => {
        try {
          const res = await axios.get(`${API_URL}/api/charities`);
          setCharities(res.data);
        } catch (err) {
          console.error("Error fetching charities", err);
        }
      };
      
      fetchScores();
      fetchWinnings();
      fetchStats();
      fetchCharities();
    }, [userId, API_URL]);

  const handleUpdateCharity = async (charityId, percentage) => {
    try {
      setUpdatingCharity(true);
      await axios.put(`${API_URL}/api/charities/select`, { charityId, percentage: percentage || 10 }, { withCredentials: true });
      await checkUser();
      setIsEditingCharity(false);
    } catch (err) {
      console.error("Error updating charity", err);
    } finally {
      setUpdatingCharity(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadError('');
  };

  const handleProofSubmit = async (drawId) => {
    if (!selectedFile) {
      setUploadError('Please select a file first.');
      return;
    }
    setUploading(true);
    setUploadError('');

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = async () => {
      const proofImage = reader.result; // This is the Base64 string
      try {
        await axios.put(`${API_URL}/api/draws/verify/${drawId}`, {
          userId,
          proofImage,
        });
        // Refresh winnings data to show updated status
        const res = await axios.get(`${API_URL}/api/draws/user/${userId}/winnings`);
        setWinnings(res.data);
      } catch (err) {
        setUploadError('Upload failed. Please try again.');
        console.error(err);
      } finally {
        setUploading(false);
        setSelectedFile(null);
      }
    };
    reader.onerror = (error) => {
      setUploadError('Error reading file.');
      setUploading(false);
      console.error('FileReader error: ', error);
    };
  };

  // Handle submitting a new score
  const submitScore = async (e) => {
    e.preventDefault();
    setError('');
    
    const scoreNum = parseInt(newScore);
    if (scoreNum < 1 || scoreNum > 45) {
      setError('Score must be between 1 and 45 (Stableford format).');
      return;
    }

    setIsSubmitting(true);
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
      setError(err.response?.data?.message || 'Failed to submit score. Please try again later.');
    } finally {
      setIsSubmitting(false);
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
            <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl hover:-translate-y-1 hover:border-slate-500 transition-all duration-300">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Activity className="text-blue-400" /> Log New Score
              </h2>
              <form onSubmit={submitScore} className="flex gap-4 flex-col sm:flex-row">
                <input 
                  type="number" 
                  min="1" max="45"
                  value={newScore}
                  onChange={(e) => setNewScore(e.target.value)}
                  placeholder="Enter Stableford Score (1-45)"
                  disabled={isSubmitting}
                  className="flex-1 bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 hover:-translate-y-1 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-offset-2 focus:ring-offset-slate-900 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                  ) : 'Submit'}
                </button>
              </form>
              {error && <p className="text-red-400 mt-3 text-sm flex items-center gap-2"><Frown size={16} />{error}</p>}
            </div>

            {/* Recent Scores List */}
            <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl hover:-translate-y-1 hover:border-slate-500 transition-all duration-300">
              <h2 className="text-xl font-semibold mb-2 text-slate-200">Your Rolling 5 Scores</h2>
              <p className="text-sm text-slate-400 mb-6">Only your 5 most recent rounds are kept for the monthly draw.</p>
              
              {scores.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-slate-500 bg-slate-900/50 rounded-2xl border border-slate-700/50 border-dashed transition-all duration-300 hover:border-slate-500 hover:bg-slate-900/80">
                  <FolderOpen size={48} strokeWidth={1.5} className="mb-4 text-slate-600" />
                  <p className="text-center font-medium">No scores logged yet.</p>
                  <p className="text-center text-sm mt-1">Enter your first score above!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {scores.map((s, index) => (
                    <div key={s._id} className="flex justify-between items-center bg-slate-900 p-4 rounded-2xl border border-slate-800 hover:border-slate-600 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-emerald-500/10">
                      <span className="text-slate-400 font-medium">
                        {new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-300">{s.score} <span className="text-sm text-slate-600 font-normal">pts</span></span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Winnings & Verification Section */}
            <WinningsVerification 
              winnings={winnings}
              onFileChange={handleFileChange}
              onSubmitProof={handleProofSubmit}
              selectedFile={selectedFile}
              uploading={uploading}
              uploadError={uploadError}
            />
          </div>

          {/* Right Column: Summaries */}
          <div className="space-y-8">
            {/* Charity Status */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 p-6 rounded-3xl border border-slate-700 shadow-xl hover:-translate-y-1 hover:border-slate-500 transition-all duration-300">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-200">
                  <Heart className="text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.5)]" size={22}/> Given Back
                </h3>
              </div>
              
              {user?.selectedCharity ? (
                <>
                  {!isEditingCharity ? (
                    <>
                      <p className="text-2xl font-bold text-white mb-2 tracking-tight">{user.selectedCharity.name}</p>
                      <p className="text-sm text-slate-400 leading-relaxed font-medium mb-4">
                        <span className="text-rose-400 font-bold">{user.charityPercentage || 10}%</span> of your subscription directly funds this cause.
                      </p>
                        <button onClick={() => {
                          setCharityPercentage(user.charityPercentage || 10);
                          setIsEditingCharity(true);
                        }} className="text-sm text-blue-400 hover:text-blue-300 font-medium">Change Allocation or Charity</button>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <select 
                        value={selectedCharity || user.selectedCharity._id}
                        onChange={(e) => setSelectedCharity(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                      >
                        {charities.map(c => (
                          <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                      </select>
                        
                        <div className="space-y-2">
                          <label className="text-sm text-slate-400 font-medium flex justify-between">
                            <span>Contribution Percentage</span>
                            <span className="text-cyan-400 font-bold">{charityPercentage}%</span>
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="100"
                            value={charityPercentage}
                            onChange={(e) => setCharityPercentage(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                          />
                          <p className="text-xs text-slate-500 text-center">Choose how much of your subscription goes to charity.</p>
                        </div>

                        <div className="flex gap-2 w-full mt-4">
                        <button 
                            onClick={() => handleUpdateCharity(selectedCharity || user.selectedCharity._id, charityPercentage)}
                          disabled={updatingCharity}
                          className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                        >
                          {updatingCharity ? 'Saving...' : 'Save'}
                        </button>
                        <button 
                          onClick={() => setIsEditingCharity(false)}
                          className="text-slate-400 hover:text-slate-200 px-4 py-1.5 text-sm font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    You haven't selected a charity yet. Choose where your contribution goes!
                  </p>
                  <select
                    value={selectedCharity}
                    onChange={(e) => setSelectedCharity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">-- Choose a Charity --</option>
                    {charities.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>

                  <div className="space-y-2">
                    <label className="text-sm text-slate-400 font-medium flex justify-between">
                      <span>Contribution Percentage</span>
                      <span className="text-cyan-400 font-bold">{charityPercentage}%</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={charityPercentage}
                      onChange={(e) => setCharityPercentage(Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                    <p className="text-xs text-slate-500 text-center">Choose how much of your subscription goes to charity.</p>
                  </div>

                  <button
                    onClick={() => handleUpdateCharity(selectedCharity, charityPercentage)}
                    disabled={!selectedCharity || updatingCharity}
                    className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 disabled:opacity-50 text-white font-bold py-2 rounded-xl transition-all shadow-lg"
                  >
                    {updatingCharity ? 'Saving...' : 'Select Charity'}
                  </button>
                </div>
              )}
            </div>
            {/* Winnings Status */}
            <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl hover:-translate-y-1 hover:border-slate-500 transition-all duration-300">
               <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-200">
                <Trophy className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" size={22}/> Monthly Draws
              </h3>
              <div className="mt-4 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-700/60 pb-3">
                  <span className="text-slate-400 font-medium">Draws Entered</span>
                  <span className="font-bold text-lg text-slate-100">{stats?.drawsEntered || 0}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-700/60 pb-3 group cursor-default">
                  <span className="text-slate-400 font-medium group-hover:text-emerald-400 transition-colors duration-300">Total Won</span>
                  <span className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 group-hover:scale-110 transition-transform duration-300">
                    ${winnings.reduce((sum, win) => sum + win.prizeAmount, 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-400 font-medium">Next Draw</span>
                  <span className="font-semibold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full text-sm">
                    {Math.ceil((new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1) - new Date()) / (1000 * 60 * 60 * 24))} Days
                  </span>
                </div>
              </div>
            </div>

            {/* Subscription Status */}
            <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl hover:-translate-y-1 hover:border-slate-500 transition-all duration-300">
               <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-200">
                <CreditCard className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" size={22}/> Subscription
              </h3>
              <div className="mt-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold tracking-wide mb-4 shadow-inner border ${
                  user?.subscriptionStatus === 'active' 
                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/20' 
                    : 'bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-300 border-red-500/20'
                }`}>
                  <Sparkles size={14} /> {user?.subscriptionStatus === 'active' ? `Active ${user?.subscriptionPlan ? user.subscriptionPlan.charAt(0).toUpperCase() + user.subscriptionPlan.slice(1) : 'Pro'} Member` : 'Inactive Member'}
                </span>
                {user?.subscriptionStartDate && (
                  <p className="text-sm text-slate-400 font-medium leading-relaxed mb-1">
                    Subscribed on <span className="text-slate-200">{new Date(user.subscriptionStartDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </p>
                )}
                {user?.subscriptionRenewalDate && user?.subscriptionStatus === 'active' && (
                  <>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">
                      Renews automatically on <br/><span className="text-slate-200">{new Date(user.subscriptionRenewalDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>.
                    </p>
                    <div className="mt-4 pt-4 border-t border-slate-700/60">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Remaining Time</p>
                      <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
                        {Math.max(0, Math.ceil((new Date(user.subscriptionRenewalDate) - new Date()) / (1000 * 60 * 60 * 24)))} days left
                      </p>
                    </div>
                  </>
                )}
                {user?.subscriptionRenewalDate && user?.subscriptionStatus !== 'active' && (
                  <p className="text-sm text-slate-400 font-medium leading-relaxed">
                    Subscription ended on <br/><span className="text-slate-200">{new Date(user.subscriptionRenewalDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>.
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const WinningsVerification = ({ winnings, onFileChange, onSubmitProof, selectedFile, uploading, uploadError }) => {
  const winToVerify = winnings.find(w => w.verificationStatus !== 'approved' && w.verificationStatus !== 'paid' && w.verificationStatus !== 'rejected');

  return (
    <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl hover:-translate-y-1 hover:border-slate-500 transition-all duration-300">
      <h2 className="text-xl font-semibold mb-4 text-slate-200">Winnings & Verification</h2>
      {winnings.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-slate-900/50 rounded-2xl border border-slate-700/50 border-dashed transition-all duration-300 hover:border-slate-500">
          <Ghost size={48} strokeWidth={1.5} className="mb-4 text-slate-600" />
          <p className="text-slate-400 font-medium">No winnings recorded yet.</p>
          <p className="text-sm text-slate-500 mt-1">Keep playing and stay tuned!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {winnings.map(win => (
            <div key={win._id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-slate-600 transition-all duration-300 hover:-translate-y-1 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <p className="text-slate-300 font-medium tracking-wide">
                  <span className="text-slate-500 mr-2">Month:</span>{win.month} 
                  <span className="mx-2 text-slate-600">|</span> 
                  <span className="text-slate-500 mr-2">Tier:</span>{win.matchTier}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-sm">Status:</span>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    win.verificationStatus === 'approved' || win.verificationStatus === 'paid' 
                    ? 'bg-emerald-500/10 text-emerald-400' 
                    : win.verificationStatus === 'rejected' 
                    ? 'bg-red-500/10 text-red-400' 
                    : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {win.verificationStatus.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="bg-slate-800 px-4 py-2 rounded-xl border border-slate-700">
                 <span className="text-xs text-slate-400 block text-center mb-0.5">Prize</span>
                 <span className="font-bold text-xl text-emerald-400">${win.prizeAmount}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {winToVerify && (
        <div className="mt-8 border-t border-slate-700/60 pt-8 rounded-b-3xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></div>
            <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Action Required: Verify Your Win!</h3>
          </div>
          <p className="text-slate-400 mb-6 text-sm font-medium leading-relaxed">
            To claim your prize of <span className="text-emerald-400 font-bold">${winToVerify.prizeAmount}</span>, please upload a genuine screenshot of your winning score entry below.
          </p>
          
          <div className="flex flex-col sm:flex-row items-stretch gap-4">
            <label className="flex-1 cursor-pointer bg-slate-900 border-2 border-dashed border-slate-600 hover:border-cyan-400 hover:bg-slate-800 text-slate-300 font-semibold py-4 px-4 rounded-xl transition-all duration-300 text-center group focus-within:ring-2 focus-within:ring-cyan-500 focus-within:ring-offset-2 focus-within:ring-offset-slate-900">
              <div className="flex items-center justify-center gap-3 group-hover:scale-105 transition-transform duration-300">
                {selectedFile ? <FileCheck className="text-emerald-400" /> : <UploadCloud className="text-cyan-400 group-hover:text-cyan-300" />}
                <span className="truncate max-w-[200px]">{selectedFile ? selectedFile.name : 'Choose Screenshot...'}</span>
              </div>
              <input type="file" accept="image/*" onChange={onFileChange} className="sr-only" />
            </label>
            <button
              onClick={() => onSubmitProof(winToVerify.drawId)}
              disabled={!selectedFile || uploading}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/20 disabled:shadow-none hover:-translate-y-1 focus:ring-2 focus:ring-cyan-500 focus:outline-none focus:ring-offset-2 focus:ring-offset-slate-900 disabled:hover:translate-y-0 disabled:cursor-not-allowed whitespace-nowrap min-w-[160px] flex items-center justify-center"
            >
              {uploading ? (
                <div className="flex items-center gap-2">
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                  Uploading...
                </div>
              ) : 'Submit Proof'}
            </button>
          </div>
          {uploadError && <p className="text-red-400 mt-4 text-sm flex items-center gap-2 font-medium bg-red-400/10 p-3 rounded-lg border border-red-500/20"><Frown size={16} />{uploadError}</p>}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;