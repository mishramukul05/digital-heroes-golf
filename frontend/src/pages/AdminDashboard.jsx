import { useState, useEffect } from 'react';
import { Users, Trophy, BarChart, CheckCircle, Shield, DollarSign, Eye, XCircle, Check, X, Pencil, Trash2, Heart } from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [simulationResult, setSimulationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [stats, setStats] = useState({ totalUsers: 0, totalPrizePool: 0, totalCharityContributions: 0 });
  const [usersList, setUsersList] = useState([]);
  const [pendingWinners, setPendingWinners] = useState([]);
  const [recentDraws, setRecentDraws] = useState([]);
  const [selectedProof, setSelectedProof] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchStats();
    if (activeTab === 'Users') fetchUsers();
    if (activeTab === 'Winner Verification') fetchVerifications();
    if (activeTab === 'Draw Management') fetchDraws();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/stats`, { withCredentials: true });
      setStats(res.data);
    } catch (err) { console.error('Failed to fetch stats', err); }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/users`, { withCredentials: true });
      setUsersList(res.data);
    } catch (err) { console.error('Failed to fetch users', err); }
  };

  const fetchVerifications = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/pending-verifications`, { withCredentials: true });
      setPendingWinners(res.data);
    } catch (err) { console.error('Failed to fetch pending verifications', err); }
  };

  const fetchDraws = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/draws`, { withCredentials: true });
      setRecentDraws(res.data);
    } catch (err) { console.error('Failed to fetch draws', err); }
  };

  const handleRunSimulation = async () => {
    setIsLoading(true);
    setError('');
    setSimulationResult(null);
    try {
      const res = await axios.post(`${API_URL}/api/draws/run`, {}, { withCredentials: true });
      setSimulationResult(res.data.simulation);
      fetchDraws();
    } catch (err) {
      setError('Failed to run simulation. Please check the backend server.');
      console.error(err);
    }
    setIsLoading(false);
  };

  const handleVerificationAction = async (drawId, userId, action) => {
    try {
      await axios.put(`${API_URL}/api/admin/draws/${drawId}/approve`, { userId, action }, { withCredentials: true });
      fetchVerifications();
    } catch (err) {
      console.error('Error actioning verification:', err);
      alert('Failed to update status.');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return <OverviewTab stats={stats} />;
      case 'Draw Management':
        return <DrawManagementTab draws={recentDraws} onRun={handleRunSimulation} result={simulationResult} loading={isLoading} error={error} />;
      case 'Winner Verification':
        return <WinnerVerificationTab winners={pendingWinners} onAction={handleVerificationAction} onViewProof={setSelectedProof} />;
      case 'Users':
        return <UsersTab usersList={usersList} onUserUpdate={fetchUsers} API_URL={API_URL} />;
      case 'Charities':
        return <CharitiesTab API_URL={API_URL} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-8 overflow-auto relative">
        {renderContent()}

        {selectedProof && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 max-w-2xl w-full relative">
              <button onClick={() => setSelectedProof(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                <X size={24} />
              </button>
              <h3 className="text-xl font-semibold mb-4 text-white">Verification Proof</h3>
              <img src={selectedProof} alt="Proof" className="max-h-[70vh] mx-auto object-contain rounded-md" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { name: 'Overview', icon: BarChart },
    { name: 'Users', icon: Users },
    { name: 'Draw Management', icon: Trophy },
    { name: 'Winner Verification', icon: CheckCircle },
    { name: 'Charities', icon: Heart }
  ];

  return (
    <aside className="w-64 bg-slate-800/50 border-r border-slate-700 p-4 flex flex-col">
      <h1 className="text-2xl font-bold text-cyan-400 mb-10">Admin Panel</h1>
      <nav className="flex flex-col space-y-2">
        {navItems.map(item => (
          <button
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === item.name ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
            }`}
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

const OverviewTab = ({ stats }) => (
  <div className="space-y-8">
    <h2 className="text-3xl font-bold text-white">Overview</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard icon={Users} title="Total Users" value={stats.totalUsers.toLocaleString()} />
      <StatCard icon={DollarSign} title="Total Prize Pool" value={`$${stats.totalPrizePool.toLocaleString()}`} />
      <StatCard icon={Shield} title="Charity Contributions" value={`$${stats.totalCharityContributions.toLocaleString()}`} />
    </div>
  </div>
);

const StatCard = ({ icon: Icon, title, value }) => (
  <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex items-center gap-6">
    <div className="bg-slate-900 p-4 rounded-full">
      <Icon className="text-cyan-400" size={28} />
    </div>
    <div>
      <p className="text-slate-400 text-sm">{title}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  </div>
);

const DrawManagementTab = ({ draws, onRun, result, loading, error }) => (
  <div className="space-y-8">
    <h2 className="text-3xl font-bold text-white">Draw Management</h2>
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <h3 className="text-xl font-semibold mb-4">Execute Monthly Draw</h3>
      <button onClick={onRun} disabled={loading} className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200">
        {loading ? 'Running Simulation...' : 'Run Monthly Draw Simulation'}
      </button>
      {error && <p className="text-red-400 mt-4">{error}</p>}
    </div>
    {result && (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Simulation Results ({result.month})</h3>
        <p>Winning Numbers: <span className="font-mono text-cyan-300">{result.winningNumbers.join(', ')}</span></p>
        <p>Total Winners: {result.winners.length}</p>
      </div>
    )}
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <h3 className="text-xl font-semibold mb-4">Recent Draws</h3>
      <Table headers={['Month', 'Status', 'Winners']} data={draws.map(d => [d.month, d.status, d.winners.length])} />
    </div>
  </div>
);

const CharitiesTab = ({ API_URL }) => {
  const [charities, setCharities] = useState([]);
  const [editingCharity, setEditingCharity] = useState(null);
  
  useEffect(() => {
    fetchCharities();
  }, []);

  const fetchCharities = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/charities`, { withCredentials: true });
      setCharities(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingCharity.name) return;
    try {
      if (editingCharity._id) {
        await axios.put(`${API_URL}/api/admin/charities/${editingCharity._id}`, editingCharity, { withCredentials: true });
      } else {
        await axios.post(`${API_URL}/api/admin/charities`, editingCharity, { withCredentials: true });
      }
      setEditingCharity(null);
      fetchCharities();
    } catch (err) {
      alert('Error saving charity');
    }
  };

  const handleDelete = async (id) => {
    if(!confirm('Are you sure you want to delete this charity?')) return;
    try {
      await axios.delete(`${API_URL}/api/admin/charities/${id}`, { withCredentials: true });
      fetchCharities();
    } catch(err) { alert('Error deleting charity'); }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Charity Management</h2>
        <button onClick={() => setEditingCharity({ name: '', description: '', imageUrl: '', isActive: true })} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg">Add Charity</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {charities.map(c => (
          <div key={c._id} className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col items-center">
             <img src={c.imageUrl || 'https://via.placeholder.com/150'} alt={c.name} className="w-24 h-24 object-cover rounded-full mb-4" />
             <h3 className="text-xl font-bold text-white mb-2">{c.name}</h3>
             <span className={`px-2 py-1 rounded text-xs mb-2 ${c.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-600 text-slate-300'}`}>{c.isActive ? 'Active' : 'Inactive'}</span>
             <p className="text-slate-400 text-sm text-center mb-4 line-clamp-2">{c.description}</p>
             <div className="flex gap-2 mt-auto">
               <button onClick={() => setEditingCharity(c)} className="bg-cyan-600/20 text-cyan-400 hover:bg-cyan-500/30 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm"><Pencil size={14}/> Edit</button>
               <button onClick={() => handleDelete(c._id)} className="bg-rose-600/20 text-rose-400 hover:bg-rose-500/30 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm"><Trash2 size={14}/> Delete</button>
             </div>
          </div>
        ))}
      </div>

      {editingCharity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 max-w-md w-full relative">
            <h3 className="text-xl font-semibold mb-4 text-white">{editingCharity._id ? 'Edit Charity' : 'Add Charity'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div><label className="block text-sm text-slate-400 mb-1">Name</label><input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" value={editingCharity.name} onChange={e => setEditingCharity({...editingCharity, name: e.target.value})} required /></div>
              <div><label className="block text-sm text-slate-400 mb-1">Description</label><textarea className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" value={editingCharity.description} onChange={e => setEditingCharity({...editingCharity, description: e.target.value})} /></div>
              <div><label className="block text-sm text-slate-400 mb-1">Image URL</label><input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" value={editingCharity.imageUrl} onChange={e => setEditingCharity({...editingCharity, imageUrl: e.target.value})} /></div>
              <div className="flex items-center gap-2"><input type="checkbox" checked={editingCharity.isActive} onChange={e => setEditingCharity({...editingCharity, isActive: e.target.checked})} id="active" /><label htmlFor="active" className="text-white">Active</label></div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setEditingCharity(null)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const UsersTab = ({ usersList, onUserUpdate, API_URL }) => {
  const [editingUser, setEditingUser] = useState(null);
  const [viewScoresObj, setViewScoresObj] = useState(null);

  const viewScoresMode = async (u) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/scores/${u._id}`, { withCredentials: true });
      setViewScoresObj({ user: u, scores: data });
    } catch(err) { alert('Error fetching scores'); }
  };

  const handleEditScore = async (scoreId, newScoreVal) => {
    try {
       await axios.put(`${API_URL}/api/scores/${scoreId}`, { score: newScoreVal }, { withCredentials: true });
       viewScoresMode(viewScoresObj.user);
    } catch(err) { alert('Error updating score'); }
  };

  const handleDeleteScore = async (scoreId) => {
    if (!confirm('Delete this score?')) return;
    try {
       await axios.delete(`${API_URL}/api/scores/${scoreId}`, { withCredentials: true });
       viewScoresMode(viewScoresObj.user);
    } catch(err) { alert('Error deleting score'); }
  };

  const saveUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/admin/users/${editingUser._id}`, { name: editingUser.name, email: editingUser.email, subscriptionStatus: editingUser.subscriptionStatus }, { withCredentials: true });
      setEditingUser(null);
      onUserUpdate();
    } catch (err) { alert('Error saving user'); }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white">Users</h2>
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <Table
          headers={['Name', 'Email', 'Subscription', 'Charity', 'Actions']}
          data={usersList.map((u, i) => [
            <span key={`name-${i}`}>{u.name}</span>,
            <span key={`email-${i}`}>{u.email}</span>,
            <span key={`subs-${i}`} className={`px-2 py-1 rounded-full text-xs ${u.subscriptionStatus === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-300'}`}>{u.subscriptionStatus}</span>,
            <span key={`charity-${i}`}>{u.selectedCharityId ? u.selectedCharityId.name : 'None'}</span>,
            <div key={`actions-${i}`} className="flex gap-2">
               <button onClick={() => setEditingUser(u)} className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded text-slate-300" title="Edit Profile"><Pencil size={16} /></button>
               <button onClick={() => viewScoresMode(u)} className="p-1.5 bg-cyan-600/20 text-cyan-400 hover:bg-cyan-500/30 rounded" title="View/Edit Scores"><Trophy size={16} /></button>
            </div>
          ])}
        />
      </div>

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 max-w-sm w-full relative">
            <h3 className="text-xl font-semibold mb-4 text-white">Edit User</h3>
            <form onSubmit={saveUser} className="space-y-4">
              <div><label className="text-sm text-slate-400">Name</label><input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white" value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} required /></div>
              <div><label className="text-sm text-slate-400">Email</label><input type="email" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white" value={editingUser.email} onChange={e => setEditingUser({...editingUser, email: e.target.value})} required /></div>
              <div><label className="text-sm text-slate-400">Subscription Status</label>
                <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white" value={editingUser.subscriptionStatus} onChange={e => setEditingUser({...editingUser, subscriptionStatus: e.target.value})}>
                  <option value="active">active</option><option value="inactive">inactive</option><option value="past_due">past_due</option><option value="canceled">canceled</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setEditingUser(null)} className="flex-1 px-4 py-2 bg-slate-700 rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-emerald-600 rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewScoresObj && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 max-w-2xl w-full relative max-h-[80vh] overflow-y-auto">
            <button onClick={() => setViewScoresObj(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={24} /></button>
            <h3 className="text-xl font-semibold mb-4 text-white">Scores for {viewScoresObj.user.name}</h3>
            {viewScoresObj.scores.length === 0 ? <p className="text-slate-400">No scores logged yet.</p> : (
               <Table headers={['Date', 'Score', 'Status', 'Actions']} data={viewScoresObj.scores.map((s, i) => [
                  <span key={`d-${i}`}>{new Date(s.date).toLocaleDateString()}</span>,
                  <span key={`s-${i}`} className="font-mono text-cyan-400 font-bold">{s.score}</span>,
                  <span key={`st-${i}`} className="text-xs px-2 py-1 bg-slate-700 rounded-full">{s.status}</span>,
                  <div key={`a-${i}`} className="flex gap-2">
                     <button onClick={() => {
                        const val = prompt('Edit Score:', s.score);
                        if (val && !isNaN(val)) handleEditScore(s._id, parseInt(val));
                     }} className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded"><Pencil size={14} className="text-slate-300" /></button>
                     <button onClick={() => handleDeleteScore(s._id)} className="p-1.5 bg-rose-600/20 hover:bg-rose-600/40 rounded"><Trash2 size={14} className="text-rose-400" /></button>
                  </div>
               ])} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const WinnerVerificationTab = ({ winners, onAction, onViewProof }) => (
  <div className="space-y-8">
    <h2 className="text-3xl font-bold text-white">Winner Verification</h2>
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <h3 className="text-xl font-semibold mb-4">Pending Winners</h3>
      {winners.length === 0 ? (
        <p className="text-slate-400">No pending verifications at this time.</p>
      ) : (
        <Table
          headers={['Draw Month', 'User Name', 'Tier', 'Prize', 'Actions']}
          data={winners.map(w => [
            <span key={`${w.drawId}-${w.userId}-month`}>{w.drawMonth}</span>,
            <span key={`${w.drawId}-${w.userId}-name`}>{w.userName}</span>,
            <span key={`${w.drawId}-${w.userId}-tier`}>Match {w.matchTier}</span>,
            <span key={`${w.drawId}-${w.userId}-prize`}>${w.prizeAmount}</span>,
            <div key={`${w.drawId}-${w.userId}-actions`} className="flex gap-2">
              <button onClick={() => onViewProof(w.proofImage)} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md" title="View Proof"><Eye size={16} className="text-slate-300" /></button>
              <button onClick={() => onAction(w.drawId, w.userId, 'approve')} className="p-2 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-500/30 rounded-md" title="Approve"><Check size={16} /></button>
              <button onClick={() => onAction(w.drawId, w.userId, 'reject')} className="p-2 bg-rose-600/20 text-rose-400 hover:bg-rose-500/30 rounded-md" title="Reject"><XCircle size={16} /></button>
            </div>
          ])}
        />
      )}
    </div>
  </div>
);

const Table = ({ headers, data }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left">
      <thead>
        <tr className="border-b border-slate-700">
          {headers.map(h => <th key={h} className="p-4 text-slate-400 font-semibold">{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
            {row.map((cell, j) => <td key={j} className="p-4">{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default AdminDashboard;